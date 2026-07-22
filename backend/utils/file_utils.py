"""AtmoSync AI — File Utility Helpers.

Reusable file and path operations used across the analytics pipeline
(pipeline scripts, export scripts, data-loading services).

Every function in this module is:

* Generic (no business logic, no project-specific magic numbers)
* Self-contained (no imports from backend.scripts, backend.services,
  backend.schemas, or backend.config.business_rules)
* Fully type-hinted with complete docstrings
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional, Union

import pandas as pd

PathLike = Union[str, Path]
"""Type alias for any value that can be passed to ``Path()``."""


# ---------------------------------------------------------------------------
# CSV I/O
# ---------------------------------------------------------------------------


def safe_read_csv(
    path: PathLike,
    *,
    encoding: str = "utf-8",
    dtype_backend: str = "numpy_nullable",
    **kwargs,
) -> pd.DataFrame:
    """Read a CSV file and return a DataFrame.

    Wraps ``pd.read_csv`` with:

    * An early existence check that raises ``FileNotFoundError``.
    * Optional ``dtype_backend`` support (default ``"numpy_nullable"``).
    * Structured logging at INFO / ERROR level.

    Parameters
    ----------
    path : PathLike
        Absolute or relative path to the CSV file.
    encoding : str
        File encoding (default ``"utf-8"``).
    dtype_backend : str
        Back-end used by ``pandas`` for nullable dtypes (default
        ``"numpy_nullable"``). Pass ``"pyarrow"`` if PyArrow is installed.
    **kwargs
        Additional keyword arguments forwarded to ``pd.read_csv``.

    Returns
    -------
    pd.DataFrame
        The parsed DataFrame.

    Raises
    ------
    FileNotFoundError
        If the file does not exist.
    pd.errors.EmptyDataError
        If the file is empty and ``pd.read_csv`` raises it (bubbled up).
    pd.errors.ParserError
        If the file cannot be parsed (bubbled up).
    """
    logger = logging.getLogger(__name__)

    resolved = Path(path).resolve()
    if not resolved.exists():
        raise FileNotFoundError(f"CSV file not found: {resolved}")
    if not resolved.is_file():
        raise FileNotFoundError(f"Path is not a file: {resolved}")

    logger.info("Reading CSV (%d bytes) -> %s", resolved.stat().st_size, resolved)

    try:
        df = pd.read_csv(
            resolved,
            encoding=encoding,
            dtype_backend=dtype_backend,
            **kwargs,
        )
    except pd.errors.EmptyDataError:
        logger.warning("CSV file is empty: %s", resolved)
        raise
    except pd.errors.ParserError:
        logger.exception("Failed to parse CSV: %s", resolved)
        raise

    logger.info("Loaded CSV -> %d rows x %d columns", len(df), len(df.columns))
    return df


def safe_write_csv(
    df: pd.DataFrame,
    path: PathLike,
    *,
    index: bool = False,
    encoding: str = "utf-8",
    **kwargs,
) -> Path:
    """Write a DataFrame to CSV, creating parent directories if needed.

    Wraps ``df.to_csv`` with:

    * Automatic ``parent.mkdir(parents=True, exist_ok=True)``.
    * Structured logging at INFO level.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame to persist.
    path : PathLike
        Destination file path.
    index : bool
        Whether to write the DataFrame index (default ``False``).
    encoding : str
        File encoding (default ``"utf-8"``).
    **kwargs
        Additional keyword arguments forwarded to ``df.to_csv``.

    Returns
    -------
    Path
        The resolved, absolute path of the written file.
    """
    logger = logging.getLogger(__name__)

    resolved = Path(path).resolve()
    resolved.parent.mkdir(parents=True, exist_ok=True)

    df.to_csv(resolved, index=index, encoding=encoding, **kwargs)

    file_size = resolved.stat().st_size
    logger.info(
        "Wrote CSV (%d rows, %d cols, %d bytes) -> %s",
        len(df),
        len(df.columns),
        file_size,
        resolved,
    )
    return resolved


# ---------------------------------------------------------------------------
# Directory / Path helpers
# ---------------------------------------------------------------------------


def ensure_directory(path: PathLike) -> Path:
    """Ensure a directory exists, creating it (and parents) if necessary.

    Parameters
    ----------
    path : PathLike
        Directory path to ensure.

    Returns
    -------
    Path
        The resolved path (same value, for chaining convenience).
    """
    resolved = Path(path).resolve()
    resolved.mkdir(parents=True, exist_ok=True)
    return resolved


def file_exists(path: PathLike) -> bool:
    """Check whether a file exists at the given path.

    This is a thin wrapper around ``Path.is_file()`` that accepts both
    strings and ``Path`` objects.

    Parameters
    ----------
    path : PathLike
        File path to check.

    Returns
    -------
    bool
        ``True`` if the path points to an existing regular file.
    """
    return Path(path).is_file()


def resolve_project_path(*parts: str) -> Path:
    """Build an absolute path anchored at the project root directory.

    The project root is defined as the parent of the directory containing
    this file (i.e. ``backend/utils/../../`` → project root).

    Parameters
    ----------
    *parts : str
        One or more path segments to join under the project root.

    Returns
    -------
    Path
        Absolute ``Path`` object. E.g. ``resolve_project_path("data", "raw")``
        returns ``Path("/abs/path/to/project/data/raw")``.
    """
    # This file lives at:  backend/utils/file_utils.py
    # Project root is two levels up.
    project_root = Path(__file__).resolve().parents[2]
    return project_root.joinpath(*parts)


# ---------------------------------------------------------------------------
# Module-level ``__all__`` for explicit export control
# ---------------------------------------------------------------------------

__all__ = [
    "PathLike",
    "ensure_directory",
    "file_exists",
    "resolve_project_path",
    "safe_read_csv",
    "safe_write_csv",
]

