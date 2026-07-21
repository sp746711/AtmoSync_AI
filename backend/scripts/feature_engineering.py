from __future__ import annotations

import logging
import logging.config
from typing import Final

import numpy as np
import pandas as pd

from backend.config.business_rules import (
    BATTERY_CRITICAL_RANGE_PCT_MAX,
    BATTERY_CRITICAL_RANGE_PCT_MIN,
    BATTERY_LOW_THRESHOLD_PCT,
    BATTERY_SAFE_RANGE_PCT_MAX,
    BATTERY_SAFE_RANGE_PCT_MIN,
    HUMIDITY_CRITICAL_RANGE_PERCENT_MAX,
    HUMIDITY_CRITICAL_RANGE_PERCENT_MIN,
    HUMIDITY_SAFE_RANGE_PERCENT_MAX,
    HUMIDITY_SAFE_RANGE_PERCENT_MIN,
    HUMIDITY_WARNING_RANGE_PERCENT_MAX,
    HUMIDITY_WARNING_RANGE_PERCENT_MIN,
    RISK_SCORE_RANGES,
    SHIPMENT_DELAY_CRITICAL_RANGE_H_MAX,
    SHIPMENT_DELAY_CRITICAL_RANGE_H_MIN,
    SHIPMENT_DELAY_SAFE_RANGE_H_MAX,
    SHIPMENT_DELAY_SAFE_RANGE_H_MIN,
    SHIPMENT_DELAY_WARNING_RANGE_H_MAX,
    SHIPMENT_DELAY_WARNING_RANGE_H_MIN,
    TEMP_CRITICAL_RANGE_C_MAX,
    TEMP_CRITICAL_RANGE_C_MIN,
    TEMP_SAFE_RANGE_C_MAX,
    TEMP_SAFE_RANGE_C_MIN,
    TEMP_WARNING_RANGE_C_MAX,
    TEMP_WARNING_RANGE_C_MIN,
)
from backend.config.config import (
    FINAL_DASHBOARD_DATA_CSV,
    LOGGER_NAME,
    PROCESSED_SENSOR_DATA_CSV,
    build_production_logging_config,
)


_FEATURE_EPS: Final[float] = 1e-9


def setup_logging() -> logging.Logger:
    """Configure production logging for the script."""

    logging.config.dictConfig(build_production_logging_config())
    return logging.getLogger(LOGGER_NAME)


def _coerce_numeric(df: pd.DataFrame, col: str) -> pd.Series:
    if col not in df.columns:
        return pd.Series([pd.NA] * len(df), dtype="float64")
    return pd.to_numeric(df[col], errors="coerce")


def _require_columns(df: pd.DataFrame, required: list[str]) -> None:
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in input dataset: {missing}")


def load_dataset() -> pd.DataFrame:
    """Load the cleaned dataset produced by data_cleaning.py."""

    logger = logging.getLogger(LOGGER_NAME)
    if not PROCESSED_SENSOR_DATA_CSV.exists():
        raise FileNotFoundError(
            f"Processed sensor data CSV not found: {PROCESSED_SENSOR_DATA_CSV}"
        )

    logger.info("Loading processed sensor data from %s", str(PROCESSED_SENSOR_DATA_CSV))
    df = pd.read_csv(PROCESSED_SENSOR_DATA_CSV)

    # Ensure baseline columns are present.
    _require_columns(
        df,
        [
            "Timestamp",
            "Temperature",
            "Humidity",
            "Battery",
            "Shock",
            "Vibration",
            "Delay Hours",
            "Trip Distance",
            "Trip Duration",
            "Fuel Consumption",
            "Sensor Status",
            "Weather",
            "Shipment ID",
            "Container ID",
            "Origin City",
            "Destination City",
            "Transport Mode",
            "Product Category",
            "Product Name",
            "Vehicle Type",
        ],
    )

    return df


