from __future__ import annotations

import logging
import logging.config
from typing import Final

import numpy as np
import pandas as pd

from backend.config.business_rules import RECOMMENDATION_RULES, RECOMMENDATION_TIERS
from backend.config.config import FINAL_DASHBOARD_DATA_CSV, LOGGER_NAME, build_production_logging_config
from backend.scripts.financial_loss import load_dataset as load_financial_dataset


def setup_logging() -> logging.Logger:
    """Configure production logging for the recommendation engine."""

    logging.config.dictConfig(build_production_logging_config())
    return logging.getLogger(LOGGER_NAME)


def load_dataset() -> pd.DataFrame:
    """Load the final dashboard dataset.

    Uses scripts.financial_loss.load_dataset() so that columns required for
    financial recommendations already exist.
    """

    logger = logging.getLogger(LOGGER_NAME)
    if not FINAL_DASHBOARD_DATA_CSV.exists():
        raise FileNotFoundError(
            f"Final dashboard dataset not found: {FINAL_DASHBOARD_DATA_CSV}"
        )

    logger.info("Loading final dashboard dataset from %s", str(FINAL_DASHBOARD_DATA_CSV))
    return load_financial_dataset()


def _coerce_numeric(df: pd.DataFrame, col: str) -> pd.Series:
    """Coerce a dataframe column to numeric; missing cols become NA-filled."""

    if col not in df.columns:
        return pd.Series([pd.NA] * len(df), dtype="float64")
    return pd.to_numeric(df[col], errors="coerce")


def _int_flag(s: pd.Series) -> pd.Series:
    """Convert a series to an integer 0/1 flag."""

    return pd.to_numeric(s, errors="coerce").fillna(0).astype(int)


def _get_recommendations_by_tier(tier_label: str) -> list[str]:
    """Get recommendation text list for a tier label."""

    tier_rules = RECOMMENDATION_RULES.get(tier_label)
    if tier_rules is None:
        tier_rules = RECOMMENDATION_RULES.get("Warning", {"recommendations": []})
    return list(tier_rules.get("recommendations", []))


def _tier_meta(tier: str) -> dict[str, str]:
    meta = RECOMMENDATION_TIERS.get(tier)
    if meta is None:
        meta = RECOMMENDATION_TIERS.get("Warning")
    return dict(meta)


def _tier_from_operational_signals(row: pd.Series) -> str:
    """Pick a recommendation tier for a shipment row.

    Priority order (operational overrides):
    Battery Low > Shipment Delay > Temperature Issue > Humidity Issue.

    Otherwise map Risk Category to Normal/Warning/Critical using the existing
    recommendation tiers.
    """

    risk_category = str(row.get("Risk Category", "Medium Risk"))

    battery_low_flag = int(row.get("Battery Low Flag", 0) or 0)
    delay_flag = int(row.get("Delay Flag", 0) or 0)
    temperature_excursion_flag = int(row.get("Temperature Excursion Flag", 0) or 0)
    humidity_excursion_flag = int(row.get("Humidity Excursion Flag", 0) or 0)

    if battery_low_flag == 1:
        return "Battery Low"
    if delay_flag == 1:
        return "Shipment Delay"
    if temperature_excursion_flag == 1:
        return "Temperature Issue"
    if humidity_excursion_flag == 1:
        return "Humidity Issue"

    if risk_category in {"Critical Risk", "High Risk"}:
        return "Critical"
    if risk_category == "Medium Risk":
        return "Warning"
    return "Normal"


def generate_temperature_recommendation(df: pd.DataFrame) -> pd.Series:
    """Generate Temperature Recommendation text."""

    temp_risk = _coerce_numeric(df, "Temperature Risk Score").fillna(0.0)
    temp_exc_flag = _int_flag(
        df.get("Temperature Excursion Flag", pd.Series([0] * len(df), index=df.index))
    )

    tier = np.where(
        (temp_exc_flag == 1) | (temp_risk >= 75.0),
        "Temperature Issue",
        np.where(temp_risk >= 50.0, "Warning", "Normal"),
    )

    return pd.Series(tier, index=df.index, dtype=object).map(
        lambda t: "; ".join(_get_recommendations_by_tier(str(t)))
    )


