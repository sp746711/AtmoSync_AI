from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

# ----------------------------------------------------------
# Load environment variables from .env file (if present).
# This must happen early so that all subsequent defaults can
# be overridden via environment variables.
# ----------------------------------------------------------
load_dotenv()

# ==========================================================
# Project Information
# ==========================================================

PROJECT_NAME: str = "AtmoSync AI"
VERSION: str = "1.0.0"
AUTHOR: str = "Sujan Pradhan"
DESCRIPTION: str = (
    "Smart Cold Chain Monitoring & Spoilage Risk Analytics System"
)

# ==========================================================
# Project Root
# ==========================================================

PROJECT_ROOT: Path = Path(__file__).resolve().parents[1]


def ensure_folder(path: Path) -> Path:
    """
    Ensure the given folder exists by creating it (and any
    missing parents) if it does not already exist.

    Args:
        path: Folder path to ensure.

    Returns:
        The same ``path`` for chaining / assignment convenience.
    """
    path.mkdir(parents=True, exist_ok=True)
    return path


# ==========================================================
# Project Directories
# ==========================================================

CONFIG_DIR: Path = ensure_folder(PROJECT_ROOT / "config")

DATA_DIR: Path = ensure_folder(PROJECT_ROOT / "data")

RAW_DATA_DIR: Path = ensure_folder(DATA_DIR / "raw")

PROCESSED_DATA_DIR: Path = ensure_folder(DATA_DIR / "processed")

EXPORTS_DIR: Path = ensure_folder(DATA_DIR / "exports")

DASHBOARD_DIR: Path = ensure_folder(PROJECT_ROOT / "dashboard")

REPORTS_DIR: Path = ensure_folder(PROJECT_ROOT / "reports")

REPORTS_OUTPUT_DIR: Path = ensure_folder(
    REPORTS_DIR / "output"
)

REPORTS_DOCUMENTATION_DIR: Path = ensure_folder(
    REPORTS_DIR / "documentation"
)

REPORTS_SCREENSHOTS_DIR: Path = ensure_folder(
    REPORTS_DIR / "screenshots"
)

REPORTS_PRESENTATION_DIR: Path = ensure_folder(
    REPORTS_DIR / "presentation"
)

SCRIPTS_DIR: Path = ensure_folder(
    PROJECT_ROOT / "scripts"
)

TESTS_DIR: Path = ensure_folder(
    PROJECT_ROOT / "tests"
)

NOTEBOOKS_DIR: Path = ensure_folder(
    PROJECT_ROOT / "notebooks"
)

# ----------------------------------------------------------
# Additional directories (optional but recommended)
# ----------------------------------------------------------

STATIC_DIR: Path = ensure_folder(PROJECT_ROOT / "static")
"""Serves static assets (e.g. images, favicon) via FastAPI."""

ASSETS_DIR: Path = ensure_folder(PROJECT_ROOT / "assets")
"""Project-level assets (icons, logos, brand resources)."""

LOGS_DIR: Path = ensure_folder(PROJECT_ROOT / "logs")
"""Application-log output directory (rotating file handler)."""

TEMP_DIR: Path = ensure_folder(PROJECT_ROOT / "temp")
"""Temporary working directory for ephemeral processing files."""

# ==========================================================
# CSV File Paths
# ==========================================================

SENSOR_DATA_CSV: Path = (
    RAW_DATA_DIR / "sensor_data.csv"
)

PROCESSED_SENSOR_DATA_CSV: Path = (
    PROCESSED_DATA_DIR /
    "processed_sensor_data.csv"
)

FINAL_DASHBOARD_DATA_CSV: Path = (
    EXPORTS_DIR /
    "final_dashboard_data.csv"
)

EXECUTIVE_SUMMARY_CSV: Path = (
    REPORTS_OUTPUT_DIR /
    "executive_summary.csv"
)

