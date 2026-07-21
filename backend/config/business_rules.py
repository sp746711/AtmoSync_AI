"""AtmoSync AI - Business Rules Configuration.

This module centralizes business logic constants and thresholds used
throughout the AtmoSync AI system.

The values defined here support spoilage risk assessment, financial loss
estimation, and dashboard presentation.
"""

from __future__ import annotations

from typing import Final

from .config import (
    PRODUCT_CATEGORIES,
    PRODUCT_NAMES,
    SENSOR_TEMPERATURE_RANGE,
    SENSOR_HUMIDITY_RANGE,
    SENSOR_BATTERY_RANGE,
)

# ==========================================================
# Section 2 - Temperature Business Rules
# ==========================================================

TEMP_SAFE_RANGE_C_MIN: Final[float] = -5.0
TEMP_SAFE_RANGE_C_MAX: Final[float] = 5.0

TEMP_WARNING_RANGE_C_MIN: Final[float] = -10.0
TEMP_WARNING_RANGE_C_MAX: Final[float] = 8.0

TEMP_CRITICAL_RANGE_C_MIN: Final[float] = -15.0
TEMP_CRITICAL_RANGE_C_MAX: Final[float] = 12.0

TEMP_HIGH_THRESHOLD_C: Final[float] = 12.0
TEMP_LOW_THRESHOLD_C: Final[float] = -15.0

# ==========================================================
# Section 3 - Humidity, Battery & Shipment Delay Business Rules
# ==========================================================

# Humidity (Relative Humidity %)

HUMIDITY_SAFE_RANGE_PERCENT_MIN: Final[float] = 30.0
HUMIDITY_SAFE_RANGE_PERCENT_MAX: Final[float] = 70.0

HUMIDITY_WARNING_RANGE_PERCENT_MIN: Final[float] = 20.0
HUMIDITY_WARNING_RANGE_PERCENT_MAX: Final[float] = 80.0

HUMIDITY_CRITICAL_RANGE_PERCENT_MIN: Final[float] = 10.0
HUMIDITY_CRITICAL_RANGE_PERCENT_MAX: Final[float] = 90.0

HUMIDITY_HIGH_THRESHOLD_PERCENT: Final[float] = 90.0
HUMIDITY_LOW_THRESHOLD_PERCENT: Final[float] = 10.0

# Battery (Percentage %)

BATTERY_SAFE_RANGE_PCT_MIN: Final[float] = 40.0
BATTERY_SAFE_RANGE_PCT_MAX: Final[float] = 100.0

BATTERY_WARNING_RANGE_PCT_MIN: Final[float] = 20.0
BATTERY_WARNING_RANGE_PCT_MAX: Final[float] = 39.0

BATTERY_CRITICAL_RANGE_PCT_MIN: Final[float] = 0.0
BATTERY_CRITICAL_RANGE_PCT_MAX: Final[float] = 19.0

BATTERY_LOW_THRESHOLD_PCT: Final[float] = 19.0

# Shipment Delay (Hours)

SHIPMENT_DELAY_SAFE_RANGE_H_MIN: Final[float] = 0.0
SHIPMENT_DELAY_SAFE_RANGE_H_MAX: Final[float] = 4.0

SHIPMENT_DELAY_WARNING_RANGE_H_MIN: Final[float] = 4.1
SHIPMENT_DELAY_WARNING_RANGE_H_MAX: Final[float] = 12.0

SHIPMENT_DELAY_CRITICAL_RANGE_H_MIN: Final[float] = 12.1
SHIPMENT_DELAY_CRITICAL_RANGE_H_MAX: Final[float] = 9999.0

SHIPMENT_DELAY_HIGH_THRESHOLD_H: Final[float] = 12.0

# ==========================================================
# Section 4 - Risk Score Business Rules
# ==========================================================

RISK_SCORE_RANGES: dict[str, dict[str, float]] = {
    "Low Risk": {
        "min_score": 0.0,
        "max_score": 24.9,
    },
    "Medium Risk": {
        "min_score": 25.0,
        "max_score": 49.9,
    },
    "High Risk": {
        "min_score": 50.0,
        "max_score": 74.9,
    },
    "Critical Risk": {
        "min_score": 75.0,
        "max_score": 100.0,
    },
}

# ==========================================================
# Section 5 - Financial Business Rules
# ==========================================================

# Product unit values used for financial calculations (currency per unit/item).

PRODUCT_VALUES: dict[str, float] = {
    # Vaccines
    "COVID-19 Vaccine": 1200.0,
    "Polio Vaccine": 950.0,
    "BCG Vaccine": 800.0,

    # Medicines
    "Insulin": 600.0,
    "Paracetamol Syrup": 90.0,

    # Dairy
    "Milk": 12.0,
    "Butter": 220.0,
    "Cheese": 350.0,
    "Curd": 16.0,
    "Paneer": 180.0,
    "Ice Cream": 140.0,

    # Frozen Foods
    "Frozen Meat": 280.0,
    "Frozen Pizza": 240.0,
    "Frozen Peas": 95.0,
    "Frozen French Fries": 110.0,

    # Meat & Seafood
    "Chicken": 260.0,
    "Mutton": 420.0,
    "Fish": 320.0,
    "Prawns": 520.0,
    "Salmon": 450.0,

    # Fresh Fruits
    "Apple": 18.0,
    "Banana": 14.0,
    "Orange": 20.0,
    "Grapes": 35.0,

    # Fresh Vegetables
    "Tomato": 22.0,
    "Potato": 12.0,
    "Onion": 10.0,
    "Carrot": 14.0,
    "Broccoli": 28.0,
    "Lettuce": 26.0,

    # Bakery
    "Chocolate": 85.0,
    "Bread": 25.0,
    "Cake": 120.0,
}

