"""
AtmoSync AI - Recommendation Schemas

Pydantic models for recommendation engine request/response validation.

Recommendations are generated from risk assessment outputs and
operational signals to guide corrective actions.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class RecommendationRunRequest(BaseModel):
    """Request body for triggering the recommendation engine.

    Currently empty; reserved for future filtering or configuration
    parameters (e.g., recommendation scope, shipment filters).
    """
    pass


class RecommendationRunResponse(BaseModel):
    """Response returned after the recommendation engine execution.

    Maintains backward compatibility with the existing API contract.
    """

    success: bool = Field(
        ...,
        description="Indicates whether the recommendation engine ran without errors.",
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
        examples=["Recommendation pipeline completed successfully."],
    )


class RecommendationItem(BaseModel):
    """A single recommendation entry for a shipment.

    Captures the generated recommendation text, severity level,
    category classification, and actionability flag.
    """

    shipment_id: str = Field(
        ...,
        description="Associated shipment identifier.",
        examples=["SHP00A1"],
        min_length=1,
    )
    recommendation: str = Field(
        ...,
        description="Generated recommendation text or action instruction.",
        examples=[
            "Inspect refrigeration equipment immediately. "
            "Move products to a safe temperature-controlled environment."
        ],
    )
    severity: str = Field(
        ...,
        description="Recommendation severity: 'high', 'medium', or 'low'.",
        examples=["high", "medium"],
    )
    immediate_action: bool = Field(
        ...,
        description="Whether the recommendation requires immediate action.",
        examples=[True, False],
    )
    category: Optional[str] = Field(
        default=None,
        description="Recommendation category (e.g., 'Temperature Issue', 'Battery Low').",
        examples=["Temperature Issue", "Shipment Delay"],
    )


class RecommendationListResponse(BaseModel):
    """Response containing a list of generated recommendations."""

    success: bool = Field(
        ...,
        description="Indicates whether the request was processed successfully.",
    )
    message: str = Field(
        ...,
        description="Status message describing the result.",
        examples=["Found 12 recommendations.", "No recommendations generated."],
    )
    count: int = Field(
        ...,
        description="Number of recommendations returned.",
        ge=0,
        examples=[12],
    )
    recommendations: list[RecommendationItem] = Field(
        default_factory=list,
        description="List of recommendation items.",
    )

