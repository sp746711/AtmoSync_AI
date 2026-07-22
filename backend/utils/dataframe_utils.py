"""AtmoSync AI — DataFrame Utility Helpers.

Reusable ``pandas`` DataFrame operations used across the analytics pipeline.

Every function in this module is:

* Generic (no business logic, no project-specific calculations)
* Never modifies an input DataFrame in-place unless documented
  (functions that return ``None`` operate in-place; all others return a **copy**)
* Fully type-hinted with complete docstrings
"""

from __future__ import annotations

from typing import Any, Optional, Sequence

import pandas as pd


# ---------------------------------------------------------------------------
# Column coercion
# ---------------------------------------------------------------------------


def coerce_numeric_columns(
    df: pd.DataFrame,
    columns: Sequence[str],
    *,
    errors: str = "coerce",
) -> pd.DataFrame:
    """Coerce specified columns to numeric, returning a **copy** of the input.

    This consolidates the ``_coerce_numeric`` pattern that is currently
    duplicated across ``data_cleaning.py``, ``feature_engineering.py``,
    ``risk_assessment.py``, and ``business_insights.py``.

    Columns not present in the DataFrame are silently ignored (per the
    existing project convention in ``data_cleaning.py``).

    Parameters
    ----------
    df : pd.DataFrame
        Input DataFrame (not modified).
    columns : Sequence[str]
        Column names to coerce.
    errors : str
        ``"coerce"`` (default) —  invalid parsing → ``pd.NA``.
        ``"raise"`` — raise on invalid values.
        ``"ignore"`` — return the input unchanged when invalid.

    Returns
    -------
    pd.DataFrame
        A **copy** of ``df`` with the specified columns coerced to numeric.

    See Also
    --------
    pandas.to_numeric : Underlying pandas coercion function.
    """
    out = df.copy()
    for col in columns:
        if col not in out.columns:
            continue
        out[col] = pd.to_numeric(out[col], errors=errors)
    return out


# ---------------------------------------------------------------------------
# Column validation
# ---------------------------------------------------------------------------


def validate_required_columns(
    df: pd.DataFrame,
    columns: Sequence[str],
) -> None:
    """Validate that all required columns exist in the DataFrame.

    This consolidates the ``_require_columns`` pattern that is currently
    duplicated across ``data_cleaning.py``, ``feature_engineering.py``,
    ``business_insights.py``, and ``risk_assessment.py``.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame to validate.
    columns : Sequence[str]
        Column names that must be present.

    Raises
    ------
    ValueError
        If any required column is missing. The message lists every missing
        column name.
    """
    missing = [c for c in columns if c not in df.columns]
    if missing:
        raise ValueError(
            f"Missing required columns in input dataset: {missing}"
        )


# ---------------------------------------------------------------------------
# Column name normalisation
# ---------------------------------------------------------------------------


def normalize_column_names(df: pd.DataFrame, *, strip: bool = True) -> pd.DataFrame:
    """Normalise column names to ``Title Case`` with whitespace stripped.

    This is a general-purpose helper that reproduces the column-renaming
    step used in ``data_cleaning._standardize_columns`` but without any
    project-specific mappings.

    Parameters
    ----------
    df : pd.DataFrame
        Input DataFrame (not modified).
    strip : bool
        If ``True`` (default), strip leading/trailing whitespace from
        every column name before converting to title case.

    Returns
    -------
    pd.DataFrame
        A **copy** of ``df`` with normalised column names.
    """
    out = df.copy()

    rename_map: dict[str, str] = {}
    for col in out.columns:
        cleaned = str(col).strip() if strip else str(col)
        # Convert ``snake_case``, ``kebab-case``, and mixed case to Title Case.
        # Simple heuristic: replace underscores/hyphens with space, then title().
        normalised = cleaned.replace("_", " ").replace("-", " ").title()
        if normalised != col:
            rename_map[col] = normalised

    if rename_map:
        out = out.rename(columns=rename_map)

    return out


# ---------------------------------------------------------------------------
# Safe copy
# ---------------------------------------------------------------------------


def safe_dataframe_copy(
    df: pd.DataFrame,
    *,
    deep: bool = True,
) -> pd.DataFrame:
    """Return a safe copy of a DataFrame.

    Explicitly calling ``.copy()`` is a recommended pandas best practice
    to avoid SettingWithCopyWarning and unintended mutation.  This helper
    makes the intent obvious.

    Parameters
    ----------
    df : pd.DataFrame
        Input DataFrame.
    deep : bool
        Whether to perform a deep copy (default ``True``).  Deep copies
        copy the data and indices; shallow copies share the underlying data.

    Returns
    -------
    pd.DataFrame
        A copy of ``df``.
    """
    return df.copy(deep=deep)


# ---------------------------------------------------------------------------
# Empty DataFrame factory
# ---------------------------------------------------------------------------


def empty_dataframe(
    columns: Optional[Sequence[str]] = None,
    *,
    dtypes: Optional[dict[str, Any]] = None,
) -> pd.DataFrame:
    """Create an empty DataFrame with optional column specification.

    Useful for providing a safe fallback when no data is available, without
    breaking callers that expect a DataFrame with known columns.

    Parameters
    ----------
    columns : Sequence[str] or None
        Column names for the empty DataFrame.
    dtypes : dict[str, Any] or None
        Optional mapping of column name → dtype.  Applied after creation
        via ``.astype()``.

    Returns
    -------
    pd.DataFrame
        Empty DataFrame with zero rows.

    Examples
    --------
    >>> empty_dataframe(["A", "B"])
    Empty DataFrame
    Columns: [A, B]
    Index: []

    >>> empty_dataframe(["X"], dtypes={"X": "float64"})
    Empty DataFrame
    Columns: [X]
    Index: []
    """
    df = pd.DataFrame({col: pd.Series(dtype="object") for col in columns}) if columns else pd.DataFrame()

    if dtypes:
        df = df.astype(dtypes)

    return df


# ---------------------------------------------------------------------------
# Module-level ``__all__`` for explicit export control
# ---------------------------------------------------------------------------

__all__ = [
    "coerce_numeric_columns",
    "empty_dataframe",
    "normalize_column_names",
    "safe_dataframe_copy",
    "validate_required_columns",
]