def generate_humidity_recommendation(df: pd.DataFrame) -> pd.Series:
    """Generate Humidity Recommendation text."""

    hum_risk = _coerce_numeric(df, "Humidity Risk Score").fillna(0.0)
    hum_exc_flag = _int_flag(
        df.get("Humidity Excursion Flag", pd.Series([0] * len(df), index=df.index))
    )

    tier = np.where(
        (hum_exc_flag == 1) | (hum_risk >= 75.0),
        "Humidity Issue",
        np.where(hum_risk >= 50.0, "Warning", "Normal"),
    )

    return pd.Series(tier, index=df.index, dtype=object).map(
        lambda t: "; ".join(_get_recommendations_by_tier(str(t)))
    )


def generate_battery_recommendation(df: pd.DataFrame) -> pd.Series:
    """Generate Battery Recommendation text."""

    bat_risk = _coerce_numeric(df, "Battery Risk Score").fillna(0.0)
    bat_low_flag = _int_flag(
        df.get("Battery Low Flag", pd.Series([0] * len(df), index=df.index))
    )

    tier = np.where(
        (bat_low_flag == 1) | (bat_risk >= 75.0),
        "Battery Low",
        np.where(bat_risk >= 50.0, "Warning", "Normal"),
    )

    return pd.Series(tier, index=df.index, dtype=object).map(
        lambda t: "; ".join(_get_recommendations_by_tier(str(t)))
    )


def generate_shipment_recommendation(df: pd.DataFrame) -> pd.Series:
    """Generate Shipment Recommendation text."""

    delay_risk = _coerce_numeric(df, "Delay Risk Score").fillna(0.0)
    delay_flag = _int_flag(
        df.get("Delay Flag", pd.Series([0] * len(df), index=df.index))
    )

    tier = np.where(
        (delay_flag == 1) | (delay_risk >= 75.0),
        "Shipment Delay",
        np.where(delay_risk >= 50.0, "Warning", "Normal"),
    )

    return pd.Series(tier, index=df.index, dtype=object).map(
        lambda t: "; ".join(_get_recommendations_by_tier(str(t)))
    )


def generate_financial_recommendation(df: pd.DataFrame) -> pd.Series:
    """Generate Financial Recommendation text."""

    insurance_eligible = (
        df.get("Insurance Eligible", pd.Series([False] * len(df), index=df.index))
        .fillna(False)
        .astype(bool)
    )
    recovery_eligible = (
        df.get("Recovery Eligible", pd.Series([False] * len(df), index=df.index))
        .fillna(False)
        .astype(bool)
    )

    tier = np.where(
        recovery_eligible,
        "Critical",
        np.where(insurance_eligible, "Warning", "Normal"),
    )

    return pd.Series(tier, index=df.index, dtype=object).map(
        lambda t: "; ".join(_get_recommendations_by_tier(str(t)))
    )


def generate_quality_recommendation(df: pd.DataFrame) -> pd.Series:
    """Generate Quality Recommendation text using Quality Risk category."""

    quality_risk = df.get("Quality Risk")
    if quality_risk is None:
        quality_risk = pd.Series(["Medium Risk"] * len(df), index=df.index)

    tier = np.where(
        quality_risk.astype(str).eq("Critical Risk"),
        "Critical",
        np.where(
            quality_risk.astype(str).eq("High Risk"),
            "Critical",
            np.where(
                quality_risk.astype(str).eq("Medium Risk"),
                "Warning",
                "Normal",
            ),
        ),
    )

    return pd.Series(tier, index=df.index, dtype=object).map(
        lambda t: "; ".join(_get_recommendations_by_tier(str(t)))
    )


def generate_manager_recommendation(df: pd.DataFrame) -> pd.Series:
    """Generate Manager Recommendation text using Risk Category mapping."""

    risk_category = df.get("Risk Category")
    if risk_category is None:
        risk_category = pd.Series(["Medium Risk"] * len(df), index=df.index)

    tier = np.where(
        risk_category.astype(str).eq("Critical Risk"),
        "Critical",
        np.where(risk_category.astype(str).eq("High Risk"), "Warning", "Normal"),
    )

    return pd.Series(tier, index=df.index, dtype=object).map(
        lambda t: "; ".join(_get_recommendations_by_tier(str(t)))
    )


