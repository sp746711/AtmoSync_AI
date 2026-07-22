"""Tests for all utility modules.

Covers:
- ``validation_utils``: 6 validator functions with valid/invalid/boundary cases
- ``file_utils``: CSV I/O, directory/path helpers
- ``dataframe_utils``: DataFrame coercion, validation, normalization, factory
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd
import pytest

from backend.utils.validation_utils import (
    validate_percentage,
    validate_risk_score,
    validate_temperature,
    validate_humidity,
    validate_shipment_id,
    validate_non_empty_string,
)
from backend.utils.file_utils import (
    ensure_directory,
    file_exists,
    resolve_project_path,
    safe_read_csv,
    safe_write_csv,
)
from backend.utils.dataframe_utils import (
    coerce_numeric_columns,
    empty_dataframe,
    normalize_column_names,
    safe_dataframe_copy,
    validate_required_columns,
)


# ===========================================================================
# Validation Utils
# ===========================================================================

class TestValidatePercentage:
    """``validate_percentage`` — 0.0 to 100.0 range check."""

    def test_valid_percentage(self) -> None:
        """Valid percentages return the value as float."""
        assert validate_percentage(0.0) == 0.0
        assert validate_percentage(50.0) == 50.0
        assert validate_percentage(100.0) == 100.0

    def test_valid_int_converted_to_float(self) -> None:
        """Integer inputs are converted to float."""
        assert validate_percentage(42) == 42.0
        assert isinstance(validate_percentage(42), float)

    def test_below_zero_raises(self) -> None:
        """Negative percentage raises ValueError."""
        with pytest.raises(ValueError, match="Percentage must be between"):
            validate_percentage(-0.1)

    def test_above_hundred_raises(self) -> None:
        """Percentage > 100 raises ValueError."""
        with pytest.raises(ValueError, match="Percentage must be between"):
            validate_percentage(100.1)

    def test_edge_min(self) -> None:
        """0.0 is valid (boundary)."""
        assert validate_percentage(0.0) == 0.0

    def test_edge_max(self) -> None:
        """100.0 is valid (boundary)."""
        assert validate_percentage(100.0) == 100.0


class TestValidateRiskScore:
    """``validate_risk_score`` — 0.0 to 100.0 range check."""

    def test_valid_scores(self) -> None:
        """Valid risk scores return the value as float."""
        assert validate_risk_score(0.0) == 0.0
        assert validate_risk_score(50.0) == 50.0
        assert validate_risk_score(100.0) == 100.0

    def test_below_zero_raises(self) -> None:
        """Negative risk score raises ValueError."""
        with pytest.raises(ValueError, match="Risk score must be between"):
            validate_risk_score(-1.0)

    def test_above_hundred_raises(self) -> None:
        """Risk score > 100 raises ValueError."""
        with pytest.raises(ValueError, match="Risk score must be between"):
            validate_risk_score(101.0)


class TestValidateTemperature:
    """``validate_temperature`` — -25.0 to +15.0 C sensor range."""

    def test_valid_temperatures(self) -> None:
        """Valid temperatures return the value as float."""
        assert validate_temperature(0.0) == 0.0
        assert validate_temperature(-25.0) == -25.0
        assert validate_temperature(15.0) == 15.0

    def test_below_min_raises(self) -> None:
        """Temperature < -25 C raises ValueError."""
        with pytest.raises(ValueError, match="Temperature must be between"):
            validate_temperature(-25.1)

    def test_above_max_raises(self) -> None:
        """Temperature > 15 C raises ValueError."""
        with pytest.raises(ValueError, match="Temperature must be between"):
            validate_temperature(15.1)

    def test_edge_min(self) -> None:
        """-25.0 is valid (boundary)."""
        assert validate_temperature(-25.0) == -25.0

    def test_edge_max(self) -> None:
        """15.0 is valid (boundary)."""
        assert validate_temperature(15.0) == 15.0


class TestValidateHumidity:
    """``validate_humidity`` — 0.0% to 100.0% range check."""

    def test_valid_humidity(self) -> None:
        """Valid humidity values return the value as float."""
        assert validate_humidity(0.0) == 0.0
        assert validate_humidity(50.0) == 50.0
        assert validate_humidity(100.0) == 100.0

    def test_below_zero_raises(self) -> None:
        """Humidity < 0% raises ValueError."""
        with pytest.raises(ValueError, match="Humidity must be between"):
            validate_humidity(-0.01)

    def test_above_hundred_raises(self) -> None:
        """Humidity > 100% raises ValueError."""
        with pytest.raises(ValueError, match="Humidity must be between"):
            validate_humidity(100.01)


class TestValidateShipmentId:
    """``validate_shipment_id`` — alphanumeric, underscore, hyphen."""

    def test_valid_ids(self) -> None:
        """Valid shipment IDs pass through."""
        assert validate_shipment_id("SHP001") == "SHP001"
        assert validate_shipment_id("shp-001_ABC") == "shp-001_ABC"
        assert validate_shipment_id("abc123") == "abc123"

    def test_strips_whitespace(self) -> None:
        """Leading/trailing whitespace is stripped."""
        assert validate_shipment_id("  SHP001  ") == "SHP001"

    def test_empty_string_raises(self) -> None:
        """Empty string raises ValueError."""
        with pytest.raises(ValueError, match="must not be empty"):
            validate_shipment_id("")

    def test_whitespace_only_raises(self) -> None:
        """Whitespace-only string raises ValueError."""
        with pytest.raises(ValueError, match="must not be empty"):
            validate_shipment_id("   ")

    def test_invalid_characters_raises(self) -> None:
        """Special characters (e.g. @, #, $) raise ValueError."""
        with pytest.raises(ValueError, match="invalid characters"):
            validate_shipment_id("SHP@001")

    def test_non_string_raises(self) -> None:
        """Non-string input raises ValueError."""
        with pytest.raises(ValueError, match="must be a string"):
            validate_shipment_id(12345)  # type: ignore[arg-type]


class TestValidateNonEmptyString:
    """``validate_non_empty_string`` — generic text validator."""

    def test_valid_string(self) -> None:
        """Non-empty string returns stripped value."""
        assert validate_non_empty_string("hello") == "hello"

    def test_strips_whitespace(self) -> None:
        """Leading/trailing whitespace is stripped."""
        assert validate_non_empty_string("  hello  ") == "hello"

    def test_empty_raises(self) -> None:
        """Empty string raises ValueError."""
        with pytest.raises(ValueError, match="must not be empty"):
            validate_non_empty_string("")

    def test_whitespace_only_raises(self) -> None:
        """Whitespace-only string raises ValueError."""
        with pytest.raises(ValueError, match="must not be empty"):
            validate_non_empty_string("   ")

    def test_non_string_raises(self) -> None:
        """Non-string input raises ValueError."""
        with pytest.raises(ValueError, match="must be a string"):
            validate_non_empty_string(42)  # type: ignore[arg-type]

    def test_custom_name_in_error(self) -> None:
        """The name parameter appears in the error message."""
        with pytest.raises(ValueError, match="product name"):
            validate_non_empty_string("", name="product name")


# ===========================================================================
# File Utils
# ===========================================================================

class TestEnsureDirectory:
    """``ensure_directory`` — directory creation."""

    def test_creates_new_directory(self, tmp_path: Path) -> None:
        """Creates a new directory."""
        target = tmp_path / "new_dir"
        result = ensure_directory(target)
        assert target.is_dir()
        assert result == target

    def test_creates_nested(self, tmp_path: Path) -> None:
        """Creates nested directories."""
        target = tmp_path / "a" / "b" / "c"
        result = ensure_directory(target)
        assert result.is_dir()

    def test_existing_directory_idempotent(self, tmp_path: Path) -> None:
        """Existing directory does not raise."""
        target = tmp_path / "existing"
        target.mkdir()
        ensure_directory(target)  # should not raise


class TestFileExists:
    """``file_exists`` — file existence check."""

    def test_existing_file(self, tmp_path: Path) -> None:
        """Returns True for existing file."""
        f = tmp_path / "test.txt"
        f.write_text("hello")
        assert file_exists(f) is True

    def test_nonexistent_file(self, tmp_path: Path) -> None:
        """Returns False for non-existent file."""
        assert file_exists(tmp_path / "nonexistent.txt") is False

    def test_directory_returns_false(self, tmp_path: Path) -> None:
        """Returns False for directories."""
        assert file_exists(tmp_path) is False


class TestResolveProjectPath:
    """``resolve_project_path`` — path anchored at project root."""

    def test_resolves_to_absolute(self) -> None:
        """Returns an absolute path."""
        result = resolve_project_path("data", "raw")
        assert isinstance(result, Path)
        assert result.is_absolute()

    def test_contains_project_structure(self) -> None:
        """Result contains 'data/raw' at the end."""
        result = resolve_project_path("data", "raw")
        assert result.name == "raw"
        assert result.parent.name == "data"

    def test_single_part(self) -> None:
        """Works with a single path segment."""
        result = resolve_project_path("tests")
        assert result.name == "tests"


class TestSafeReadCsv:
    """``safe_read_csv`` — robust CSV reading."""

    def test_reads_valid_csv(self, tmp_path: Path) -> None:
        """Reads a valid CSV file and returns a DataFrame."""
        csv_path = tmp_path / "test.csv"
        csv_path.write_text("a,b\n1,2\n3,4\n", encoding="utf-8")
        df = safe_read_csv(csv_path)
        assert len(df) == 2
        assert list(df.columns) == ["a", "b"]

    def test_file_not_found_raises(self, tmp_path: Path) -> None:
        """Non-existent file raises FileNotFoundError."""
        with pytest.raises(FileNotFoundError, match="CSV file not found"):
            safe_read_csv(tmp_path / "nonexistent.csv")

    def test_empty_csv_raises_exception(self, tmp_path: Path) -> None:
        """Empty CSV file raises an error."""
        csv_path = tmp_path / "empty.csv"
        csv_path.write_text("", encoding="utf-8")
        with pytest.raises(Exception):
            safe_read_csv(csv_path)

    def test_nonexistent_file_in_non_existent_dir(self, tmp_path: Path) -> None:
        """File in non-existent directory raises FileNotFoundError."""
        with pytest.raises(FileNotFoundError):
            safe_read_csv(tmp_path / "nosuchdir" / "data.csv")


class TestSafeWriteCsv:
    """``safe_write_csv`` — robust CSV writing."""

    def test_writes_dataframe(self, tmp_path: Path) -> None:
        """Writes a DataFrame to CSV and returns the path."""
        df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
        dest = tmp_path / "output.csv"
        result = safe_write_csv(df, dest)
        assert result == dest.resolve()
        assert dest.exists()
        content = dest.read_text(encoding="utf-8")
        assert "a,b" in content
        assert "1,3" in content

    def test_creates_parent_directories(self, tmp_path: Path) -> None:
        """Creates parent directories when they don't exist."""
        df = pd.DataFrame({"x": [1]})
        dest = tmp_path / "a" / "b" / "deep.csv"
        result = safe_write_csv(df, dest)
        assert result.exists()

    def test_writes_without_index_by_default(self, tmp_path: Path) -> None:
        """By default, the index is not written."""
        df = pd.DataFrame({"val": [10, 20]}, index=[99, 100])
        dest = tmp_path / "no_index.csv"
        safe_write_csv(df, dest)
        content = dest.read_text(encoding="utf-8")
        # Index values should not appear in the CSV
        assert "99" not in content.splitlines()[1]


# ===========================================================================
# DataFrame Utils
# ===========================================================================

class TestCoerceNumericColumns:
    """``coerce_numeric_columns`` — column type coercion."""

    def test_coerces_to_numeric(self) -> None:
        """String numeric values are coerced to numeric type."""
        df = pd.DataFrame({"a": ["1", "2", "3"], "b": ["x", "y", "z"]})
        result = coerce_numeric_columns(df, ["a"])
        assert pd.api.types.is_numeric_dtype(result["a"])
        assert result["a"].iloc[0] == 1

    def test_missing_column_is_ignored(self) -> None:
        """Missing columns are silently ignored."""
        df = pd.DataFrame({"a": [1, 2]})
        result = coerce_numeric_columns(df, ["nonexistent"])
        assert list(result.columns) == ["a"]

    def test_does_not_modify_input(self) -> None:
        """Input DataFrame is not modified."""
        df = pd.DataFrame({"a": ["1", "2"]})
        original = df.copy()
        coerce_numeric_columns(df, ["a"])
        pd.testing.assert_frame_equal(df, original)

    def test_returns_copy(self) -> None:
        """Returns a copy, not the original."""
        df = pd.DataFrame({"a": [1, 2]})
        result = coerce_numeric_columns(df, ["a"])
        assert result is not df


class TestValidateRequiredColumns:
    """``validate_required_columns`` — column existence check."""

    def test_all_columns_present(self) -> None:
        """No error when all columns exist."""
        df = pd.DataFrame({"a": [1], "b": [2], "c": [3]})
        validate_required_columns(df, ["a", "b"])  # should not raise

    def test_missing_column_raises(self) -> None:
        """Missing column raises ValueError."""
        df = pd.DataFrame({"a": [1]})
        with pytest.raises(ValueError, match="Missing required columns"):
            validate_required_columns(df, ["a", "b"])

    def test_multiple_missing_in_error(self) -> None:
        """Error message lists all missing columns."""
        df = pd.DataFrame({"a": [1]})
        with pytest.raises(ValueError) as excinfo:
            validate_required_columns(df, ["a", "b", "c"])
        assert "b" in str(excinfo.value)
        assert "c" in str(excinfo.value)


class TestNormalizeColumnNames:
    """``normalize_column_names`` — Title Case standardization."""

    def test_snake_case_to_title(self) -> None:
        """snake_case converted to Title Case."""
        df = pd.DataFrame({"shipment_id": [1]})
        result = normalize_column_names(df)
        assert "Shipment Id" in result.columns
        assert "shipment_id" not in result.columns

    def test_already_title_case_unchanged(self) -> None:
        """Single-word Title Case columns remain unchanged."""
        df = pd.DataFrame({"Temperature": [1]})
        result = normalize_column_names(df)
        assert "Temperature" in result.columns

    def test_does_not_modify_input(self) -> None:
        """Input DataFrame is not modified."""
        df = pd.DataFrame({"shipment_id": [1]})
        original = df.copy()
        normalize_column_names(df)
        pd.testing.assert_frame_equal(df, original)

    def test_returns_copy(self) -> None:
        """Returns a copy, not the original."""
        df = pd.DataFrame({"a": [1]})
        result = normalize_column_names(df)
        assert result is not df


class TestSafeDataframeCopy:
    """``safe_dataframe_copy`` — explicit copy helper."""

    def test_returns_copy(self) -> None:
        """Returns a copy of the input DataFrame."""
        df = pd.DataFrame({"a": [1, 2, 3]})
        result = safe_dataframe_copy(df)
        assert result is not df
        pd.testing.assert_frame_equal(result, df)

    def test_modifying_copy_does_not_affect_original(self) -> None:
        """Copy is independent from the original."""
        df = pd.DataFrame({"a": [1, 2, 3]})
        result = safe_dataframe_copy(df)
        result["a"] = [10, 20, 30]
        assert df["a"].iloc[0] == 1


class TestEmptyDataframe:
    """``empty_dataframe`` — factory for empty DataFrames."""

    def test_no_columns_returns_empty(self) -> None:
        """No arguments returns an empty DataFrame."""
        df = empty_dataframe()
        assert df.empty
        assert len(df.columns) == 0

    def test_with_columns(self) -> None:
        """Specified columns are present in the empty DataFrame."""
        df = empty_dataframe(["a", "b"])
        assert df.empty
        assert list(df.columns) == ["a", "b"]
        assert len(df) == 0

    def test_with_dtypes(self) -> None:
        """dtype mapping is applied to columns."""
        df = empty_dataframe(["x"], dtypes={"x": "float64"})
        assert df["x"].dtype == "float64"
