"""
AtmoSync AI - Dashboard Schemas

Pydantic models for dashboard data request/response validation.

These schemas support the processed dataset used by the frontend
application and Power BI integration.
"""

from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class DashboardDataResponse(BaseModel):
    """Response containing the processed dashboard dataset.

    The dataset is returned as raw CSV text for direct ingestion
    by dashboards and reporting tools.
    """

    success: bool = Field(
        ...,
        description="Indicates whether the dashboard data was loaded successfully.",
    )
    message: str = Field(
        ...,
        description="Status message describing the result.",
        examples=["Dashboard dataset loaded successfully."],
    )
    csv: str = Field(
        ...,
        description="Complete dashboard dataset in CSV format with header row.",
        examples=["Shipment ID,Product Name,Origin City,...\nSHP00A1,Apple,New York,..."],
    )


class DashboardKPIEntry(BaseModel):
    """A single dashboard KPI entry.

    Represents one key performance indicator with its computed value
    and optional display metadata.
    """

    kpi: str = Field(
        ...,
        description="KPI name/identifier.",
        examples=["Total Shipments", "Average Risk Score", "Temperature Excursions"],
        min_length=1,
    )
    value: Any = Field(
        ...,
        description="KPI value. Type varies by metric (int, float, str).",
        examples=[150, 42.5, "SHP00A1"],
    )
    label: Optional[str] = Field(
        default=None,
        description="Optional display-friendly label for UI rendering.",
        examples=["Excellent", "Critical"],
    )
    severity: Optional[str] = Field(
        default=None,
        description="Optional severity indicator for color-coding.",
        examples=["low", "medium", "high", "critical"],
    )


class DashboardOverview(BaseModel):
    """High-level dashboard overview aggregating key metrics.

    Provides a summary snapshot of shipment health, risk distribution,
    and operational compliance for dashboard headers and summary cards.
    """

    total_shipments: int = Field(
        ...,
        description="Total number of unique shipments tracked.",
        ge=0,
        examples=[250],
    )
    average_risk_score: float = Field(
        ...,
        description="Mean risk score across all shipments (0–100).",
        ge=0.0,
        le=100.0,
        examples=[32.5],
    )
    critical_shipments: int = Field(
        ...,
        description="Number of shipments classified as Critical Risk.",
        ge=0,
        examples=[5],
    )
    temperature_excursions: int = Field(
        ...,
        description="Count of temperature excursion events detected.",
        ge=0,
        examples=[12],
    )
    humidity_excursions: int = Field(
        ...,
        description="Count of humidity excursion events detected.",
        ge=0,
        examples=[8],
    )
    battery_issues: int = Field(
        ...,
        description="Count of low-battery events detected.",
        ge=0,
        examples=[3],
    )
    delay_issues: int = Field(
        ...,
        description="Count of shipment delay events detected.",
        ge=0,
        examples=[7],
    )