# Spoilage percentage by risk category.

SPOILAGE_PERCENTAGE_BY_RISK: dict[str, float] = {
    "Low Risk": 0.02,
    "Medium Risk": 0.06,
    "High Risk": 0.14,
    "Critical Risk": 0.28,
}

# Estimated financial loss percentage by risk category.

ESTIMATED_LOSS_PERCENTAGE_BY_RISK: dict[str, float] = {
    "Low Risk": 0.03,
    "Medium Risk": 0.10,
    "High Risk": 0.22,
    "Critical Risk": 0.40,
}

# Business thresholds.

INSURANCE_THRESHOLD_LOSS_FRACTION: Final[float] = 0.15

RECOVERY_THRESHOLD_LOSS_FRACTION: Final[float] = 0.07

# ==========================================================
# Section 6 - Recommendation Rules
# ==========================================================

RECOMMENDATION_TIERS: dict[str, dict[str, str]] = {
    "Normal": {
        "severity": "low",
        "label": "Normal",
    },
    "Warning": {
        "severity": "medium",
        "label": "Warning",
    },
    "Critical": {
        "severity": "high",
        "label": "Critical",
    },
    "Battery Low": {
        "severity": "medium",
        "label": "Battery Low",
    },
    "Shipment Delay": {
        "severity": "medium",
        "label": "Shipment Delay",
    },
    "Temperature Issue": {
        "severity": "high",
        "label": "Temperature Issue",
    },
    "Humidity Issue": {
        "severity": "high",
        "label": "Humidity Issue",
    },
}

RECOMMENDATION_RULES: dict[str, dict[str, list[str]]] = {
    "Normal": {
        "recommendations": [
            "Continue monitoring at the scheduled interval.",
            "Ensure sensors are calibrated and securely mounted.",
            "Record readings for traceability.",
        ]
    },
    "Warning": {
        "recommendations": [
            "Increase monitoring frequency temporarily.",
            "Verify sensor status and check for data gaps.",
            "Inspect packaging integrity and cold-chain environment.",
        ]
    },
    "Critical": {
        "recommendations": [
            "Initiate immediate quarantine of the affected shipment.",
            "Notify the quality assurance and supply chain teams.",
            "Inspect refrigeration equipment and identify the root cause.",
        ]
    },
    "Battery Low": {
        "recommendations": [
            "Replace or recharge the sensor battery immediately.",
            "Verify the sensor reconnects successfully.",
            "Monitor the shipment until battery health is restored.",
        ]
    },
    "Shipment Delay": {
        "recommendations": [
            "Prioritize shipment dispatch immediately.",
            "Review the transport route for delays.",
            "Verify product quality before delivery.",
        ]
    },
    "Temperature Issue": {
        "recommendations": [
            "Inspect refrigeration equipment immediately.",
            "Move products to a safe temperature-controlled environment.",
            "Record the temperature excursion for compliance.",
        ]
    },
    "Humidity Issue": {
        "recommendations": [
            "Inspect humidity control systems.",
            "Check packaging for moisture damage.",
            "Perform a quality inspection before shipment release.",
        ]
    },
}

# ==========================================================
# Section 7 - Dashboard KPI Rules
# ==========================================================

DASHBOARD_KPI_TIERS: dict[str, dict[str, float | str]] = {
    "Excellent": {
        "min_value": 95.0,
        "max_value": 100.0,
        "label": "Excellent",
        "severity": "low",
    },
    "Good": {
        "min_value": 80.0,
        "max_value": 94.9,
        "label": "Good",
        "severity": "low",
    },
    "Average": {
        "min_value": 60.0,
        "max_value": 79.9,
        "label": "Average",
        "severity": "medium",
    },
    "Poor": {
        "min_value": 40.0,
        "max_value": 59.9,
        "label": "Poor",
        "severity": "high",
    },
    "Critical": {
        "min_value": 0.0,
        "max_value": 39.9,
        "label": "Critical",
        "severity": "critical",
    },
}

DASHBOARD_KPI_COLORS: dict[str, str] = {
    "Excellent": "#16A34A",
    "Good": "#22C55E",
    "Average": "#F59E0B",
    "Poor": "#F97316",
    "Critical": "#DC2626",
}

DASHBOARD_KPI_RULES: dict[str, dict[str, float]] = {
    "Excellent": {
        "min_value": 95.0,
        "max_value": 100.0,
    },
    "Good": {
        "min_value": 80.0,
        "max_value": 94.9,
    },
    "Average": {
        "min_value": 60.0,
        "max_value": 79.9,
    },
    "Poor": {
        "min_value": 40.0,
        "max_value": 59.9,
    },
    "Critical": {
        "min_value": 0.0,
        "max_value": 39.9,
    },
}

# ==========================================================
# Section 8 - Public Exports
# ==========================================================

__all__ = sorted(
    name
    for name in globals().keys()
    if name.isupper()
    and not name.startswith("_")
)