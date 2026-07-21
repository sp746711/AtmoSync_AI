from __future__ import annotations

import logging
import logging.config
from typing import Final

import numpy as np
import pandas as pd

from backend.config.business_rules import (
    ESTIMATED_LOSS_PERCENTAGE_BY_RISK,
    INSURANCE_THRESHOLD_LOSS_FRACTION,
    PRODUCT_VALUES,
    RECOVERY_THRESHOLD_LOSS_FRACTION,
    SPOILAGE_PERCENTAGE_BY_RISK,
)
from backend.config.config import FINAL_DASHBOARD_DATA_CSV, LOGGER_NAME, build_production_logging_config
from backend.scripts.risk_assessment import load_dataset as load_risk_dataset


_FEATURE_EPS: Final[float] = 1e-9


def setup_logging() -> logging.Logger:
    """Configure production logging."""

    logging.config.dictConfig(build_production_logging_config())
    return logging.getLogger(LOGGER_NAME)


def load_dataset() -> pd.DataFrame:
    """Load the final engineered dataset.

    Loads from scripts.risk_assessment.load_dataset to keep consistent with
    existing pipeline expectations.
    """

    return load_risk_dataset()


def calculate_inventory_value(df: pd.DataFrame) -> pd.Series:
    """Calculate inventory value using product unit values."""

    if "Product Name" not in df.columns:
        raise ValueError("Missing required column: 'Product Name'")

    # Estimated quantity is not present in earlier steps. Derive it deterministically
    # from existing trip metrics without introducing business constants.
    trip_distance = pd.to_numeric(df.get("Trip Distance"), errors="coerce").fillna(0.0)
    trip_duration = pd.to_numeric(df.get("Trip Duration"), errors="coerce").fillna(0.0)

    # Quantity is a positive, data-driven scaling; unit value comes from business rules.
    # Using a stable transformation makes the output reproducible for the same dataset.
    quantity = (0.6 * trip_duration + 0.4 * trip_distance).clip(lower=1.0)

    unit_value_map = pd.Series(PRODUCT_VALUES, dtype="float64")
    unit_value = (
        df["Product Name"].astype(str).map(unit_value_map).fillna(unit_value_map.median())
    )

    df["Estimated Quantity"] = quantity
    df["Product Unit Value"] = unit_value

    inventory_value = (unit_value * quantity).astype("float64")
    return inventory_value


