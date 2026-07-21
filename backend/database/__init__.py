"""
AtmoSync AI - Database Package

This module provides database connectivity and operations.
Currently supports CSV-based storage with an interface for
future migration to relational/NoSQL databases.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Optional

import pandas as pd

from backend.config.config import (
    LOGGER_NAME,
    FINAL_DASHBOARD_DATA_CSV,
    PROCESSED_SENSOR_DATA_CSV,
    SENSOR_DATA_CSV,
)


class DatabaseConnection:
    """Manages database connections and provides CRUD operations."""

    def __init__(self) -> None:
        self.logger = logging.getLogger(LOGGER_NAME)
        self._connected = False

    def connect(self) -> bool:
        """Establish database connection."""
        self._connected = True
        self.logger.info("Database connection established (CSV mode)")
        return True

    def disconnect(self) -> bool:
        """Close database connection."""
        self._connected = False
        self.logger.info("Database connection closed")
        return True

    @property
    def is_connected(self) -> bool:
        """Check if database is connected."""
        return self._connected

    def read_csv(self, path: Path) -> pd.DataFrame:
        """Read a CSV file into a DataFrame."""
        if not path.exists():
            raise FileNotFoundError(f"CSV file not found: {path}")
        return pd.read_csv(path)

    def write_csv(self, df: pd.DataFrame, path: Path) -> None:
        """Write a DataFrame to a CSV file."""
        path.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(path, index=False)

    def read_sensor_data(self) -> pd.DataFrame:
        """Read raw sensor data."""
        return self.read_csv(SENSOR_DATA_CSV)

    def read_processed_data(self) -> pd.DataFrame:
        """Read processed sensor data."""
        return self.read_csv(PROCESSED_SENSOR_DATA_CSV)

    def read_dashboard_data(self) -> pd.DataFrame:
        """Read final dashboard dataset."""
        return self.read_csv(FINAL_DASHBOARD_DATA_CSV)


# Singleton instance
db = DatabaseConnection()


def get_database() -> DatabaseConnection:
    """Get the database connection instance."""
    return db


__all__ = [
    "DatabaseConnection",
    "db",
    "get_database",
]

