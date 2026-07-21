"""
AtmoSync AI - Alert Schemas

Pydantic models for shipment alert request/response validation.

Alerts are derived from sensor excursion flags, risk categories,
and operational anomalies detected during pipeline processing.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class AlertItem(BaseModel):
    """A single shipment alert entry.

    Represents one actionable alert generated from an excursion flag,
    critical risk classification, or sensor anomaly.
    """

    alert_id: str = Field(
        ...,
        description="Unique alert identifier (e.g., 'ALT-TEMP-SHP001-0001').",
        examples=["ALT-TEMP-SHP00A1-0001"],
        min_length=1,
    )
    severity: str = Field(
        ...,
        description="Alert severity level: 'critical', 'high', 'medium', or 'low'.",
        examples=["high", "critical"],
    )
    label: str = Field(
        ...,
        description="Short human-readable alert label.",
        examples=["Temperature Excursion", "Battery Low"],
    )
    message: str = Field(
        ...,
        description="Descriptive alert message with recommended action.",
        examples=["Temperature excursion detected — immediate inspection required."],
    )
    timestamp: str = Field(
        ...,
        description="ISO 8601 timestamp of the alert event.",
        examples=["2025-01-15 14:30:00"],
    )
    shipment_id: str = Field(
        ...,
        description="Associated shipment identifier.",
        examples=["SHP00A1"],
        min_length=1,
    )


class AlertQueryParams(BaseModel):
    """Query parameters for filtering alerts.

    Used for validation when retrieving active alert lists.
    """

    limit: int = Field(
        default=100,
        description="Maximum number of alerts to return. Sorted by severity, then timestamp.",
        ge=1,
        le=1000,
        examples=[50, 100],
    )


class AlertListResponse(BaseModel):
    """Paginated response containing a list of active alerts.

    Maintains backward compatibility with the existing alert API contract.
    """

    success: bool = Field(
        ...,
        description="Indicates whether the request was processed successfully.",
    )
    message: str = Field(
        ...,
        description="Status message describing the result.",
        examples=["Found 12 active alert(s).", "No active alerts found."],
    )
    count: int = Field(
        ...,
        description="Number of alerts returned in this response.",
        ge=0,
        examples=[12, 0],
    )
    total_active: Optional[int] = Field(
        default=None,
        description="Total number of active alerts in the system (may exceed 'count').",
        ge=0,
        examples=[47],
    )
    alerts: list[AlertItem] = Field(
        default_factory=list,
        description="List of active alert items.",
    )