BUSINESS_INSIGHTS_CSV: Path = (
    REPORTS_OUTPUT_DIR /
    "business_insights.csv"
)

FINANCIAL_SUMMARY_CSV: Path = (
    REPORTS_OUTPUT_DIR /
    "financial_summary.csv"
)

# ==========================================================
# Power BI Configuration
# ==========================================================

POWER_BI_FILE_PATH: Path = DASHBOARD_DIR / "AtmoSync_AI.pbix"
"""Path to the Power BI Desktop workbook (.pbix) file."""

DASHBOARD_DATASET_PATH: Path = FINAL_DASHBOARD_DATA_CSV
"""Canonical CSV dataset consumed by the Power BI dashboard."""

# ==========================================================
# API & Server Configuration
# ==========================================================

API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
"""Host address the FastAPI server binds to."""

API_PORT: int = int(os.getenv("API_PORT", "8000"))
"""Port the FastAPI server listens on."""

API_DEBUG: bool = os.getenv("API_DEBUG", "false").strip().lower() in {"true", "1", "yes"}
"""Run FastAPI in debug mode (auto-reload, verbose error pages)."""

API_RELOAD: bool = os.getenv("API_RELOAD", "false").strip().lower() in {"true", "1", "yes"}
"""Enable auto-reload on code changes (development only)."""

API_PREFIX: str = os.getenv("API_PREFIX", "/api/v1")
"""Global URL prefix for all API routes if behind a reverse proxy."""

# ==========================================================
# CORS (Cross-Origin Resource Sharing) Configuration
# ==========================================================

ALLOWED_ORIGINS: list[str] = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://localhost:8000",
).split(",")
"""List of allowed origins for CORS (comma-separated in .env)."""

CORS_ALLOW_CREDENTIALS: bool = True
CORS_ALLOW_METHODS: list[str] = ["*"]
CORS_ALLOW_HEADERS: list[str] = ["*"]

# ==========================================================
# Dataset Configuration
# ==========================================================

RANDOM_SEED: int = 42

DEFAULT_RECORDS: int = 1000

DATE_FORMAT: str = "%Y-%m-%d"

DATETIME_FORMAT: str = "%Y-%m-%d %H:%M:%S"

TIMEZONE: str = "Asia/Kolkata" 


# ==========================================================
# Sensor Configuration
# ==========================================================

SENSOR_TEMPERATURE_RANGE: dict[str, float] = {
    "min_c": -25.0,
    "max_c": 15.0,
}

SENSOR_HUMIDITY_RANGE: dict[str, float] = {
    "min_percent": 20.0,
    "max_percent": 100.0,
}

SENSOR_BATTERY_RANGE: dict[str, float] = {
    "min_percent": 0.0,
    "max_percent": 100.0,
}

SENSOR_VIBRATION_RANGE: dict[str, float] = {
    "min_m_s2": 0.0,
    "max_m_s2": 20.0,
}

SENSOR_SHOCK_RANGE: dict[str, float] = {
    "min_g": 0.0,
    "max_g": 500.0,
}

SENSOR_DELAY_HOURS_RANGE: dict[str, float] = {
    "min_hours": 0.0,
    "max_hours": 72.0,
}

# ==========================================================
# Product Storage Temperature Rules
# ==========================================================
# Recommended safe temperature ranges for each product category.
# These can be used to validate sensor readings against
# cold-chain compliance rules.

