"""
AtmoSync AI - Utilities Package

This module provides shared utility functions used across
the backend services and scripts.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Optional

import pandas as pd

from backend.config.config import LOGGER_NAME


def coerce_numeric(df: pd.DataFrame, col: str) -> pd.Series:
    """Coerce a DataFrame column to numeric, returning NA series if missing."""
    if col not in df.columns:
        return pd.Series([pd.NA] * len(df), dtype="float64")
    return pd.to_numeric(df[col], errors="coerce")


def require_columns(df: pd.DataFrame, required: list[str]) -> None:
    """Validate that required columns exist in a DataFrame."""
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")


def safe_json_serialize(obj: Any) -> str:
    """Safely serialize an object to JSON string."""
    try:
        return json.dumps(obj, ensure_ascii=False, default=str)
    except (TypeError, ValueError):
        return str(obj)


def ensure_directory(path: Path) -> Path:
    """Ensure a directory exists, creating it if necessary."""
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_logger(name: Optional[str] = None) -> logging.Logger:
    """Get a configured logger instance."""
    return logging.getLogger(name or LOGGER_NAME)


__all__ = [
    "coerce_numeric",
    "require_columns",
    "safe_json_serialize",
    "ensure_directory",
    "get_logger",
]