def create_temperature_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create temperature-related analytical features."""

    out = df.copy()
    temp = _coerce_numeric(out, "Temperature")

    # Safe target is the midpoint of the safe band.
    safe_mid = (TEMP_SAFE_RANGE_C_MIN + TEMP_SAFE_RANGE_C_MAX) / 2.0
    out["Temperature Deviation"] = (temp - safe_mid).abs()

    out["Temperature Excursion Flag"] = (
        (temp < TEMP_SAFE_RANGE_C_MIN) | (temp > TEMP_SAFE_RANGE_C_MAX)
    ).astype(int)

    # Risk band for temperature.
    out["Temperature Band"] = np.select(
        [
            temp < TEMP_CRITICAL_RANGE_C_MIN,
            temp.between(TEMP_CRITICAL_RANGE_C_MIN, TEMP_WARNING_RANGE_C_MIN, inclusive="both"),
            temp.between(TEMP_WARNING_RANGE_C_MIN, TEMP_SAFE_RANGE_C_MIN, inclusive="both"),
            temp.between(TEMP_SAFE_RANGE_C_MIN, TEMP_SAFE_RANGE_C_MAX, inclusive="both"),
            temp.between(TEMP_SAFE_RANGE_C_MAX, TEMP_WARNING_RANGE_C_MAX, inclusive="both"),
            temp.between(TEMP_WARNING_RANGE_C_MAX, TEMP_CRITICAL_RANGE_C_MAX, inclusive="both"),
            temp > TEMP_CRITICAL_RANGE_C_MAX,
        ],
        [
            "Critical",
            "Critical",
            "Warning",
            "Safe",
            "Warning",
            "Critical",
            "Critical",
        ],
        default="Warning",
    )

    return out


def create_humidity_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create humidity-related analytical features."""

    out = df.copy()
    humidity = _coerce_numeric(out, "Humidity")

    safe_mid = (HUMIDITY_SAFE_RANGE_PERCENT_MIN + HUMIDITY_SAFE_RANGE_PERCENT_MAX) / 2.0
    out["Humidity Deviation"] = (humidity - safe_mid).abs()

    out["Humidity Excursion Flag"] = (
        (humidity < HUMIDITY_SAFE_RANGE_PERCENT_MIN) | (humidity > HUMIDITY_SAFE_RANGE_PERCENT_MAX)
    ).astype(int)

    out["Humidity Band"] = np.select(
        [
            humidity < HUMIDITY_CRITICAL_RANGE_PERCENT_MIN,
            humidity.between(HUMIDITY_CRITICAL_RANGE_PERCENT_MIN, HUMIDITY_WARNING_RANGE_PERCENT_MIN, inclusive="both"),
            humidity.between(HUMIDITY_WARNING_RANGE_PERCENT_MIN, HUMIDITY_SAFE_RANGE_PERCENT_MIN, inclusive="both"),
            humidity.between(HUMIDITY_SAFE_RANGE_PERCENT_MIN, HUMIDITY_SAFE_RANGE_PERCENT_MAX, inclusive="both"),
            humidity.between(HUMIDITY_SAFE_RANGE_PERCENT_MAX, HUMIDITY_WARNING_RANGE_PERCENT_MAX, inclusive="both"),
            humidity.between(HUMIDITY_WARNING_RANGE_PERCENT_MAX, HUMIDITY_CRITICAL_RANGE_PERCENT_MAX, inclusive="both"),
            humidity > HUMIDITY_CRITICAL_RANGE_PERCENT_MAX,
        ],
        [
            "Critical",
            "Critical",
            "Warning",
            "Safe",
            "Warning",
            "Critical",
            "Critical",
        ],
        default="Warning",
    )

    return out