PRODUCT_STORAGE_TEMPERATURES: dict[str, dict[str, float]] = {
    "Vaccines":         {"min_c": -25.0, "max_c": -15.0, "optimal_c": -20.0},
    "Medicines":        {"min_c": 2.0,   "max_c": 8.0,   "optimal_c": 5.0},
    "Dairy Products":   {"min_c": 2.0,   "max_c": 6.0,   "optimal_c": 4.0},
    "Frozen Foods":     {"min_c": -25.0, "max_c": -15.0, "optimal_c": -18.0},
    "Seafood":          {"min_c": -5.0,  "max_c": 2.0,   "optimal_c": 0.0},
    "Fresh Fruits":     {"min_c": 2.0,   "max_c": 10.0,  "optimal_c": 5.0},
    "Fresh Vegetables": {"min_c": 2.0,   "max_c": 8.0,   "optimal_c": 4.0},
    "Meat":             {"min_c": -5.0,  "max_c": 2.0,   "optimal_c": 0.0},
    "Poultry":          {"min_c": -5.0,  "max_c": 2.0,   "optimal_c": 0.0},
    "Ice Cream":        {"min_c": -30.0, "max_c": -18.0, "optimal_c": -22.0},
    "Chocolate":        {"min_c": 12.0,  "max_c": 20.0,  "optimal_c": 16.0},
    "Bakery Products":  {"min_c": 2.0,   "max_c": 8.0,   "optimal_c": 5.0},
}

# ==========================================================
# Sensor Alert Thresholds
# ==========================================================
# Direct alerting thresholds (used by the alert engine).
# These complement the risk bands defined in business_rules.py.

ALERT_TEMPERATURE_HIGH_THRESHOLD_C: float = float(
    os.getenv("ALERT_TEMP_HIGH_C", "12.0")
)
ALERT_TEMPERATURE_LOW_THRESHOLD_C: float = float(
    os.getenv("ALERT_TEMP_LOW_C", "-15.0")
)

ALERT_HUMIDITY_HIGH_THRESHOLD_PERCENT: float = float(
    os.getenv("ALERT_HUMIDITY_HIGH", "90.0")
)
ALERT_HUMIDITY_LOW_THRESHOLD_PERCENT: float = float(
    os.getenv("ALERT_HUMIDITY_LOW", "10.0")
)

ALERT_BATTERY_LOW_THRESHOLD_PERCENT: float = float(
    os.getenv("ALERT_BATTERY_LOW", "20.0")
)

ALERT_DELAY_HIGH_THRESHOLD_HOURS: float = float(
    os.getenv("ALERT_DELAY_HIGH_H", "12.0")
)

# ==========================================================
# GPS Configuration
# ==========================================================

GPS_COORDINATE_PRECISION: int = 6
"""Number of decimal places for latitude/longitude rounding."""

GPS_DEFAULT_LATITUDE: float = 22.5726
"""Fallback latitude (Kolkata, India)."""

GPS_DEFAULT_LONGITUDE: float = 88.3639
"""Fallback longitude (Kolkata, India)."""

# ==========================================================
# Financial Configuration
# ==========================================================

CURRENCY: str = os.getenv("CURRENCY", "INR")
"""Currency code used for all financial calculations."""

DELAY_COST_PER_HOUR: float = float(
    os.getenv("DELAY_COST_PER_HOUR", "500.0")
)
"""Estimated cost (in CURRENCY) per hour of shipment delay."""

SPOILAGE_COST_PERCENTAGE: float = float(
    os.getenv("SPOILAGE_COST_PERCENTAGE", "0.15")
)
"""Default fraction of product value assumed as spoilage cost when
no specific risk band percentage is available (0.15 = 15 %)."""

FUEL_COST_PER_LITER: float = float(
    os.getenv("FUEL_COST_PER_LITER", "90.0")
)
"""Fuel price per litre used in operational cost calculations."""

INSURANCE_COST_PERCENTAGE: float = float(
    os.getenv("INSURANCE_COST_PERCENTAGE", "0.02")
)
"""Insurance premium as a fraction of total shipment value (0.02 = 2 %)."""

# ==========================================================
# Product Categories
# ==========================================================

PRODUCT_CATEGORIES: list[str] = [
    "Vaccines",
    "Medicines",
    "Dairy Products",
    "Frozen Foods",
    "Seafood",
    "Fresh Fruits",
    "Fresh Vegetables",
    "Meat",
    "Poultry",
    "Ice Cream",
    "Chocolate",
    "Bakery Products",
]

