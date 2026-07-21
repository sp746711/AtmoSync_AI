from __future__ import annotations

import logging
import logging.config
from typing import Any

import pandas as pd

from backend.config.config import (
    LOGGER_NAME,
    PROCESSED_SENSOR_DATA_CSV,
    SENSOR_DATA_CSV,
    build_production_logging_config,
)

from backend.config.business_rules import (
    BATTERY_CRITICAL_RANGE_PCT_MAX,
    BATTERY_CRITICAL_RANGE_PCT_MIN,
    BATTERY_SAFE_RANGE_PCT_MAX,
    BATTERY_SAFE_RANGE_PCT_MIN,
    HUMIDITY_CRITICAL_RANGE_PERCENT_MAX,
    HUMIDITY_CRITICAL_RANGE_PERCENT_MIN,
    HUMIDITY_SAFE_RANGE_PERCENT_MAX,
    HUMIDITY_SAFE_RANGE_PERCENT_MIN,
    HUMIDITY_WARNING_RANGE_PERCENT_MAX,
    HUMIDITY_WARNING_RANGE_PERCENT_MIN,
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


def _setup_logging() -> logging.Logger:
    logging.config.dictConfig(build_production_logging_config())
    return logging.getLogger(LOGGER_NAME)


def _coerce_numeric(df: pd.DataFrame, col: str) -> pd.Series:
    if col not in df.columns:
        return pd.Series([pd.NA] * len(df), dtype="float64")
    return pd.to_numeric(df[col], errors="coerce")


def _validate_numeric_range(series: pd.Series, min_value: float, max_value: float) -> pd.Series:
    return series.between(min_value, max_value, inclusive="both")


def _standardize_columns(df: pd.DataFrame) -> pd.DataFrame:
    rename_map: dict[str, str] = {
        "shipment id": "Shipment ID",
        "container id": "Container ID",
        "timestamp": "Timestamp",
        "date": "Date",
        "time": "Time",
        "product category": "Product Category",
        "product name": "Product Name",
        "vehicle type": "Vehicle Type",
        "origin city": "Origin City",
        "destination city": "Destination City",
        "transport mode": "Transport Mode",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "temperature": "Temperature",
        "humidity": "Humidity",
        "battery": "Battery",
        "shock": "Shock",
        "vibration": "Vibration",
        "delay hours": "Delay Hours",
        "sensor status": "Sensor Status",
        "weather": "Weather",
        "driver id": "Driver ID",
        "route id": "Route ID",
        "trip distance": "Trip Distance",
        "trip duration": "Trip Duration",
        "fuel consumption": "Fuel Consumption",
    }

    df = df.copy()
    normalized = {str(c).strip().lower(): c for c in df.columns}
    new_cols: dict[Any, Any] = {}
    for norm, original in normalized.items():
        if norm in rename_map:
            new_cols[original] = rename_map[norm]

    if new_cols:
        df = df.rename(columns=new_cols)

    return df


def _clean_and_validate(df: pd.DataFrame, logger: logging.Logger) -> pd.DataFrame:
    df = df.copy()
    df = _standardize_columns(df)

    # Basic column existence checks (fail early without inventing business logic).
    required_columns = [
        "Timestamp",
        "Temperature",
        "Humidity",
        "Battery",
        "Delay Hours",
        "Sensor Status",
    ]
    missing = [c for c in required_columns if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in input dataset: {missing}")

    # Coerce numeric columns.
    for col in ["Temperature", "Humidity", "Battery", "Delay Hours"]:
        df[col] = _coerce_numeric(df, col)

    # Drop rows with all key sensor readings missing.
    before = len(df)
    key_mask = df[["Temperature", "Humidity", "Battery", "Delay Hours"]].notna().any(axis=1)
    df = df.loc[key_mask].reset_index(drop=True)
    logger.info("Dropped %d rows with missing key sensor readings", before - len(df))

    # Validate ranges using business rules.
    temp_safe = _validate_numeric_range(df["Temperature"], TEMP_SAFE_RANGE_C_MIN, TEMP_SAFE_RANGE_C_MAX)
    temp_warning = _validate_numeric_range(
        df["Temperature"], TEMP_WARNING_RANGE_C_MIN, TEMP_WARNING_RANGE_C_MAX
    )
    temp_critical = _validate_numeric_range(
        df["Temperature"], TEMP_CRITICAL_RANGE_C_MIN, TEMP_CRITICAL_RANGE_C_MAX
    )
    temp_valid = temp_safe | temp_warning | temp_critical

    humidity_safe = _validate_numeric_range(
        df["Humidity"], HUMIDITY_SAFE_RANGE_PERCENT_MIN, HUMIDITY_SAFE_RANGE_PERCENT_MAX
    )
    humidity_warning = _validate_numeric_range(
        df["Humidity"], HUMIDITY_WARNING_RANGE_PERCENT_MIN, HUMIDITY_WARNING_RANGE_PERCENT_MAX
    )
    humidity_critical = _validate_numeric_range(
        df["Humidity"], HUMIDITY_CRITICAL_RANGE_PERCENT_MIN, HUMIDITY_CRITICAL_RANGE_PERCENT_MAX
    )
    humidity_valid = humidity_safe | humidity_warning | humidity_critical

    battery_safe = _validate_numeric_range(
        df["Battery"], BATTERY_SAFE_RANGE_PCT_MIN, BATTERY_SAFE_RANGE_PCT_MAX
    )
    battery_critical = _validate_numeric_range(
        df["Battery"], BATTERY_CRITICAL_RANGE_PCT_MIN, BATTERY_CRITICAL_RANGE_PCT_MAX
    )
    # We only enforce safe/critical bounds as provided by business rules.
    battery_valid = battery_safe | battery_critical

    delay_safe = _validate_numeric_range(
        df["Delay Hours"], SHIPMENT_DELAY_SAFE_RANGE_H_MIN, SHIPMENT_DELAY_SAFE_RANGE_H_MAX
    )
    delay_warning = _validate_numeric_range(
        df["Delay Hours"],
        SHIPMENT_DELAY_WARNING_RANGE_H_MIN,
        SHIPMENT_DELAY_WARNING_RANGE_H_MAX,
    )
    delay_critical = _validate_numeric_range(
        df["Delay Hours"],
        SHIPMENT_DELAY_CRITICAL_RANGE_H_MIN,
        SHIPMENT_DELAY_CRITICAL_RANGE_H_MAX,
    )
    delay_valid = delay_safe | delay_warning | delay_critical

    valid_mask = temp_valid & humidity_valid & battery_valid & delay_valid
    invalid_count = int((~valid_mask).sum())
    logger.info("Validated sensor ranges; invalid rows=%d", invalid_count)

    # Standardize invalid values by dropping invalid rows.
    df = df.loc[valid_mask].reset_index(drop=True)

    # Standardize timestamp/date/time formatting as strings (do not invent formats).
    df["Timestamp"] = df["Timestamp"].astype(str).str.strip()
    df["Sensor Status"] = df["Sensor Status"].astype(str).str.strip()

    return df


def main() -> pd.DataFrame:
    logger = _setup_logging()

    if not SENSOR_DATA_CSV.exists():
        raise FileNotFoundError(f"Raw sensor data CSV not found: {SENSOR_DATA_CSV}")

    logger.info("Loading raw sensor data from %s", str(SENSOR_DATA_CSV))
    df = pd.read_csv(SENSOR_DATA_CSV)

    cleaned_df = _clean_and_validate(df, logger=logger)

    PROCESSED_SENSOR_DATA_CSV.parent.mkdir(parents=True, exist_ok=True)
    cleaned_df.to_csv(PROCESSED_SENSOR_DATA_CSV, index=False)
    logger.info("Saved cleaned sensor data (%d rows) -> %s", len(cleaned_df), str(PROCESSED_SENSOR_DATA_CSV))

    return cleaned_df


if __name__ == "__main__":
    main()

