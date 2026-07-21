"""
AtmoSync AI - Risk Assessment Schemas

Pydantic models for risk assessment request/response validation.

Risk schemas support the computation and reporting of shipment-level
risk scores, category distributions, and operational risk indicators.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class RiskRunRequest(BaseModel):
    """Request body for triggering the risk assessment pipeline.

    Currently empty; reserved for future risk-scope configuration.
    """
    pass


class RiskRunResponse(BaseModel):
    """Response returned after risk assessment pipeline execution.

    Maintains backward compatibility with the existing API contract.
    """

    success: bool = Field(
        ...,
        description="Indicates whether the risk assessment ran without errors.",
    )
    status: str = Field(
        ...,
        description="Execution status: 'completed' or 'failed'.",
        examples=["completed", "failed"],
    )
    exit_code: int = Field(
        ...,
        description="Process exit code: 0 for success, non-zero for failure.",
        ge=0,
        examples=[0, 1],
    )
    message: str = Field(
        ...,
        description="Execution summary message.",
        examples=["Risk assessment completed successfully."],
    )


class RiskCategoryCount(BaseModel):
    """Count of shipments in a single risk category.

    Used to represent the distribution of shipments across
    risk tiers for dashboard breakdowns.
    """

    category: str = Field(
        ...,
        description="Risk category name.",
        examples=["Critical Risk", "High Risk", "Medium Risk", "Low Risk"],
    )
    count: int = Field(
        ...,
        description="Number of shipments in this risk category.",
        ge=0,
        examples=[5, 23, 120, 102],
    )
    percentage: Optional[float] = Field(
        default=None,
        description="Percentage of total shipments in this category (0–100).",
        ge=0.0,
        le=100.0,
        examples=[2.0, 9.2, 48.0, 40.8],
    )


class RiskScoreDistribution(BaseModel):
    """Statistics describing the distribution of risk scores."""

    minimum: float = Field(
        ...,
        description="Minimum risk score across all shipments.",
        ge=0.0,
        le=100.0,
        examples=[0.0],
    )
    maximum: float = Field(
        ...,
        description="Maximum risk score across all shipments.",
        ge=0.0,
        le=100.0,
        examples=[98.5],
    )
    average: float = Field(
        ...,
        description="Mean risk score across all shipments.",
        ge=0.0,
        le=100.0,
        examples=[32.4],
    )
    median: Optional[float] = Field(
        default=None,
        description="Median risk score across all shipments.",
        ge=0.0,
        le=100.0,
        examples=[28.0],
    )


class RiskSummary(BaseModel):
    """Aggregated risk summary for dashboard and reporting.

    Provides a high-level view of the overall risk posture
    across the tracked shipment portfolio.
    """

    total_shipments: int = Field(
        ...,
        description="Total number of shipments assessed.",
        ge=0,
        examples=[250],
    )
    critical_count: int = Field(
        ...,
        description="Number of shipments classified as Critical Risk.",
        ge=0,
        examples=[5],
    )
    high_count: int = Field(
        ...,
        description="Number of shipments classified as High Risk.",
        ge=0,
        examples=[18],
    )
    medium_count: int = Field(
        ...,
        description="Number of shipments classified as Medium Risk.",
        ge=0,
        examples=[95],
    )
    low_count: int = Field(
        ...,
        description="Number of shipments classified as Low Risk.",
        ge=0,
        examples=[132],
    )
    average_risk_score: float = Field(
        ...,
        description="Mean risk score across all shipments (0–100).",
        ge=0.0,
        le=100.0,
        examples=[32.4],
    )
    distribution: Optional[list[RiskCategoryCount]] = Field(
        default=None,
        description="Detailed breakdown of shipments by risk category with percentages.",
    )


class RiskAssessmentDetail(BaseModel):
    """Detailed risk breakdown for a single shipment.

    Provides per-shipment risk scores across all risk dimensions
    for downstream analysis and display.
    """

    shipment_id: str = Field(
        ...,
        description="Shipment identifier.",
        examples=["SHP00A1"],
        min_length=1,
    )
    overall_risk_score: float = Field(
        ...,
        description="Overall composite risk score (0–100).",
        ge=0.0,
        le=100.0,
        examples=[42.5],
    )
    risk_category: str = Field(
        ...,
        description="Assigned risk category.",
        examples=["Medium Risk"],
    )
    risk_priority: str = Field(
        ...,
        description="Risk priority level (P1–P4).",
        examples=["P3"],
    )
    temperature_risk_score: float = Field(
        ...,
        description="Temperature dimension risk score (0–100).",
        ge=0.0,
        le=100.0,
        examples=[35.0],
    )
    humidity_risk_score: float = Field(
        ...,
        description="Humidity dimension risk score (0–100).",
        ge=0.0,
        le=100.0,
        examples=[28.5],
    )
    battery_risk_score: float = Field(
        ...,
        description="Battery dimension risk score (0–100).",
        ge=0.0,
        le=100.0,
        examples=[10.0],
    )
    delay_risk_score: float = Field(
        ...,
        description="Delay dimension risk score (0–100).",
        ge=0.0,
        le=100.0,
        examples=[55.0],
    )