# ==========================================================
# Product Names
# ==========================================================

PRODUCT_NAMES: list[str] = [
    "COVID-19 Vaccine",
    "Polio Vaccine",
    "BCG Vaccine",
    "Insulin",
    "Paracetamol Syrup",
    "Milk",
    "Butter",
    "Cheese",
    "Curd",
    "Paneer",
    "Ice Cream",
    "Chicken",
    "Mutton",
    "Fish",
    "Prawns",
    "Salmon",
    "Frozen Meat",
    "Frozen Pizza",
    "Frozen Peas",
    "Frozen French Fries",
    "Apple",
    "Banana",
    "Orange",
    "Grapes",
    "Tomato",
    "Potato",
    "Onion",
    "Carrot",
    "Broccoli",
    "Lettuce",
    "Chocolate",
    "Bread",
    "Cake",
]

# ==========================================================
# Vehicle Types
# ==========================================================

VEHICLE_TYPES: list[str] = [
    "Refrigerated Truck",
    "Refrigerated Van",
    "Cold Storage Container",
    "Reefer Trailer",
    "Mini Reefer Truck",
    "Insulated Container",
]

# ==========================================================
# Indian Cities
# ==========================================================

INDIAN_CITIES: list[str] = [
    "Kolkata",
    "Delhi",
    "Mumbai",
    "Bengaluru",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Patna",
    "Bhubaneswar",
    "Ranchi",
    "Guwahati",
    "Siliguri",
    "Durgapur",
    "Asansol",
    "Nagpur",
    "Indore",
    "Bhopal",
    "Visakhapatnam",
    "Kochi",
    "Coimbatore",
    "Surat",
    "Noida",
    "Gurugram",
    "Kanpur",
    "Varanasi",
    "Chandigarh",
    "Srinagar",
]

# ==========================================================
# Transport Modes
# ==========================================================

TRANSPORT_MODES: list[str] = [
    "Road",
    "Rail",
    "Air",
    "Sea",
]
# ==========================================================
# Logging Configuration
# ==========================================================

LOGGER_NAME: str = "AtmoSyncAI"

LOG_FORMAT: str = (
    "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

LOG_DATE_FORMAT: str = "%Y-%m-%d %H:%M:%S"

DEFAULT_LOG_LEVEL: str = "INFO"

# Maximum size of a single log file before rotation (10 MB).
LOG_MAX_BYTES: int = 10 * 1024 * 1024

# Number of rotated log files to retain.
LOG_BACKUP_COUNT: int = 5


def build_production_logging_config() -> dict[str, Any]:
    """
    Build production-level logging configuration.

    Includes:
    - Console handler (stdout) at DEFAULT_LOG_LEVEL.
    - Rotating file handler writing to ``LOGS_DIR / "atmosync.log"``
      when LOGS_DIR exists.

    Returns:
        Dictionary compatible with ``logging.config.dictConfig()``.
    """
    config: dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": LOG_FORMAT,
                "datefmt": LOG_DATE_FORMAT,
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "standard",
                "level": DEFAULT_LOG_LEVEL,
                "stream": "ext://sys.stdout",
            }
        },
        "loggers": {
            LOGGER_NAME: {
                "handlers": ["console"],
                "level": DEFAULT_LOG_LEVEL,
                "propagate": False,
            }
        },
        "root": {
            "handlers": ["console"],
            "level": DEFAULT_LOG_LEVEL,
        },
    }

    # Add rotating file handler if the LOGS_DIR exists.
    log_file = LOGS_DIR / "atmosync.log"
    try:
        LOGS_DIR.mkdir(parents=True, exist_ok=True)
        config["handlers"]["file"] = {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "standard",
            "level": DEFAULT_LOG_LEVEL,
            "filename": str(log_file),
            "maxBytes": LOG_MAX_BYTES,
            "backupCount": LOG_BACKUP_COUNT,
            "encoding": "utf-8",
        }
        config["loggers"][LOGGER_NAME]["handlers"].append("file")  # type: ignore[attr-defined]
        config["root"]["handlers"].append("file")  # type: ignore[attr-defined]
    except OSError:
        # Fail silently – console-only logging is acceptable.
        pass

    return config


