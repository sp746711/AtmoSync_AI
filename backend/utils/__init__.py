"""
AtmoSync AI - Utilities Package

This module provides shared utility functions used across
the backend services and scripts.

Sub-modules
-----------
file_utils
    File/path I/O helpers (``safe_read_csv``, ``safe_write_csv``, etc.).
dataframe_utils
    Generic DataFrame operations (``coerce_numeric_columns``,
    ``validate_required_columns``, etc.).
validation_utils
    Generic validation helpers (``validate_percentage``,
    ``validate_risk_score``, etc.).

Backward-compatible aliases
---------------------------
The following functions are defined here for callers that import
directly from ``backend.utils`` (e.g. ``alert_service.py``):

* ``coerce_numeric`` (same signature as before)
* ``require_columns``
* ``safe_json_serialize``
* ``ensure_directory``
* ``get_logger``

All new code should import from the specific sub-module.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Optional

import pandas as pd

from backend.config.config import LOGGER_NAME

# ---------------------------------------------------------------------------
# Expose sub-modules so they can be accessed via ``backend.utils.file_utils``
# ---------------------------------------------------------------------------

from backend.utils import file_utils  # noqa: F401
from backend.utils import dataframe_utils  # noqa: F401
from backend.utils import validation_utils  # noqa: F401

# ---------------------------------------------------------------------------
# Legacy / backward-compatible helpers
# ---------------------------------------------------------------------------


def coerce_numeric(df: pd.DataFrame, col: str) -> pd.Series:
    """Coerce a DataFrame column to numeric, returning NA series if missing.

    .. deprecated::
        Use ``dataframe_utils.coerce_numeric_columns`` for new code.

    Parameters
    ----------
    df : pd.DataFrame
        Input DataFrame (not modified).
    col : str
        Column name to coerce.

    Returns
    -------
    pd.Series
        Numeric Series, or a Series filled with ``pd.NA`` if the column
        is missing from the DataFrame.
    """
    if col not in df.columns:
        return pd.Series([pd.NA] * len(df), dtype="float64")
    return pd.to_numeric(df[col], errors="coerce")


def require_columns(df: pd.DataFrame, required: list[str]) -> None:
    """Validate that required columns exist in a DataFrame.

    .. deprecated::
        Use ``dataframe_utils.validate_required_columns`` for new code.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame to validate.
    required : list[str]
        Column names that must be present.

    Raises
    ------
    ValueError
        If any required column is missing.
    """
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")


def safe_json_serialize(obj: Any) -> str:
    """Safely serialize an object to JSON string.

    Parameters
    ----------
    obj : Any
        Object to serialize.

    Returns
    -------
    str
        JSON string, or ``str(obj)`` if serialization fails.
    """
    try:
        return json.dumps(obj, ensure_ascii=False, default=str)
    except (TypeError, ValueError):
        return str(obj)


def ensure_directory(path: Path) -> Path:
    """Ensure a directory exists, creating it if necessary.

    .. deprecated::
        Use ``file_utils.ensure_directory`` for new code.

    Parameters
    ----------
    path : Path
        Directory path to ensure.

    Returns
    -------
    Path
        The same ``path`` for chaining convenience.
    """
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_logger(name: Optional[str] = None) -> logging.Logger:
    """Get a configured logger instance.

    Parameters
    ----------
    name : str or None
        Logger name. Defaults to the project-wide logger name.

    Returns
    -------
    logging.Logger
        A logger instance.
    """
    return logging.getLogger(name or LOGGER_NAME)


__all__ = [
    "coerce_numeric",
    "dataframe_utils",
    "ensure_directory",
    "file_utils",
    "get_logger",
    "require_columns",
    "safe_json_serialize",
    "validation_utils",
]

