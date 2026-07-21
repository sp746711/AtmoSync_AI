"""
AtmoSync AI - Analytics Schemas

Pydantic models for analytics pipeline request/response validation.

These schemas define the data contracts for triggering and monitoring
the full analytics pipeline execution.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class AnalyticsRunRequest(BaseModel):
    """Request body for triggering the analytics pipeline.

    Currently empty; reserved for future filtering or configuration
    parameters (e.g., pipeline mode, date range).
    """
    pass


class PipelineStepDetail(BaseModel):
    """Execution details of a single pipeline step.

    Captures timing, status, and error information for one stage
    of the analytics pipeline.
    """

    step_name: str = Field(
        ...,
        description="Human-readable name of the pipeline step.",
        examples=["data_cleaning", "risk_assessment"],
    )
    status: str = Field(
        ...,
        description="Execution outcome: 'Completed' or 'Failed'.",
        examples=["Completed", "Failed"],
    )
    start_time_utc: str = Field(
        ...,
        description="Step start timestamp in UTC (ISO 8601 format).",
        examples=["2025-01-15 08:30:00 UTC"],
    )
    end_time_utc: str = Field(
        ...,
        description="Step end timestamp in UTC (ISO 8601 format).",
        examples=["2025-01-15 08:32:15 UTC"],
    )
    execution_time_seconds: float = Field(
        ...,
        description="Wall-clock execution time of the step in seconds.",
        ge=0.0,
        examples=[135.42],
    )
    error_message: Optional[str] = Field(
        default=None,
        description="Error detail if the step failed; null otherwise.",
        examples=["Missing required column: 'Risk Category'"],
    )


class PipelineSummary(BaseModel):
    """Complete summary of an analytics pipeline execution.

    Aggregates step-level results into a high-level overview suitable
    for API responses, monitoring dashboards, and audit logs.
    """

    project: str = Field(
        ...,
        description="Project name identifier.",
        examples=["AtmoSync AI"],
    )
    version: str = Field(
        ...,
        description="Project version at time of execution.",
        examples=["1.2.0"],
    )
    overall_success: bool = Field(
        ...,
        description="True if all pipeline steps completed without failure.",
    )
    total_execution_time_seconds: float = Field(
        ...,
        description="Total wall-clock time for the entire pipeline in seconds.",
        ge=0.0,
        examples=[1245.87],
    )
    completed_steps: list[str] = Field(
        default_factory=list,
        description="Names of steps that completed successfully.",
        examples=[["data_cleaning", "risk_assessment", "recommendation_engine"]],
    )
    failed_steps: list[str] = Field(
        default_factory=list,
        description="Names of steps that failed (empty if all succeeded).",
        examples=[["export_data"]],
    )
    steps: list[PipelineStepDetail] = Field(
        default_factory=list,
        description="Ordered list of individual step execution details.",
    )


class AnalyticsRunResponse(BaseModel):
    """Response returned after triggering the analytics pipeline.

    Mirrors the existing API contract for backward compatibility
    while providing enriched step-level detail.
    """

    success: bool = Field(
        ...,
        description="Indicates whether the pipeline ran without errors.",
    )
    status: str = Field(
        ...,
        description="Human-readable pipeline status.",
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
        description="Pipeline execution summary message.",
        examples=["Analytics pipeline completed successfully."],
    )
    summary: Optional[PipelineSummary] = Field(
        default=None,
        description="Optional detailed execution summary with step-level breakdown.",
    )