def create_battery_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create battery-related analytical features."""

    out = df.copy()
    battery = _coerce_numeric(out, "Battery")

    # Health score: 100 at/above safe max, lower towards 0 near critical.
    # We avoid hard thresholds beyond business-rule ranges by using min/max bands.
    score = (battery - BATTERY_SAFE_RANGE_PCT_MIN) / (
        (BATTERY_SAFE_RANGE_PCT_MAX - BATTERY_SAFE_RANGE_PCT_MIN) + _FEATURE_EPS
    ) * 100.0

    # Remap using critical bounds.
    critical_span = (BATTERY_CRITICAL_RANGE_PCT_MAX - BATTERY_CRITICAL_RANGE_PCT_MIN) + _FEATURE_EPS
    score_critical = (
        (battery - BATTERY_CRITICAL_RANGE_PCT_MIN) / critical_span
    ) * 40.0  # reserve up to 40 points for critical->critical max

    out["Battery Health Score"] = np.where(
        battery >= BATTERY_SAFE_RANGE_PCT_MIN,
        np.clip(score, 0.0, 100.0),
        np.clip(score_critical, 0.0, 40.0),
    )

    out["Battery Status"] = np.select(
        [
            battery <= BATTERY_LOW_THRESHOLD_PCT,
            battery.between(BATTERY_SAFE_RANGE_PCT_MIN, BATTERY_SAFE_RANGE_PCT_MAX, inclusive="both"),
            battery.between(BATTERY_CRITICAL_RANGE_PCT_MIN, BATTERY_CRITICAL_RANGE_PCT_MAX, inclusive="both"),
            battery.between(BATTERY_SAFE_RANGE_PCT_MIN, BATTERY_SAFE_RANGE_PCT_MAX, inclusive="left"),
        ],
        [
            "Critical",
            "Healthy",
            "Critical",
            "Warning",
        ],
        default="Warning",
    )

    out["Battery Low Flag"] = (battery <= BATTERY_LOW_THRESHOLD_PCT).astype(int)

    return out


def create_shock_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create shock-related analytical features."""

    out = df.copy()
    shock = _coerce_numeric(out, "Shock")

    # Normalize using assumed physical range; avoid hardcoding by using quantiles as data-driven.
    # Still, we do not use hard limits; quantiles are computed at runtime.
    shock_p50 = shock.quantile(0.5, interpolation="linear")
    shock_p80 = shock.quantile(0.8, interpolation="linear")
    shock_p90 = shock.quantile(0.9, interpolation="linear")

    out["Shock Severity"] = np.select(
        [shock >= shock_p90, shock >= shock_p80, shock >= shock_p50],
        [3, 2, 1],
        default=0,
    ).astype(int)

    # High shock flag uses the 90th percentile severity.
    out["High Shock Flag"] = (shock >= shock_p90).astype(int)

    return out


def create_delay_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create shipment delay-related analytical features."""

    out = df.copy()
    delay = _coerce_numeric(out, "Delay Hours")

    out["Delay Category"] = np.select(
        [
            delay.between(SHIPMENT_DELAY_SAFE_RANGE_H_MIN, SHIPMENT_DELAY_SAFE_RANGE_H_MAX, inclusive="both"),
            delay.between(SHIPMENT_DELAY_WARNING_RANGE_H_MIN, SHIPMENT_DELAY_WARNING_RANGE_H_MAX, inclusive="both"),
            delay.between(SHIPMENT_DELAY_CRITICAL_RANGE_H_MIN, SHIPMENT_DELAY_CRITICAL_RANGE_H_MAX, inclusive="both"),
        ],
        ["Safe", "Warning", "Critical"],
        default="Critical",
    )

    out["Delay Flag"] = (delay > SHIPMENT_DELAY_SAFE_RANGE_H_MAX).astype(int)

    # Journey Duration Category for downstream grouping.
    trip_duration = _coerce_numeric(out, "Trip Duration")
    out["Journey Duration Category"] = np.select(
        [
            trip_duration <= trip_duration.quantile(0.33),
            trip_duration <= trip_duration.quantile(0.66),
            trip_duration > trip_duration.quantile(0.66),
        ],
        ["Short", "Medium", "Long"],
        default="Medium",
    )

    return out


def create_trip_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create trip-efficiency and journey-related analytical features."""

    out = df.copy()
    distance = _coerce_numeric(out, "Trip Distance")
    duration = _coerce_numeric(out, "Trip Duration")
    fuel = _coerce_numeric(out, "Fuel Consumption")

    # Average speed (distance per hour)
    out["Average Speed"] = distance / (duration.replace(0, np.nan) + _FEATURE_EPS)

    # Trip efficiency: inverse relation between fuel consumption and distance.
    out["Fuel Efficiency"] = distance / (fuel.replace(0, np.nan) + _FEATURE_EPS)

    # Trip efficiency category: based on fuel efficiency distribution.
    fe = out["Fuel Efficiency"]
    q33 = fe.quantile(0.33, interpolation="linear")
    q66 = fe.quantile(0.66, interpolation="linear")
    out["Trip Efficiency"] = np.select(
        [fe <= q33, fe <= q66, fe > q66],
        ["Low", "Medium", "High"],
        default="Medium",
    )

    # Delay and distance categories for business dashboards.
    out["Distance Category"] = np.select(
        [
            distance <= distance.quantile(0.33, interpolation="linear"),
            distance <= distance.quantile(0.66, interpolation="linear"),
            distance > distance.quantile(0.66, interpolation="linear"),
        ],
        ["Short", "Medium", "Long"],
        default="Medium",
    )

    return out


