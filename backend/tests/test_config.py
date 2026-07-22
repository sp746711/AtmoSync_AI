"""Tests for the backend configuration module.

Verifies that configuration constants are correctly loaded from
environment variables, paths resolve properly, and utility functions
like ``ensure_folder`` behave as expected.

No production code is modified.  Environment variables are isolated
via ``monkeypatch``.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import pytest

from backend.config.config import (
    ALLOWED_ORIGINS,
    API_HOST,
    API_PORT,
    CORS_ALLOW_CREDENTIALS,
    CORS_ALLOW_HEADERS,
    CORS_ALLOW_METHODS,
    DASHBOARD_DATASET_PATH,
    FINAL_DASHBOARD_DATA_CSV,
    LOG_BACKUP_COUNT,
    LOG_DATE_FORMAT,
    LOG_FORMAT,
    LOG_MAX_BYTES,
    LOGGER_NAME,
    LOGS_DIR,
    POWER_BI_FILE_PATH,
    PROJECT_NAME,
    PROJECT_ROOT,
    RANDOM_SEED,
    SENSOR_DATA_CSV,
    SENSOR_TEMPERATURE_RANGE,
    SENSOR_HUMIDITY_RANGE,
    SENSOR_BATTERY_RANGE,
    SENSOR_DELAY_HOURS_RANGE,
    VERSION,
    ALERT_TEMPERATURE_HIGH_THRESHOLD_C,
    ALERT_TEMPERATURE_LOW_THRESHOLD_C,
    ALERT_HUMIDITY_HIGH_THRESHOLD_PERCENT,
    ALERT_HUMIDITY_LOW_THRESHOLD_PERCENT,
    ALERT_BATTERY_LOW_THRESHOLD_PERCENT,
    ALERT_DELAY_HIGH_THRESHOLD_HOURS,
    CURRENCY,
    DELAY_COST_PER_HOUR,
    SPOILAGE_COST_PERCENTAGE,
    FUEL_COST_PER_LITER,
    INSURANCE_COST_PERCENTAGE,
    PRODUCT_CATEGORIES,
    PRODUCT_NAMES,
    VEHICLE_TYPES,
    INDIAN_CITIES,
    TRANSPORT_MODES,
    DEFAULT_RECORDS,
    ensure_folder,
    build_production_logging_config,
)


# ---------------------------------------------------------------------------
# Project Metadata
# ---------------------------------------------------------------------------

class TestProjectMetadata:
    """Static project identity constants."""

    def test_project_name(self) -> None:
        """PROJECT_NAME is a non-empty string."""
        assert isinstance(PROJECT_NAME, str)
        assert len(PROJECT_NAME) > 0

    def test_version_is_string(self) -> None:
        """VERSION is a non-empty string."""
        assert isinstance(VERSION, str)
        assert len(VERSION) > 0

    def test_project_root_is_path(self) -> None:
        """PROJECT_ROOT is the backend/ directory with key files."""
        assert isinstance(PROJECT_ROOT, Path)
        assert PROJECT_ROOT.is_dir()
        assert (PROJECT_ROOT / "__init__.py").is_file()
        assert (PROJECT_ROOT / "main.py").is_file()

    def test_random_seed_is_42(self) -> None:
        """RANDOM_SEED defaults to 42."""
        assert RANDOM_SEED == 42

    def test_default_records_is_1000(self) -> None:
        """DEFAULT_RECORDS defaults to 1000."""
        assert DEFAULT_RECORDS == 1000


# ---------------------------------------------------------------------------
# ensure_folder
# ---------------------------------------------------------------------------

class TestEnsureFolder:
    """``ensure_folder`` utility."""

    def test_creates_directory(self, tmp_path: Path) -> None:
        """ensure_folder creates a new directory."""
        target = tmp_path / "new_folder"
        assert not target.exists()
        result = ensure_folder(target)
        assert target.is_dir()
        assert result == target

    def test_creates_nested_directories(self, tmp_path: Path) -> None:
        """ensure_folder creates parent directories as needed."""
        target = tmp_path / "a" / "b" / "c"
        result = ensure_folder(target)
        assert result.is_dir()

    def test_existing_directory_does_not_raise(self, tmp_path: Path) -> None:
        """ensure_folder is idempotent on existing directories."""
        target = tmp_path / "existing"
        target.mkdir()
        result = ensure_folder(target)
        assert result == target
        assert result.is_dir()

    def test_returns_path_for_chaining(self, tmp_path: Path) -> None:
        """ensure_folder returns the same Path for chaining."""
        target = tmp_path / "chain"
        result = ensure_folder(target)
        assert result == target


# ---------------------------------------------------------------------------
# Directory Paths
# ---------------------------------------------------------------------------

class TestDirectoryPaths:
    """All directory path constants."""

    def test_logs_dir_is_under_project(self) -> None:
        """LOGS_DIR is absolute and under PROJECT_ROOT."""
        assert isinstance(LOGS_DIR, Path)
        assert str(LOGS_DIR).startswith(str(PROJECT_ROOT))

    def test_sensor_csv_path_structure(self) -> None:
        """SENSOR_DATA_CSV points to raw/sensor_data.csv."""
        assert SENSOR_DATA_CSV.name == "sensor_data.csv"
        assert "raw" in str(SENSOR_DATA_CSV)

    def test_final_dashboard_csv_path_structure(self) -> None:
        """FINAL_DASHBOARD_DATA_CSV points to exports/final_dashboard_data.csv."""
        assert FINAL_DASHBOARD_DATA_CSV.name == "final_dashboard_data.csv"
        assert "exports" in str(FINAL_DASHBOARD_DATA_CSV)

    def test_power_bi_file_path(self) -> None:
        """POWER_BI_FILE_PATH points to dashboard/AtmoSync_AI.pbix."""
        assert POWER_BI_FILE_PATH.name == "AtmoSync_AI.pbix"
        assert "dashboard" in str(POWER_BI_FILE_PATH)

    def test_dashboard_dataset_path(self) -> None:
        """DASHBOARD_DATASET_PATH equals FINAL_DASHBOARD_DATA_CSV."""
        assert DASHBOARD_DATASET_PATH == FINAL_DASHBOARD_DATA_CSV


# ---------------------------------------------------------------------------
# API Configuration
# ---------------------------------------------------------------------------

class TestAPIConfig:
    """API host/port defaults."""

    def test_api_host_default(self) -> None:
        """API_HOST defaults to 0.0.0.0."""
        assert API_HOST == "0.0.0.0"

    def test_api_port_default(self) -> None:
        """API_PORT defaults to 8000."""
        assert API_PORT == 8000

    def test_api_host_from_env(self, monkeypatch: pytest.MonkeyPatch) -> None:
        """API_HOST can be overridden via environment variable."""
        monkeypatch.setenv("API_HOST", "127.0.0.1")
        monkeypatch.setenv("API_PORT", "9000")
        import importlib
        import backend.config.config as cfg
        importlib.reload(cfg)
        assert cfg.API_HOST == "127.0.0.1"
        assert cfg.API_PORT == 9000
        monkeypatch.delenv("API_HOST")
        monkeypatch.delenv("API_PORT")
        importlib.reload(cfg)


# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------

class TestCORSConfig:
    """CORS-related constants."""

    def test_allowed_origins_contains_localhost(self) -> None:
        """ALLOWED_ORIGINS includes localhost development URLs."""
        assert isinstance(ALLOWED_ORIGINS, list)
        assert any("localhost" in origin for origin in ALLOWED_ORIGINS)

    def test_cors_allow_credentials(self) -> None:
        """CORS allows credentials."""
        assert CORS_ALLOW_CREDENTIALS is True

    def test_cors_allow_methods_all(self) -> None:
        """CORS allows all methods."""
        assert CORS_ALLOW_METHODS == ["*"]

    def test_cors_allow_headers_all(self) -> None:
        """CORS allows all headers."""
        assert CORS_ALLOW_HEADERS == ["*"]


# ---------------------------------------------------------------------------
# Sensor Configuration
# ---------------------------------------------------------------------------

class TestSensorConfig:
    """Sensor range configuration."""

    def test_temperature_range(self) -> None:
        """SENSOR_TEMPERATURE_RANGE has min/max keys and valid values."""
        assert "min_c" in SENSOR_TEMPERATURE_RANGE
        assert "max_c" in SENSOR_TEMPERATURE_RANGE
        assert SENSOR_TEMPERATURE_RANGE["min_c"] < SENSOR_TEMPERATURE_RANGE["max_c"]

    def test_humidity_range(self) -> None:
        """SENSOR_HUMIDITY_RANGE has valid percentage range."""
        assert SENSOR_HUMIDITY_RANGE["min_percent"] >= 0.0
        assert SENSOR_HUMIDITY_RANGE["max_percent"] <= 100.0

    def test_battery_range(self) -> None:
        """SENSOR_BATTERY_RANGE is 0-100%."""
        assert SENSOR_BATTERY_RANGE["min_percent"] == 0.0
        assert SENSOR_BATTERY_RANGE["max_percent"] == 100.0

    def test_delay_hours_range(self) -> None:
        """SENSOR_DELAY_HOURS_RANGE has non-negative bounds."""
        assert SENSOR_DELAY_HOURS_RANGE["min_hours"] >= 0.0
        assert SENSOR_DELAY_HOURS_RANGE["max_hours"] > 0.0


# ---------------------------------------------------------------------------
# Alert Thresholds
# ---------------------------------------------------------------------------

class TestAlertThresholds:
    """Alert threshold defaults."""

    def test_temperature_high_threshold(self) -> None:
        """ALERT_TEMPERATURE_HIGH_THRESHOLD_C is positive."""
        assert ALERT_TEMPERATURE_HIGH_THRESHOLD_C > 0.0

    def test_temperature_low_threshold(self) -> None:
        """ALERT_TEMPERATURE_LOW_THRESHOLD_C is negative."""
        assert ALERT_TEMPERATURE_LOW_THRESHOLD_C < 0.0

    def test_humidity_high_threshold(self) -> None:
        """ALERT_HUMIDITY_HIGH_THRESHOLD_PERCENT is <= 100."""
        assert ALERT_HUMIDITY_HIGH_THRESHOLD_PERCENT <= 100.0

    def test_battery_low_threshold(self) -> None:
        """ALERT_BATTERY_LOW_THRESHOLD_PERCENT is positive."""
        assert ALERT_BATTERY_LOW_THRESHOLD_PERCENT > 0.0

    def test_delay_high_threshold(self) -> None:
        """ALERT_DELAY_HIGH_THRESHOLD_HOURS is positive."""
        assert ALERT_DELAY_HIGH_THRESHOLD_HOURS > 0.0


# ---------------------------------------------------------------------------
# Financial Configuration
# ---------------------------------------------------------------------------

class TestFinancialConfig:
    """Financial calculation defaults."""

    def test_currency_default(self) -> None:
        """CURRENCY defaults to INR."""
        assert CURRENCY == "INR"

    def test_delay_cost_per_hour(self) -> None:
        """DELAY_COST_PER_HOUR is positive."""
        assert DELAY_COST_PER_HOUR > 0.0

    def test_spoilage_cost_percentage(self) -> None:
        """SPOILAGE_COST_PERCENTAGE is between 0 and 1."""
        assert 0.0 < SPOILAGE_COST_PERCENTAGE < 1.0

    def test_fuel_cost_per_liter(self) -> None:
        """FUEL_COST_PER_LITER is positive."""
        assert FUEL_COST_PER_LITER > 0.0

    def test_insurance_cost_percentage(self) -> None:
        """INSURANCE_COST_PERCENTAGE is between 0 and 1."""
        assert 0.0 < INSURANCE_COST_PERCENTAGE < 1.0


# ---------------------------------------------------------------------------
# Static Data Lists
# ---------------------------------------------------------------------------

class TestStaticData:
    """Product categories, names, cities, etc."""

    def test_product_categories_non_empty(self) -> None:
        """PRODUCT_CATEGORIES is a non-empty list."""
        assert isinstance(PRODUCT_CATEGORIES, list)
        assert len(PRODUCT_CATEGORIES) > 0

    def test_product_names_non_empty(self) -> None:
        """PRODUCT_NAMES is a non-empty list."""
        assert isinstance(PRODUCT_NAMES, list)
        assert len(PRODUCT_NAMES) > 0

    def test_vehicle_types_non_empty(self) -> None:
        """VEHICLE_TYPES is a non-empty list."""
        assert isinstance(VEHICLE_TYPES, list)
        assert len(VEHICLE_TYPES) > 0

    def test_indian_cities_non_empty(self) -> None:
        """INDIAN_CITIES is a non-empty list."""
        assert isinstance(INDIAN_CITIES, list)
        assert len(INDIAN_CITIES) > 0

    def test_transport_modes_non_empty(self) -> None:
        """TRANSPORT_MODES is a non-empty list."""
        assert isinstance(TRANSPORT_MODES, list)
        assert len(TRANSPORT_MODES) > 0


# ---------------------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------------------

class TestLoggingConfig:
    """Logging-related constants and builder."""

    def test_logger_name(self) -> None:
        """LOGGER_NAME is non-empty."""
        assert isinstance(LOGGER_NAME, str)
        assert len(LOGGER_NAME) > 0

    def test_log_format_contains_placeholders(self) -> None:
        """LOG_FORMAT includes standard logging placeholders."""
        assert "%(asctime)s" in LOG_FORMAT
        assert "%(levelname)s" in LOG_FORMAT

    def test_log_date_format(self) -> None:
        """LOG_DATE_FORMAT is a non-empty strptime format."""
        assert isinstance(LOG_DATE_FORMAT, str)
        assert len(LOG_DATE_FORMAT) > 0

    def test_log_max_bytes(self) -> None:
        """LOG_MAX_BYTES is a reasonable positive integer."""
        assert LOG_MAX_BYTES > 0
        assert LOG_MAX_BYTES >= 1024 * 1024  # at least 1 MB

    def test_log_backup_count(self) -> None:
        """LOG_BACKUP_COUNT is a positive integer."""
        assert LOG_BACKUP_COUNT > 0

    def test_build_production_logging_config_structure(self) -> None:
        """build_production_logging_config returns valid dictConfig."""
        config: dict[str, Any] = build_production_logging_config()
        assert "version" in config
        assert config["version"] == 1
        assert "formatters" in config
        assert "handlers" in config
        assert "loggers" in config
        assert "root" in config
        assert "console" in config["handlers"]
        assert LOGGER_NAME in config["loggers"]

    def test_logging_config_has_console_handler(self) -> None:
        """Console handler uses StreamHandler."""
        config = build_production_logging_config()
        console = config["handlers"]["console"]
        assert console["class"] == "logging.StreamHandler"
        assert console["stream"] == "ext://sys.stdout"