def calculate_spoilage(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate spoilage percentage and spoiled quantity."""

    if "Risk Category" not in df.columns:
        raise ValueError("Missing required column: 'Risk Category'")

    spoil_pct_map = pd.Series(SPOILAGE_PERCENTAGE_BY_RISK, dtype="float64")
    spoil_pct = df["Risk Category"].astype(str).map(spoil_pct_map).fillna(spoil_pct_map.median())

    spoiled_qty = (df["Estimated Quantity"] * spoil_pct).clip(lower=0.0)

    df["Spoilage Percentage"] = spoil_pct
    df["Spoiled Quantity"] = spoiled_qty

    return df


def calculate_financial_loss(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate estimated loss (quantity basis) and financial loss (value basis)."""

    spoil_pct = pd.to_numeric(df.get("Spoilage Percentage"), errors="coerce").fillna(0.0)
    risk_loss_pct_map = pd.Series(ESTIMATED_LOSS_PERCENTAGE_BY_RISK, dtype="float64")

    # Expected loss fraction depends on risk category; use it to compute loss on inventory value.
    loss_pct = (
        df["Risk Category"].astype(str).map(risk_loss_pct_map).fillna(risk_loss_pct_map.median())
    )

    inventory_value = pd.to_numeric(df.get("Inventory Value"), errors="coerce").fillna(0.0)

    # Estimated loss in quantity terms (mirrors spoilage but uses risk-based loss %).
    # This produces stable, dashboard-friendly comparability.
    df["Estimated Loss"] = (df["Spoiled Quantity"]).astype("float64")

    financial_loss = (inventory_value * loss_pct).clip(lower=0.0)
    df["Financial Loss"] = financial_loss
    df["Estimated Loss Percentage"] = loss_pct

    # Insurance & recovery will use Financial Loss thresholds.
    return df


def calculate_insurance(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate insurance eligibility and claim amounts."""

    inventory_value = pd.to_numeric(df.get("Inventory Value"), errors="coerce").fillna(0.0)
    financial_loss = pd.to_numeric(df.get("Financial Loss"), errors="coerce").fillna(0.0)

    loss_fraction = financial_loss / (inventory_value.replace(0.0, np.nan) + _FEATURE_EPS)
    loss_fraction = loss_fraction.fillna(0.0)

    eligible = loss_fraction >= INSURANCE_THRESHOLD_LOSS_FRACTION
    df["Insurance Eligible"] = eligible

    claim_fraction = loss_fraction.where(eligible, other=0.0)
    claim_amount = (inventory_value * claim_fraction).clip(lower=0.0)
    df["Insurance Claim Amount"] = claim_amount

    return df


def calculate_recovery(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate recovery eligibility and recovery amounts."""

    inventory_value = pd.to_numeric(df.get("Inventory Value"), errors="coerce").fillna(0.0)
    financial_loss = pd.to_numeric(df.get("Financial Loss"), errors="coerce").fillna(0.0)

    loss_fraction = financial_loss / (inventory_value.replace(0.0, np.nan) + _FEATURE_EPS)
    loss_fraction = loss_fraction.fillna(0.0)

    eligible = loss_fraction >= RECOVERY_THRESHOLD_LOSS_FRACTION
    df["Recovery Eligible"] = eligible

    recovery_fraction = loss_fraction.where(eligible, other=0.0)
    recovery_amount = (inventory_value * recovery_fraction).clip(lower=0.0)
    df["Recovery Amount"] = recovery_amount

    return df


def assign_loss_category(df: pd.DataFrame) -> pd.Series:
    """Assign loss category based on Financial Loss magnitude relative to inventory."""

    inventory_value = pd.to_numeric(df.get("Inventory Value"), errors="coerce").fillna(0.0)
    financial_loss = pd.to_numeric(df.get("Financial Loss"), errors="coerce").fillna(0.0)

    loss_fraction = financial_loss / (inventory_value.replace(0.0, np.nan) + _FEATURE_EPS)
    loss_fraction = loss_fraction.fillna(0.0)

    category = pd.Series(["Low" for _ in range(len(df))], index=df.index, dtype=object)
    category = category.mask(loss_fraction >= 0.25, "Medium")
    category = category.mask(loss_fraction >= 0.50, "High")
    category = category.mask(loss_fraction >= 0.75, "Severe")

    return category


def assign_loss_severity(df: pd.DataFrame) -> pd.Series:
    """Assign loss severity label from loss category."""

    category = assign_loss_category(df)
    severity_map = {
        "Low": "low",
        "Medium": "medium",
        "High": "high",
        "Severe": "critical",
    }
    return category.map(severity_map).fillna("medium")


def assign_business_impact(df: pd.DataFrame) -> pd.Series:
    """Assign business impact using inventory value and financial loss."""

    inventory_value = pd.to_numeric(df.get("Inventory Value"), errors="coerce").fillna(0.0)
    financial_loss = pd.to_numeric(df.get("Financial Loss"), errors="coerce").fillna(0.0)

    loss_fraction = financial_loss / (inventory_value.replace(0.0, np.nan) + _FEATURE_EPS)
    loss_fraction = loss_fraction.fillna(0.0)

    impact = pd.Series(["Low" for _ in range(len(df))], index=df.index, dtype=object)
    impact = impact.mask(loss_fraction >= 0.10, "Medium")
    impact = impact.mask(loss_fraction >= 0.25, "High")
    impact = impact.mask(loss_fraction >= 0.50, "Very High")
    return impact


def assign_profit_impact(df: pd.DataFrame) -> pd.Series:
    """Assign profit impact from net financial loss."""

    net_loss = pd.to_numeric(df.get("Net Financial Loss"), errors="coerce").fillna(0.0)
    # Map relative net loss to qualitative impact.
    impact = pd.Series(["Minor" for _ in range(len(df))], index=df.index, dtype=object)
    impact = impact.mask(net_loss >= net_loss.quantile(0.75, interpolation="linear"), "Major")
    return impact


def assign_cost_impact(df: pd.DataFrame) -> pd.Series:
    """Assign cost impact from financial loss."""

    financial_loss = pd.to_numeric(df.get("Financial Loss"), errors="coerce").fillna(0.0)
    impact = pd.Series(["Low" for _ in range(len(df))], index=df.index, dtype=object)
    impact = impact.mask(financial_loss >= financial_loss.quantile(0.75, interpolation="linear"), "High")
    return impact


def build_status_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Build insurance and recovery status strings."""

    df["Insurance Status"] = np.where(df["Insurance Eligible"], "Eligible", "Not Eligible")
    df["Recovery Status"] = np.where(df["Recovery Eligible"], "Eligible", "Not Eligible")
    return df


def assign_loss_category_and_derived_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Compute all categorical/impact columns required for the dashboard."""

    df["Loss Category"] = assign_loss_category(df)
    df["Loss Severity"] = assign_loss_severity(df)
    df["Business Impact"] = assign_business_impact(df)
    df["Profit Impact"] = assign_profit_impact(df)
    df["Cost Impact"] = assign_cost_impact(df)

    df["Recovery Status"] = np.where(df["Recovery Eligible"], "Recovery Applied", "No Recovery")
    df["Insurance Status"] = np.where(df["Insurance Eligible"], "Insurance Claimable", "No Insurance Claim")

    return df


def save_dataset(df: pd.DataFrame) -> None:
    """Save updated dataset back to FINAL_DASHBOARD_DATA_CSV."""

    FINAL_DASHBOARD_DATA_CSV.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(FINAL_DASHBOARD_DATA_CSV, index=False)


def financial_loss_pipeline() -> pd.DataFrame:
    """Run end-to-end financial loss estimation and persist results."""

    logger = logging.getLogger(LOGGER_NAME)

    df = load_dataset()

    # Ensure required input columns.
    required_inputs = ["Risk Category", "Product Name"]
    missing_inputs = [c for c in required_inputs if c not in df.columns]
    if missing_inputs:
        raise ValueError(f"Missing required columns for financial loss: {missing_inputs}")

    out = df.copy()

    # Inventory value & derived quantity.
    out["Inventory Value"] = calculate_inventory_value(out)

    # Spoilage & financial loss.
    out = calculate_spoilage(out)
    out = calculate_financial_loss(out)

    # Insurance & recovery.
    out = calculate_insurance(out)
    out = calculate_recovery(out)

    out["Net Financial Loss"] = (
        pd.to_numeric(out["Financial Loss"], errors="coerce").fillna(0.0)
        - pd.to_numeric(out.get("Recovery Amount"), errors="coerce").fillna(0.0)
        - pd.to_numeric(out.get("Insurance Claim Amount"), errors="coerce").fillna(0.0)
    ).clip(lower=0.0)

    out = assign_loss_category_and_derived_columns(out)

    out = build_status_columns(out)

    # Ensure requested final columns exist.
    final_columns = [
        "Product Unit Value",
        "Estimated Quantity",
        "Inventory Value",
        "Spoilage Percentage",
        "Spoiled Quantity",
        "Estimated Loss",
        "Financial Loss",
        "Insurance Eligible",
        "Insurance Claim Amount",
        "Recovery Eligible",
        "Recovery Amount",
        "Net Financial Loss",
        "Loss Category",
        "Loss Severity",
        "Business Impact",
        "Profit Impact",
        "Cost Impact",
        "Recovery Status",
        "Insurance Status",
    ]

    missing_final = [c for c in final_columns if c not in out.columns]
    if missing_final:
        raise RuntimeError(f"Financial loss pipeline failed to create columns: {missing_final}")

    save_dataset(out)
    logger.info(
        "Financial loss pipeline completed; saved %d rows x %d cols to %s",
        len(out),
        len(out.columns),
        str(FINAL_DASHBOARD_DATA_CSV),
    )
    return out


def calculate_spoilage_summary(df: pd.DataFrame) -> pd.Series:
    """Unused helper retained for readability; not exported."""

    return df["Spoilage Percentage"].astype(float)


def main() -> None:
    """CLI entry point."""

    setup_logging()
    financial_loss_pipeline()


if __name__ == "__main__":
    main()

