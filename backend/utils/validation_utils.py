"""AtmoSync AI — Validation Utility Helpers.

Generic, reusable validation functions used across the analytics pipeline
(primarily in scripts, services, and API endpoints).

Every function in this module is:

* Generic (no business rules, no project-specific thresholds from
  ``business_rules.py`` or ``config.py`` — those belong in the config layer)
* Purely functional (no side effects, no logging, no I/O)
* Fully type-hinted with complete docstrings
* Designed to raise ``ValueError`` with a clear explanation on failure
"""

from __future__ import annotations

import re
from typing import Union


# ---------------------------------------------------------------------------
# Numeric validators
# ---------------------------------------------------------------------------


def validate_percentage(value: Union[int, float]) -> float:
    """Validate and return a percentage value (0.0 – 100.0).

    Parameters
    ----------
    value : int or float
        The percentage value to validate.

    Returns
    -------
    float
        The input value cast to ``float`` (unchanged if valid).

    Raises
    ------
    ValueError
        If ``value`` is outside the [0.0, 100.0] range.
    """
    result = float(value)
    if result < 0.0 or result > 100.0:
        raise ValueError(
            f"Percentage must be between 0.0 and 100.0, got {result}."
        )
    return result


def validate_risk_score(value: Union[int, float]) -> float:
    """Validate and return a risk score (0.0 – 100.0).

    Risk scores are normalised to a 0–100 scale throughout the AtmoSync AI
    pipeline (see the ``Risk Score`` column in the dashboard dataset).

    Parameters
    ----------
    value : int or float
        The risk score to validate.

    Returns
    -------
    float
        The input value cast to ``float``.

    Raises
    ------
    ValueError
        If ``value`` is outside the [0.0, 100.0] range.
    """
    result = float(value)
    if result < 0.0 or result > 100.0:
        raise ValueError(
            f"Risk score must be between 0.0 and 100.0, got {result}."
        )
    return result


# ---------------------------------------------------------------------------
# Sensor / environmental validators
# ---------------------------------------------------------------------------


def validate_temperature(value: Union[int, float]) -> float:
    """Validate and return a temperature value in degrees Celsius.

    The allowed range (-25.0 °C to +15.0 °C) matches the global sensor
    range defined in ``backend.config.config.SENSOR_TEMPERATURE_RANGE``.
    This is a *hardware / sensor* limit, **not** a business rule.

    Parameters
    ----------
    value : int or float
        Temperature in degrees Celsius.

    Returns
    -------
    float
        The input value cast to ``float``.

    Raises
    ------
    ValueError
        If ``value`` is outside the sensor's measurable range
        [-25.0, 15.0] °C.
    """
    result = float(value)
    if result < -25.0 or result > 15.0:
        raise ValueError(
            f"Temperature must be between -25.0 °C and 15.0 °C, got {result}."
        )
    return result


def validate_humidity(value: Union[int, float]) -> float:
    """Validate and return a relative-humidity percentage (0.0 – 100.0).

    This is a pure range check.  Business-specific safe / warning /
    critical thresholding belongs in ``backend.config.business_rules``.

    Parameters
    ----------
    value : int or float
        Relative humidity in percent.

    Returns
    -------
    float
        The input value cast to ``float``.

    Raises
    ------
    ValueError
        If ``value`` is outside the [0.0, 100.0] range.
    """
    result = float(value)
    if result < 0.0 or result > 100.0:
        raise ValueError(
            f"Humidity must be between 0.0% and 100.0%, got {result}."
        )
    return result


# ---------------------------------------------------------------------------
# String / identifier validators
# ---------------------------------------------------------------------------


# Pattern used by validate_shipment_id.
_SHIPMENT_ID_PATTERN: re.Pattern[str] = re.compile(r"^[A-Za-z0-9_-]+$")


def validate_shipment_id(value: str) -> str:
    """Validate and return a shipment identifier.

    A valid shipment ID is a non-empty string that contains only
    alphanumeric characters, underscores (``_``), and hyphens (``-``).

    Parameters
    ----------
    value : str
        The shipment ID to validate.

    Returns
    -------
    str
        The input string, stripped of leading/trailing whitespace.

    Raises
    ------
    ValueError
        If ``value`` is empty, contains only whitespace, or contains
        characters outside ``[A-Za-z0-9_-]``.
    """
    if not isinstance(value, str):
        raise ValueError(
            f"Shipment ID must be a string, got {type(value).__name__}."
        )

    stripped = value.strip()
    if not stripped:
        raise ValueError("Shipment ID must not be empty.")

    if not _SHIPMENT_ID_PATTERN.match(stripped):
        raise ValueError(
            f"Shipment ID '{stripped}' contains invalid characters. "
            "Only letters, digits, underscores, and hyphens are allowed."
        )
    return stripped


def validate_non_empty_string(value: str, *, name: str = "value") -> str:
    """Validate and return a non-empty, stripped string.

    This is a general-purpose validator for any required text field
    (e.g. product names, city names, vehicle types).

    Parameters
    ----------
    value : str
        The string to validate.
    name : str
        Human-readable name for the field (used in error messages).
        Defaults to ``"value"``.

    Returns
    -------
    str
        The input string, stripped of leading/trailing whitespace.

    Raises
    ------
    ValueError
        If ``value`` is not a string, is empty, or contains only whitespace.
    """
    if not isinstance(value, str):
        raise ValueError(
            f"{name} must be a string, got {type(value).__name__}."
        )

    stripped = value.strip()
    if not stripped:
        raise ValueError(f"{name} must not be empty or whitespace-only.")

    return stripped


# ---------------------------------------------------------------------------
# Module-level ``__all__`` for explicit export control
# ---------------------------------------------------------------------------

__all__ = [
    "validate_humidity",
    "validate_non_empty_string",
    "validate_percentage",
    "validate_risk_score",
    "validate_shipment_id",
    "validate_temperature",
]