def generate_priority_action(df: pd.DataFrame) -> pd.Series:
    """Generate Priority Action (first recommendation in selected tier)."""

    tiers = df.apply(_tier_from_operational_signals, axis=1)

    def first_action(tier: str) -> str:
        recs = _get_recommendations_by_tier(str(tier))
        return str(recs[0]) if recs else ""

    return tiers.map(first_action)


def generate_final_recommendation(df: pd.DataFrame) -> pd.DataFrame:
    """Generate final recommendation & operational metadata columns."""

    tiers = df.apply(_tier_from_operational_signals, axis=1)
    final_text = tiers.map(lambda t: "; ".join(_get_recommendations_by_tier(str(t))))

    severity = tiers.map(lambda t: _tier_meta(str(t)).get("severity", "medium"))
    category = tiers.map(lambda t: _tier_meta(str(t)).get("label", str(t)))

    immediate_required = (severity.isin({"high", "critical"})) | tiers.isin(
        {"Critical", "Temperature Issue", "Humidity Issue"}
    )

    escalation_level = severity.map(
        lambda s: "L2" if s == "high" else ("L3" if s == "critical" else "L1")
    )

    return pd.DataFrame(
        {
            "Operational Recommendation": final_text,
            "Recommendation Severity": severity,
            "Recommendation Category": category,
            "Immediate Action Required": immediate_required.astype(bool),
            "Recommendation Status": pd.Series(
                ["Open"] * len(df), index=df.index, dtype=object
            ),
            "Escalation Level": escalation_level.astype(object),
            "Final Recommendation": final_text,
        },
        index=df.index,
    )


def recommendation_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """Run full recommendation generation pipeline."""

    out = df.copy()

    required_cols = [
        "Risk Category",
        "Temperature Risk Score",
        "Humidity Risk Score",
        "Battery Risk Score",
        "Delay Risk Score",
        "Temperature Excursion Flag",
        "Humidity Excursion Flag",
        "Battery Low Flag",
        "Delay Flag",
        "Quality Risk",
        "Insurance Eligible",
        "Recovery Eligible",
    ]
    missing = [c for c in required_cols if c not in out.columns]
    if missing:
        raise ValueError(f"Missing required columns for recommendations: {missing}")

    out["Temperature Recommendation"] = generate_temperature_recommendation(out)
    out["Humidity Recommendation"] = generate_humidity_recommendation(out)
    out["Battery Recommendation"] = generate_battery_recommendation(out)
    out["Shipment Recommendation"] = generate_shipment_recommendation(out)
    out["Financial Recommendation"] = generate_financial_recommendation(out)
    out["Quality Recommendation"] = generate_quality_recommendation(out)
    out["Manager Recommendation"] = generate_manager_recommendation(out)
    out["Priority Action"] = generate_priority_action(out)

    final_cols = generate_final_recommendation(out)
    for col in final_cols.columns:
        out[col] = final_cols[col]

    ordered_cols: list[str] = [
        "Operational Recommendation",
        "Temperature Recommendation",
        "Humidity Recommendation",
        "Battery Recommendation",
        "Shipment Recommendation",
        "Financial Recommendation",
        "Quality Recommendation",
        "Manager Recommendation",
        "Priority Action",
        "Recommendation Severity",
        "Recommendation Category",
        "Immediate Action Required",
        "Recommendation Status",
        "Escalation Level",
        "Final Recommendation",
    ]

    existing_ordered = [c for c in ordered_cols if c in out.columns]
    remaining = [c for c in out.columns if c not in existing_ordered]
    return out[existing_ordered + remaining]


def save_dataset(df: pd.DataFrame) -> None:
    """Save updated dataset back to FINAL_DASHBOARD_DATA_CSV."""

    logger = logging.getLogger(LOGGER_NAME)
    FINAL_DASHBOARD_DATA_CSV.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(FINAL_DASHBOARD_DATA_CSV, index=False)
    logger.info(
        "Saved recommendation dataset (%d rows, %d cols) -> %s",
        len(df),
        len(df.columns),
        str(FINAL_DASHBOARD_DATA_CSV),
    )


def main() -> None:
    """CLI entry point for recommendation generation."""

    setup_logging()
    logger = logging.getLogger(LOGGER_NAME)
    logger.info("Starting recommendation engine")

    df = load_dataset()
    out = recommendation_pipeline(df)
    save_dataset(out)

    logger.info("Recommendation engine completed")


if __name__ == "__main__":
    main()

