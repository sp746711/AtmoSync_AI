from __future__ import annotations

import logging
import logging.config
from typing import Final

import numpy as np
import pandas as pd

from backend.config.business_rules import (
    ESTIMATED_LOSS_PERCENTAGE_BY_RISK,
    RISK_SCORE_RANGES,
    SPOILAGE_PERCENTAGE_BY_RISK,
)
from backend.config.config import (
    FINAL_DASHBOARD_DATA_CSV,
    LOGGER_NAME,
    build_production_logging_config,
)

_FEATURE_EPS: Final[float] = 1e-9


def setup_logging() -> logging.Logger:
    """Configure production logging for the risk assessment script."""

    logging.config.dictConfig(build_production_logging_config())
    return logging.getLogger(LOGGER_NAME)


def load_dataset() -> pd.DataFrame:
    """Load the engineered dataset from FINAL_DASHBOARD_DATA_CSV."""

    logger = logging.getLogger(LOGGER_NAME)
    if not FINAL_DASHBOARD_DATA_CSV.exists():
        raise FileNotFoundError(
            f"Final dashboard dataset not found: {FINAL_DASHBOARD_DATA_CSV}"
        )

    logger.info("Loading final dashboard dataset from %s", str(FINAL_DASHBOARD_DATA_CSV))
    return pd.read_csv(FINAL_DASHBOARD_DATA_CSV)


def _coerce_numeric_series(df: pd.DataFrame, col: str) -> pd.Series:
    """Coerce a dataframe column to float. Returns an NA series if missing."""

    if col not in df.columns:
        return pd.Series([pd.NA] * len(df), dtype="float64")
    return pd.to_numeric(df[col], errors="coerce")


def calculate_temperature_risk(df: pd.DataFrame) -> pd.Series:
    """Calculate Temperature Risk Score (0-100) using engineered features."""

    temperature_deviation = _coerce_numeric_series(df, "Temperature Deviation")
    temperature_excursion_flag = _coerce_numeric_series(df, "Temperature Excursion Flag")

    deviation_scale = (
        temperature_deviation.quantile(0.9, interpolation="linear") + _FEATURE_EPS
    )
    risk = (temperature_deviation / deviation_scale) * 85.0
    risk = risk + temperature_excursion_flag.fillna(0.0) * 15.0

    return np.clip(risk.fillna(0.0), 0.0, 100.0)


def calculate_humidity_risk(df: pd.DataFrame) -> pd.Series:
    """Calculate Humidity Risk Score (0-100) using engineered features."""

    humidity_deviation = _coerce_numeric_series(df, "Humidity Deviation")
    humidity_excursion_flag = _coerce_numeric_series(df, "Humidity Excursion Flag")

    deviation_scale = humidity_deviation.quantile(0.9, interpolation="linear") + _FEATURE_EPS
    risk = (humidity_deviation / deviation_scale) * 85.0
    risk = risk + humidity_excursion_flag.fillna(0.0) * 15.0

    return np.clip(risk.fillna(0.0), 0.0, 100.0)


def calculate_battery_risk(df: pd.DataFrame) -> pd.Series:
    """Calculate Battery Risk Score (0-100) from engineered Battery Health Score."""

    battery_health_score = _coerce_numeric_series(df, "Battery Health Score")
    risk = 100.0 - battery_health_score
    return np.clip(risk.fillna(0.0), 0.0, 100.0)


def calculate_shock_risk(df: pd.DataFrame) -> pd.Series:
    """Calculate Shock Risk Score (0-100) using engineered Shock Severity."""

    shock_severity = _coerce_numeric_series(df, "Shock Severity")
    return np.clip((shock_severity.fillna(0.0) / 3.0) * 100.0, 0.0, 100.0)


def calculate_vibration_risk(df: pd.DataFrame) -> pd.Series:
    """Calculate Vibration Risk Score (0-100) using engineered Vibration Severity."""

    vibration_severity = _coerce_numeric_series(df, "Vibration Severity")
    return np.clip((vibration_severity.fillna(0.0) / 2.0) * 100.0, 0.0, 100.0)


def calculate_delay_risk(df: pd.DataFrame) -> pd.Series:
    """Calculate Delay Risk Score (0-100) using engineered delay features."""

    delay_hours = _coerce_numeric_series(df, "Delay Hours")
    delay_flag = _coerce_numeric_series(df, "Delay Flag")

    delay_scale = delay_hours.quantile(0.9, interpolation="linear") + _FEATURE_EPS
    risk = (delay_hours / delay_scale) * 85.0
    risk = risk + delay_flag.fillna(0.0) * 15.0

    return np.clip(risk.fillna(0.0), 0.0, 100.0)


def calculate_overall_risk(df: pd.DataFrame) -> pd.Series:
    """Calculate Overall Risk Index (0-100) from component risk scores."""

    temp_risk = _coerce_numeric_series(df, "Temperature Risk Score")
    hum_risk = _coerce_numeric_series(df, "Humidity Risk Score")
    bat_risk = _coerce_numeric_series(df, "Battery Risk Score")
    shock_risk = _coerce_numeric_series(df, "Shock Risk Score")
    vib_risk = _coerce_numeric_series(df, "Vibration Risk Score")
    delay_risk = _coerce_numeric_series(df, "Delay Risk Score")

    # Emphasize temperature/humidity quality impact; include operational/logistics risks.
    overall = (
        0.25 * temp_risk
        + 0.20 * hum_risk
        + 0.15 * delay_risk
        + 0.15 * bat_risk
        + 0.15 * shock_risk
        + 0.10 * vib_risk
    )

    return np.clip(overall.fillna(0.0), 0.0, 100.0)