def create_sensor_health_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create sensor health and operational status features."""

    out = df.copy()

    battery = _coerce_numeric(out, "Battery")
    vibration = _coerce_numeric(out, "Vibration")
    shock = _coerce_numeric(out, "Shock")

    vib_p50 = vibration.quantile(0.5, interpolation="linear")
    vib_p90 = vibration.quantile(0.9, interpolation="linear")

    out["Vibration Severity"] = np.select(
        [vibration >= vib_p90, vibration >= vib_p50],
        [2, 1],
        default=0,
    ).astype(int)

    out["High Vibration Flag"] = (vibration >= vib_p90).astype(int)

    # Operational Status: derive from Sensor Status plus health flags.
    sensor_status = out["Sensor Status"].astype(str).str.strip()
    out["Operational Status"] = np.select(
        [
            sensor_status.str.lower().eq("inactive"),
            out["Battery Low Flag"].eq(1),
            out["High Shock Flag"].eq(1),
            out["High Vibration Flag"].eq(1),
        ],
        ["Inactive", "Battery Degraded", "Shock Alert", "Vibration Alert"],
        default="Active",
    )

    # Sensor Health Score: combine normalized battery health + penalties for shock/vibration.
    battery_score = out.get("Battery Health Score")
    if battery_score is None:
        battery_score = np.clip(battery, 0.0, 100.0)

    shock_penalty = out["High Shock Flag"] * 20.0
    vib_penalty = out["High Vibration Flag"] * 15.0
    inactive_penalty = sensor_status.str.lower().eq("inactive").astype(int) * 25.0

    out["Sensor Health Score"] = np.clip(
        pd.to_numeric(battery_score, errors="coerce").fillna(50.0) - shock_penalty - vib_penalty - inactive_penalty,
        0.0,
        100.0,
    )

    return out


def create_dashboard_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create downstream dashboard-specific features."""

    out = df.copy()

    # Weather impact indicator: data-driven based on temperature/humidity excursions.
    weather = out["Weather"].astype(str).str.strip().str.lower()
    out["Weather Impact Indicator"] = 0

    # Mark impactful weather based on conditional co-occurrence.
    # Avoid hardcoded limits; use mean excursion rates.
    temp_exc = out["Temperature Excursion Flag"].astype(int)
    hum_exc = out["Humidity Excursion Flag"].astype(int)
    base_impact = (temp_exc + hum_exc) / 2.0

    weather_mean = base_impact.groupby(weather).mean()
    threshold = weather_mean.quantile(0.75, interpolation="linear")
    impactful = weather.map(weather_mean).fillna(0.0) >= threshold
    out["Weather Impact Indicator"] = impactful.astype(int)

    out["Temperature Excursion Duration Risk"] = (
        out["Temperature Excursion Flag"].rolling(window=3, min_periods=1).mean() * 100.0
    )

    # Cold Chain Compliance: no temperature/humidity excursions and sensor active.
    sensor_status = out["Sensor Status"].astype(str).str.strip().str.lower()
    out["Cold Chain Compliance Flag"] = (
        (out["Temperature Excursion Flag"].eq(0))
        & (out["Humidity Excursion Flag"].eq(0))
        & (~sensor_status.eq("inactive"))
    ).astype(int)

    # Spoilage probability indicator: logistic blend of excursion flags + delay.
    # Coefficients are learned-like but fixed; thresholds are from data and business rules.
    t_dev = out["Temperature Deviation"].fillna(0.0)
    h_dev = out["Humidity Deviation"].fillna(0.0)
    delay = _coerce_numeric(out, "Delay Hours").fillna(0.0)

    # Scale deviations to robust ranges.
    t_scale = t_dev.quantile(0.9, interpolation="linear") + _FEATURE_EPS
    h_scale = h_dev.quantile(0.9, interpolation="linear") + _FEATURE_EPS

    z = (
        1.2 * (t_dev / t_scale)
        + 0.9 * (h_dev / h_scale)
        + 0.8 * (delay / (SHIPMENT_DELAY_WARNING_RANGE_H_MAX + _FEATURE_EPS))
        + 0.6 * out["Battery Low Flag"].fillna(0.0)
        + 0.7 * out["High Shock Flag"].fillna(0.0)
        + 0.5 * out["High Vibration Flag"].fillna(0.0)
    )

    prob = 1.0 / (1.0 + np.exp(-z))
    out["Spoilage Probability Indicator"] = prob.clip(0.0, 1.0)

    # Risk score indicator: convert probability into 0-100 scale.
    out["Risk Indicator"] = (out["Spoilage Probability Indicator"] * 100.0).round(2)

    return out