# ==========================================================
# Public Exports
# ==========================================================

__all__ = [
    "PROJECT_NAME",
    "VERSION",
    "AUTHOR",
    "DESCRIPTION",

    "PROJECT_ROOT",

    "ensure_folder",

    "CONFIG_DIR",
    "DATA_DIR",
    "RAW_DATA_DIR",
    "PROCESSED_DATA_DIR",
    "EXPORTS_DIR",

    "REPORTS_DIR",
    "REPORTS_OUTPUT_DIR",
    "REPORTS_DOCUMENTATION_DIR",
    "REPORTS_SCREENSHOTS_DIR",
    "REPORTS_PRESENTATION_DIR",

    "SCRIPTS_DIR",
    "DASHBOARD_DIR",
    "NOTEBOOKS_DIR",
    "TESTS_DIR",

    "STATIC_DIR",
    "ASSETS_DIR",
    "LOGS_DIR",
    "TEMP_DIR",

    "SENSOR_DATA_CSV",
    "PROCESSED_SENSOR_DATA_CSV",
    "FINAL_DASHBOARD_DATA_CSV",

    "EXECUTIVE_SUMMARY_CSV",
    "BUSINESS_INSIGHTS_CSV",
    "FINANCIAL_SUMMARY_CSV",

    "POWER_BI_FILE_PATH",
    "DASHBOARD_DATASET_PATH",

    "API_HOST",
    "API_PORT",
    "API_DEBUG",
    "API_RELOAD",
    "API_PREFIX",

    "ALLOWED_ORIGINS",
    "CORS_ALLOW_CREDENTIALS",
    "CORS_ALLOW_METHODS",
    "CORS_ALLOW_HEADERS",

    "RANDOM_SEED",
    "DEFAULT_RECORDS",
    "DATE_FORMAT",
    "DATETIME_FORMAT",
    "TIMEZONE",

    "SENSOR_TEMPERATURE_RANGE",
    "SENSOR_HUMIDITY_RANGE",
    "SENSOR_BATTERY_RANGE",
    "SENSOR_VIBRATION_RANGE",
    "SENSOR_SHOCK_RANGE",
    "SENSOR_DELAY_HOURS_RANGE",

    "PRODUCT_STORAGE_TEMPERATURES",

    "ALERT_TEMPERATURE_HIGH_THRESHOLD_C",
    "ALERT_TEMPERATURE_LOW_THRESHOLD_C",
    "ALERT_HUMIDITY_HIGH_THRESHOLD_PERCENT",
    "ALERT_HUMIDITY_LOW_THRESHOLD_PERCENT",
    "ALERT_BATTERY_LOW_THRESHOLD_PERCENT",
    "ALERT_DELAY_HIGH_THRESHOLD_HOURS",

    "GPS_COORDINATE_PRECISION",
    "GPS_DEFAULT_LATITUDE",
    "GPS_DEFAULT_LONGITUDE",

    "CURRENCY",
    "DELAY_COST_PER_HOUR",
    "SPOILAGE_COST_PERCENTAGE",
    "FUEL_COST_PER_LITER",
    "INSURANCE_COST_PERCENTAGE",

    "PRODUCT_CATEGORIES",
    "PRODUCT_NAMES",
    "VEHICLE_TYPES",
    "INDIAN_CITIES",
    "TRANSPORT_MODES",

    "LOGGER_NAME",
    "LOG_FORMAT",
    "LOG_DATE_FORMAT",
    "DEFAULT_LOG_LEVEL",
    "LOG_MAX_BYTES",
    "LOG_BACKUP_COUNT",

    "build_production_logging_config",
]