def assign_risk_category(risk_score: pd.Series) -> pd.Series:
    """Assign Risk Category from risk score using RISK_SCORE_RANGES."""

    score = pd.to_numeric(risk_score, errors="coerce").fillna(0.0)
    out = pd.Series(["Low Risk"] * len(score), index=score.index, dtype=object)

    for category, rng in RISK_SCORE_RANGES.items():
        min_score = float(rng["min_score"])
        max_score = float(rng["max_score"])
        mask = score.between(min_score, max_score, inclusive="both")
        out.loc[mask] = category

    return out


def assign_risk_priority(risk_category: pd.Series) -> pd.Series:
    """Assign Risk Priority (P1-P4) based on risk category."""

    mapping = {
        "Low Risk": "P4",
        "Medium Risk": "P3",
        "High Risk": "P2",
        "Critical Risk": "P1",
    }
    return risk_category.map(mapping).fillna("P3")


def assign_risk_description(risk_category: pd.Series) -> pd.Series:
    """Assign business-friendly Risk Description."""

    descriptions = {
        "Low Risk": "Conditions are generally within acceptable cold-chain boundaries.",
        "Medium Risk": "Minor excursions or handling issues detected; increased monitoring recommended.",
        "High Risk": "Significant deviation from target conditions; prioritize quality checks and interventions.",
        "Critical Risk": "Severe cold-chain risk indicators present; quarantine and immediate escalation required.",
    }

    return risk_category.map(descriptions).fillna(descriptions["Medium Risk"])


def save_dataset(df: pd.DataFrame) -> None:
    """Save the updated dataset back to FINAL_DASHBOARD_DATA_CSV."""

    logger = logging.getLogger(LOGGER_NAME)
    FINAL_DASHBOARD_DATA_CSV.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(FINAL_DASHBOARD_DATA_CSV, index=False)
    logger.info(
        "Saved risk-assessed dataset (%d rows, %d cols) -> %s",
        len(df),
        len(df.columns),
        str(FINAL_DASHBOARD_DATA_CSV),
    )


def risk_assessment_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """Compute risk scores, classifications, and business indicators."""

    out = df.copy()

    out["Temperature Risk Score"] = calculate_temperature_risk(out).round(2)
    out["Humidity Risk Score"] = calculate_humidity_risk(out).round(2)
    out["Battery Risk Score"] = calculate_battery_risk(out).round(2)
    out["Shock Risk Score"] = calculate_shock_risk(out).round(2)
    out["Vibration Risk Score"] = calculate_vibration_risk(out).round(2)
    out["Delay Risk Score"] = calculate_delay_risk(out).round(2)

    out["Overall Risk Index"] = calculate_overall_risk(out).round(2)
    out["Risk Score"] = out["Overall Risk Index"]

    out["Risk Category"] = assign_risk_category(out["Risk Score"])
    out["Risk Priority"] = assign_risk_priority(out["Risk Category"])
    out["Risk Level"] = out["Risk Category"].str.replace(" Risk", "", regex=False)
    out["Risk Description"] = assign_risk_description(out["Risk Category"])

    # Risk slices for dashboard breakdown.
    out["Spoilage Risk"] = assign_risk_category(
        0.60 * out["Temperature Risk Score"] + 0.40 * out["Humidity Risk Score"]
    )
    out["Quality Risk"] = assign_risk_category(
        0.50 * out["Temperature Risk Score"]
        + 0.30 * out["Humidity Risk Score"]
        + 0.20 * out["Shock Risk Score"]
    )
    out["Logistics Risk"] = assign_risk_category(
        0.70 * out["Delay Risk Score"] + 0.30 * out["Vibration Risk Score"]
    )
    out["Operational Risk"] = assign_risk_category(
        0.50 * out["Battery Risk Score"]
        + 0.30 * out["Shock Risk Score"]
        + 0.20 * out["Vibration Risk Score"]
    )

    out["Financial Risk Indicator"] = out["Risk Category"].map(
        ESTIMATED_LOSS_PERCENTAGE_BY_RISK
    )

    # Additional numeric spoilage indicator for compatibility with dashboards.
    out["Spoilage Risk Indicator"] = out["Risk Category"].map(
        SPOILAGE_PERCENTAGE_BY_RISK
    )

    # Normalize NaNs introduced by mapping.
    out["Financial Risk Indicator"] = out["Financial Risk Indicator"].fillna(0.0)
    out["Spoilage Risk Indicator"] = out["Spoilage Risk Indicator"].fillna(0.0)

    return out


def main() -> None:
    """Main entry point for risk assessment."""

    setup_logging()
    logger = logging.getLogger(LOGGER_NAME)
    logger.info("Starting risk assessment pipeline")

    df = load_dataset()

    required_engineered_cols = [
        "Temperature Deviation",
        "Temperature Excursion Flag",
        "Humidity Deviation",
        "Humidity Excursion Flag",
        "Battery Health Score",
        "Shock Severity",
        "Vibration Severity",
        "Delay Hours",
        "Delay Flag",
    ]
    missing = [c for c in required_engineered_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required engineered columns: {missing}")

    assessed = risk_assessment_pipeline(df)
    save_dataset(assessed)

    logger.info("Risk assessment pipeline completed")


if __name__ == "__main__":
    main()

