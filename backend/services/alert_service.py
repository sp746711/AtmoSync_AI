"""
AtmoSync AI - Alert Service

Generates shipment alerts by reading the final pipeline output dataset
(dashboard/risk dataset) and constructing structured alert objects from
excursion flags, risk categories, and sensor status indicators.

This service does NOT re-implement business logic already present in
the pipeline scripts. It only reads the persisted output CSV and
transforms flagged records into alert entries.

Usage
-----
    from backend.services.alert_service import get_active_alerts

    alerts = get_active_alerts(limit=50)
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Final

import pandas as pd

from backend.config.config import FINAL_DASHBOARD_DATA_CSV, LOGGER_NAME
from backend.utils import coerce_numeric

# ---------------------------------------------------------------------------
# Alert severity mapping — aligned with RECOMMENDATION_TIERS in business_rules.
# ---------------------------------------------------------------------------
_ALERT_SEVERITY_MAP: Final[dict[str, str]] = {
    "temperature": "high",
    "humidity": "high",
    "battery": "medium",
    "delay": "medium",
    "shock": "medium",
    "vibration": "low",
    "critical_risk": "critical",
}

_ALERT_LABEL_MAP: Final[dict[str, str]] = {
    "temperature": "Temperature Excursion",
    "humidity": "Humidity Excursion",
    "battery": "Battery Low",
    "delay": "Shipment Delay",
    "shock": "High Shock Detected",
    "vibration": "High Vibration Detected",
    "critical_risk": "Critical Risk",
}

_ALERT_MESSAGE_MAP: Final[dict[str, str]] = {
    "temperature": "Temperature excursion detected — immediate inspection required.",
    "humidity": "Humidity excursion detected — check packaging and environment.",
    "battery": "Sensor battery level critically low — replace or recharge immediately.",
    "delay": "Shipment delay exceeds safe threshold — review logistics route.",
    "shock": "High shock event detected — inspect product integrity.",
    "vibration": "High vibration detected — verify cold-chain equipment stability.",
    "critical_risk": "Shipment classified as Critical Risk — quarantine and escalate.",
}

# ---------------------------------------------------------------------------
# Flag columns expected in the final dashboard dataset.
# ---------------------------------------------------------------------------
_REQUIRED_FLAG_COLUMNS: Final[list[str]] = [
    "Shipment ID",
    "Timestamp",
    "Temperature Excursion Flag",
    "Humidity Excursion Flag",
    "Battery Low Flag",
    "Delay Flag",
    "High Shock Flag",
    "High Vibration Flag",
    "Risk Category",
]

# ---------------------------------------------------------------------------
# Configuration-driven flag-to-alert mapping.
# Each entry defines: (flag_column_name, alert_type_key, is_risk_category)
#   - flag_column_name : CSV column to read.
#   - alert_type_key   : key into _ALERT_SEVERITY_MAP / _ALERT_LABEL_MAP etc.
#   - is_risk_category  : if True, the trigger value is "Critical Risk"
#                         instead of a binary 0/1 flag.
# ---------------------------------------------------------------------------
_FLAG_COLUMN_CONFIG: Final[list[tuple[str, str, bool]]] = [
    ("Temperature Excursion Flag", "temperature", False),
    ("Humidity Excursion Flag", "humidity", False),
    ("Battery Low Flag", "battery", False),
    ("Delay Flag", "delay", False),
    ("High Shock Flag", "shock", False),
    ("High Vibration Flag", "vibration", False),
    ("Risk Category", "critical_risk", True),
]


def _generate_alert_id(shipment_id: str, alert_type: str, index: int) -> str:
    """Generate a deterministic, human-readable alert identifier."""
    return f"ALT-{alert_type.upper()[:4]}-{shipment_id[-8:]}-{index:04d}"


def _build_alert_row(
    row: dict[str, Any],
    alert_type: str,
    index: int,
) -> dict[str, Any]:
    """Construct a single alert dictionary from a dataset row."""
    return {
        "alert_id": _generate_alert_id(
            str(row.get("Shipment ID", "")), alert_type, index
        ),
        "severity": _ALERT_SEVERITY_MAP.get(alert_type, "medium"),
        "label": _ALERT_LABEL_MAP.get(alert_type, alert_type.replace("_", " ").title()),
        "message": _ALERT_MESSAGE_MAP.get(
            alert_type, f"Anomaly detected: {alert_type.replace('_', ' ')}."
        ),
        "timestamp": str(row.get("Timestamp", "")),
        "shipment_id": str(row.get("Shipment ID", "")),
    }


def get_active_alerts(
    df: pd.DataFrame | None = None,
    limit: int = 100,
) -> list[dict[str, Any]]:
    """Generate active shipment alerts from the final dashboard dataset.

    Reads the persisted CSV written by the analytics pipeline and scans
    each row for active excursion flags, low-battery signals, delay
    breaches, shock/vibration events, and critical-risk classifications.

    Parameters
    ----------
    df : pd.DataFrame or None
        Pre-loaded dataframe. If ``None``, the dataset is loaded from
        ``FINAL_DASHBOARD_DATA_CSV``.
    limit : int
        Maximum number of alerts to return (newest first). Default 100.

    Returns
    -------
    list[dict[str, Any]]
        Each dict contains ``alert_id``, ``severity``, ``label``,
        ``message``, ``timestamp``, and ``shipment_id``.

    Raises
    ------
    FileNotFoundError
        If the dataset CSV does not exist and no dataframe was provided.
    ValueError
        If required flag columns are missing from the dataset.
    """
    logger = logging.getLogger(LOGGER_NAME)

    # ------------------------------------------------------------------
    # 1. Load dataset if not provided.
    # ------------------------------------------------------------------
    if df is None:
        csv_path = Path(FINAL_DASHBOARD_DATA_CSV)
        if not csv_path.exists():
            raise FileNotFoundError(
                f"Final dashboard dataset not found: {csv_path}. "
                "Run the analytics pipeline first."
            )
        logger.info("Loading dashboard dataset from %s", csv_path)
        df = pd.read_csv(csv_path)

    if df.empty:
        logger.warning("Dashboard dataset is empty — no alerts to generate.")
        return []

    # ------------------------------------------------------------------
    # 2. Validate required columns (best-effort — warn, don't fail).
    # ------------------------------------------------------------------
    available = set(str(c).strip() for c in df.columns)
    missing = [c for c in _REQUIRED_FLAG_COLUMNS if c not in available]
    if missing:
        logger.warning(
            "Missing expected columns in dataset: %s. "
            "Alert generation will use only available columns.",
            missing,
        )

    # ------------------------------------------------------------------
    # 3. Pre-process flag columns once (vectorised) before iterating rows.
    # ------------------------------------------------------------------
    # Build a dict of column_name -> coerced numeric Series (or None if missing).
    flag_series: dict[str, pd.Series | None] = {}
    risk_col_present = False
    for col_name, _alert_type, is_risk in _FLAG_COLUMN_CONFIG:
        if col_name in available:
            if is_risk:
                risk_col_present = True
            else:
                flag_series[col_name] = coerce_numeric(df, col_name)
        else:
            flag_series[col_name] = None

    # Pre-extract Timestamp and Shipment ID as plain Series for fast access.
    ts_series = df["Timestamp"].astype(str) if "Timestamp" in available else pd.Series([""] * len(df))
    sid_series = df["Shipment ID"].astype(str) if "Shipment ID" in available else pd.Series([""] * len(df))

    # Pre-extract Risk Category as cleaned string Series.
    risk_series: pd.Series | None = (
        df["Risk Category"].astype(str).str.strip()
        if risk_col_present
        else None
    )

    # ------------------------------------------------------------------
    # 4. Scan each row for alert-worthy conditions.
    # ------------------------------------------------------------------
    alerts: list[dict[str, Any]] = []
    alert_index = 0

    for idx in range(len(df)):
        # Common row values used by all alerts in this row.
        shipment_id = sid_series.iloc[idx]
        timestamp = ts_series.iloc[idx]

        for col_name, alert_type, is_risk in _FLAG_COLUMN_CONFIG:
            if is_risk:
                # -- Critical risk category (string match) --
                if risk_series is not None and risk_series.iloc[idx] == "Critical Risk":
                    alerts.append({
                        "alert_id": _generate_alert_id(shipment_id, alert_type, alert_index),
                        "severity": _ALERT_SEVERITY_MAP.get(alert_type, "medium"),
                        "label": _ALERT_LABEL_MAP.get(alert_type, alert_type.replace("_", " ").title()),
                        "message": _ALERT_MESSAGE_MAP.get(
                            alert_type, f"Anomaly detected: {alert_type.replace('_', ' ')}."
                        ),
                        "timestamp": timestamp,
                        "shipment_id": shipment_id,
                    })
                    alert_index += 1
            else:
                # -- Binary flag column (0/1) --
                series = flag_series.get(col_name)
                if series is not None:
                    flag_val = int(series.iloc[idx]) if pd.notna(series.iloc[idx]) else 0
                    if flag_val == 1:
                        alerts.append({
                            "alert_id": _generate_alert_id(shipment_id, alert_type, alert_index),
                            "severity": _ALERT_SEVERITY_MAP.get(alert_type, "medium"),
                            "label": _ALERT_LABEL_MAP.get(alert_type, alert_type.replace("_", " ").title()),
                            "message": _ALERT_MESSAGE_MAP.get(
                                alert_type, f"Anomaly detected: {alert_type.replace('_', ' ')}."
                            ),
                            "timestamp": timestamp,
                            "shipment_id": shipment_id,
                        })
                        alert_index += 1

    # ------------------------------------------------------------------
    # 4. Sort by severity (critical first → low last) then timestamp.
    # ------------------------------------------------------------------
    severity_order: dict[str, int] = {
        "critical": 0,
        "high": 1,
        "medium": 2,
        "low": 3,
    }

    alerts.sort(
        key=lambda a: (
            severity_order.get(a.get("severity", "low"), 99),
            str(a.get("timestamp", "")),
        )
    )

    # ------------------------------------------------------------------
    # 5. Apply limit.
    # ------------------------------------------------------------------
    truncated = alerts[:limit]

    logger.info(
        "Generated %d alerts from %d dataset rows (limit=%d, truncated=%s)",
        len(alerts),
        len(df),
        limit,
        len(alerts) > limit,
    )

    return truncated


def count_active_alerts(
    df: pd.DataFrame | None = None,
) -> int:
    """Return the total number of active alerts without constructing full objects.

    Useful for dashboard KPI badges and summary counts.

    Parameters
    ----------
    df : pd.DataFrame or None
        Pre-loaded dataframe. Loaded from CSV if ``None``.

    Returns
    -------
    int
        Total active alert count.
    """
    return len(get_active_alerts(df=df, limit=10**6))

