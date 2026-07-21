"""
AtmoSync AI - Schemas Package

This module provides Pydantic models/schemas for request/response
validation across the FastAPI application.

Schemas are organised by domain:
- analytics.py: Pipeline trigger & execution monitoring
- alerts.py: Shipment alert generation & filtering
- dashboard.py: Dashboard dataset & KPI responses
- recommendation.py: Recommendation engine I/O
- risk.py: Risk assessment & classification
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Domain-specific schema modules (new organisation).
# ---------------------------------------------------------------------------
from backend.schemas.analytics import (
    AnalyticsRunRequest,
    AnalyticsRunResponse,
    PipelineStepDetail,
    PipelineSummary,
)
from backend.schemas.alerts import (
    AlertItem,
    AlertListResponse,
    AlertQueryParams,
)
from backend.schemas.dashboard import (
    DashboardDataResponse,
    DashboardKPIEntry,
    DashboardOverview,
)
from backend.schemas.recommendation import (
    RecommendationItem,
    RecommendationListResponse,
    RecommendationRunRequest,
    RecommendationRunResponse,
)
from backend.schemas.risk import (
    RiskAssessmentDetail,
    RiskCategoryCount,
    RiskRunRequest,
    RiskRunResponse,
    RiskScoreDistribution,
    RiskSummary,
)

# ---------------------------------------------------------------------------
# Legacy models — kept inline for backward compatibility.
# These are used by existing API endpoints and should not be removed
# without coordinating a migration to the domain-specific schemas above.
# ---------------------------------------------------------------------------


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "ok"


class PipelineRunResponse(BaseModel):
    """Response for pipeline execution."""
    exit_code: int
    status: str


class AlertsResponse(BaseModel):
    """Individual alert entry."""
    alert_id: str
    severity: str
    message: str
    timestamp: str
    shipment_id: str


class ShipmentSummary(BaseModel):
    """Summary of a shipment."""
    shipment_id: str
    product_name: str
    origin_city: str
    destination_city: str
    risk_category: str
    risk_score: float
    temperature: float
    humidity: float
    delay_hours: float


class RecommendationResponse(BaseModel):
    """Recommendation output."""
    shipment_id: str
    recommendation: str
    severity: str
    immediate_action: bool


__all__ = [
    # New domain-specific schemas.
    "AlertItem",
    "AlertListResponse",
    "AlertQueryParams",
    "AnalyticsRunRequest",
    "AnalyticsRunResponse",
    "DashboardKPIEntry",
    "DashboardOverview",
    "PipelineStepDetail",
    "PipelineSummary",
    "RecommendationItem",
    "RecommendationListResponse",
    "RecommendationRunRequest",
    "RecommendationRunResponse",
    "RiskAssessmentDetail",
    "RiskCategoryCount",
    "RiskRunRequest",
    "RiskRunResponse",
    "RiskScoreDistribution",
    # Legacy schemas (backward-compatible).
    "AlertsResponse",
    "DashboardDataResponse",
    "HealthResponse",
    "PipelineRunResponse",
    "RecommendationResponse",
    "RiskSummary",
    "ShipmentSummary",
]