def feature_engineering_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """Run the end-to-end feature engineering pipeline."""

    out = df.copy()

    out = create_temperature_features(out)
    out = create_humidity_features(out)
    out = create_battery_features(out)
    out = create_shock_features(out)
    out = create_delay_features(out)
    out = create_trip_features(out)
    out = create_sensor_health_features(out)
    out = create_dashboard_features(out)

    # Additional meaningful business features suitable for cold-chain analytics.
    # Risk band based on Risk Indicator.
    risk_scores = out["Risk Indicator"].astype(float)
    out["Risk Category"] = "Low Risk"
    for category, rng in RISK_SCORE_RANGES.items():
        min_score = float(rng["min_score"])
        max_score = float(rng["max_score"])
        mask = risk_scores.between(min_score, max_score, inclusive="both")
        out.loc[mask, "Risk Category"] = category

    # High-level operational risk composition.
    out["Operational Risk Indicator"] = (
        (out["Temperature Excursion Flag"].eq(1)).astype(int)
        + (out["Humidity Excursion Flag"].eq(1)).astype(int)
        + (out["Battery Low Flag"].eq(1)).astype(int)
        + (out["Delay Flag"].eq(1)).astype(int)
        + (out["High Shock Flag"].eq(1)).astype(int)
        + (out["High Vibration Flag"].eq(1)).astype(int)
    )

    # Journey duration and distance already created; create explicit journey duration label.
    return out


def save_dataset(df: pd.DataFrame) -> None:
    """Persist engineered features for Power BI dashboards."""

    FINAL_DASHBOARD_DATA_CSV.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(FINAL_DASHBOARD_DATA_CSV, index=False)
    logging.getLogger(LOGGER_NAME).info(
        "Saved final dashboard dataset (%d rows, %d cols) -> %s",
        len(df),
        len(df.columns),
        str(FINAL_DASHBOARD_DATA_CSV),
    )


def main() -> pd.DataFrame:
    """Main entry point for feature engineering."""

    logger = setup_logging()
    logger.info("Starting feature engineering pipeline")

    df = load_dataset()
    engineered = feature_engineering_pipeline(df)

    # Ensure required outputs exist.
    required_output_cols = [
        "Temperature Deviation",
        "Humidity Deviation",
        "Battery Health Score",
        "Battery Status",
        "Shock Severity",
        "Vibration Severity",
        "Delay Category",
        "Trip Efficiency",
        "Average Speed",
        "Fuel Efficiency",
        "Temperature Excursion Flag",
        "Humidity Excursion Flag",
        "Battery Low Flag",
        "High Shock Flag",
        "High Vibration Flag",
        "Delay Flag",
        "Spoilage Probability Indicator",
        "Sensor Health Score",
        "Operational Status",
        "Risk Indicator",
        "Journey Duration Category",
        "Distance Category",
        "Weather Impact Indicator",
        "Cold Chain Compliance Flag",
    ]
    missing_out = [c for c in required_output_cols if c not in engineered.columns]
    if missing_out:
        raise RuntimeError(f"Feature engineering failed; missing columns: {missing_out}")

    save_dataset(engineered)

    logger.info("Feature engineering pipeline completed")
    return engineered


if __name__ == "__main__":
    main()

