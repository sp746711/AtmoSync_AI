"""Tests for all Pydantic schema modules.

Verifies that request/response schemas validate inputs correctly
and reject invalid data.

Covers:
- backend.schemas.alerts
- backend.schemas.analytics
- backend.schemas.dashboard
- backend.schemas.recommendation
- backend.schemas.risk
"""

from __future__ import annotations

from typing import Any

import pytest
from pydantic import ValidationError

from backend.schemas.alerts import AlertItem, AlertQueryParams, AlertListResponse
from backend.schemas.analytics import (
    AnalyticsRunResponse,
    PipelineStepDetail,
    PipelineSummary,
)
from backend.schemas.dashboard import (
    DashboardDataResponse,
    DashboardKPIEntry,
    DashboardOverview,
)
from backend.schemas.recommendation import (
    RecommendationItem,
    RecommendationRunResponse,
    RecommendationListResponse,
)
from backend.schemas.risk import (
    RiskRunResponse,
    RiskCategoryCount,
    RiskScoreDistribution,
    RiskSummary,
    RiskAssessmentDetail,
)


# ===========================================================================
# Alert Schemas
# ===========================================================================

class TestAlertItem:
    """AlertItem schema validation."""

    def test_valid_alert_item(self) -> None:
        """Create a valid AlertItem with all required fields."""
        item = AlertItem(
            alert_id="ALT-TEMP-SHP00A1-0001",
            severity="high",
            label="Temperature Excursion",
            message="Temperature excursion detected.",
            timestamp="2025-01-15 14:30:00",
            shipment_id="SHP00A1",
        )
        assert item.alert_id == "ALT-TEMP-SHP00A1-0001"
        assert item.severity == "high"
        assert item.shipment_id == "SHP00A1"

    def test_missing_required_fields_raises(self) -> None:
        """Missing required fields trigger ValidationError."""
        with pytest.raises(ValidationError):
            AlertItem()  # type: ignore[call-arg]

    def test_invalid_severity(self) -> None:
        """Severity accepts any string (no enum restriction)."""
        item = AlertItem(
            alert_id="ALT-001",
            severity="unknown",
            label="Test",
            message="Test",
            timestamp="2025-01-01 00:00:00",
            shipment_id="SHP001",
        )
        assert item.severity == "unknown"

    def test_empty_alert_id_raises(self) -> None:
        """Empty alert_id (min_length=1) triggers ValidationError."""
        with pytest.raises(ValidationError):
            AlertItem(
                alert_id="",
                severity="high",
                label="Test",
                message="Test",
                timestamp="2025-01-01",
                shipment_id="SHP001",
            )

    def test_empty_shipment_id_raises(self) -> None:
        """Empty shipment_id (min_length=1) triggers ValidationError."""
        with pytest.raises(ValidationError):
            AlertItem(
                alert_id="ALT-001",
                severity="high",
                label="Test",
                message="Test",
                timestamp="2025-01-01",
                shipment_id="",
            )


class TestAlertQueryParams:
    """AlertQueryParams schema validation."""

    def test_default_limit(self) -> None:
        """Default limit is 100."""
        params = AlertQueryParams()
        assert params.limit == 100

    def test_valid_limit(self) -> None:
        """Valid limit values from 1 to 1000."""
        params = AlertQueryParams(limit=50)
        assert params.limit == 50
        params = AlertQueryParams(limit=1)
        assert params.limit == 1
        params = AlertQueryParams(limit=1000)
        assert params.limit == 1000

    def test_limit_below_minimum_raises(self) -> None:
        """Limit < 1 triggers ValidationError (ge=1)."""
        with pytest.raises(ValidationError):
            AlertQueryParams(limit=0)

    def test_limit_above_maximum_raises(self) -> None:
        """Limit > 1000 triggers ValidationError (le=1000)."""
        with pytest.raises(ValidationError):
            AlertQueryParams(limit=1001)


class TestAlertListResponse:
    """AlertListResponse schema validation."""

    def test_valid_response(self) -> None:
        """Create a valid AlertListResponse."""
        response = AlertListResponse(
            success=True,
            message="Found 2 active alert(s).",
            count=2,
            total_active=5,
            alerts=[
                AlertItem(
                    alert_id="ALT-001",
                    severity="high",
                    label="Temp",
                    message="Test",
                    timestamp="2025-01-01",
                    shipment_id="SHP001",
                ),
            ],
        )
        assert response.success is True
        assert response.count == 2
        assert response.total_active == 5
        assert len(response.alerts) == 1

    def test_empty_alerts(self) -> None:
        """No alerts is valid with count=0."""
        response = AlertListResponse(
            success=True,
            message="No active alerts.",
            count=0,
            alerts=[],
        )
        assert response.count == 0
        assert response.alerts == []

    def test_optional_total_active(self) -> None:
        """total_active is optional."""
        response = AlertListResponse(
            success=True,
            message="OK",
            count=0,
            alerts=[],
        )
        assert response.total_active is None


# ===========================================================================
# Dashboard Schemas
# ===========================================================================

class TestDashboardDataResponse:
    """DashboardDataResponse schema validation."""

    def test_valid_response(self) -> None:
        """Create a valid DashboardDataResponse."""
        response = DashboardDataResponse(
            success=True,
            message="Dashboard dataset loaded successfully.",
            csv="col1,col2\n1,2\n",
        )
        assert response.success is True
        assert "col1" in response.csv

    def test_csv_missing_raises(self) -> None:
        """Missing csv field triggers ValidationError."""
        with pytest.raises(ValidationError):
            DashboardDataResponse(success=True, message="Missing data")  # type: ignore[call-arg]


class TestDashboardKPIEntry:
    """DashboardKPIEntry schema validation."""

    def test_string_value(self) -> None:
        """KPI value can be a string."""
        entry = DashboardKPIEntry(kpi="Top Product", value="Milk")
        assert entry.kpi == "Top Product"
        assert entry.value == "Milk"

    def test_numeric_value(self) -> None:
        """KPI value can be an int."""
        entry = DashboardKPIEntry(kpi="Total Shipments", value=150)
        assert entry.value == 150

    def test_float_value(self) -> None:
        """KPI value can be a float."""
        entry = DashboardKPIEntry(kpi="Average Risk Score", value=32.5)
        assert entry.value == 32.5

    def test_optional_label(self) -> None:
        """Label and severity are optional."""
        entry = DashboardKPIEntry(kpi="Total Shipments", value=100)
        assert entry.label is None
        assert entry.severity is None

    def test_with_optional_fields(self) -> None:
        """Optional fields can be provided."""
        entry = DashboardKPIEntry(
            kpi="Avg Risk Score",
            value=42.5,
            label="Medium",
            severity="medium",
        )
        assert entry.label == "Medium"
        assert entry.severity == "medium"


class TestDashboardOverview:
    """DashboardOverview schema validation."""

    def test_valid_overview(self) -> None:
        """Create a valid DashboardOverview."""
        overview = DashboardOverview(
            total_shipments=250,
            average_risk_score=32.5,
            critical_shipments=5,
            temperature_excursions=12,
            humidity_excursions=8,
            battery_issues=3,
            delay_issues=7,
        )
        assert overview.total_shipments == 250
        assert overview.average_risk_score == 32.5
        assert overview.critical_shipments == 5

    def test_negative_values_raise(self) -> None:
        """Negative values for ge=0 fields trigger ValidationError."""
        with pytest.raises(ValidationError):
            DashboardOverview(
                total_shipments=-1,
                average_risk_score=0.0,
                critical_shipments=0,
                temperature_excursions=0,
                humidity_excursions=0,
                battery_issues=0,
                delay_issues=0,
            )

    def test_risk_score_out_of_range_raises(self) -> None:
        """average_risk_score > 100 triggers ValidationError."""
        with pytest.raises(ValidationError):
            DashboardOverview(
                total_shipments=1,
                average_risk_score=150.0,
                critical_shipments=0,
                temperature_excursions=0,
                humidity_excursions=0,
                battery_issues=0,
                delay_issues=0,
            )


# ===========================================================================
# Recommendation Schemas
# ===========================================================================

class TestRecommendationItem:
    """RecommendationItem schema validation."""

    def test_valid_item(self) -> None:
        """Create a valid RecommendationItem."""
        item = RecommendationItem(
            shipment_id="SHP001",
            recommendation="Inspect equipment.",
            severity="high",
            immediate_action=True,
            category="Temperature Issue",
        )
        assert item.shipment_id == "SHP001"
        assert item.severity == "high"
        assert item.immediate_action is True
        assert item.category == "Temperature Issue"

    def test_optional_category(self) -> None:
        """category is optional."""
        item = RecommendationItem(
            shipment_id="SHP001",
            recommendation="Monitor.",
            severity="low",
            immediate_action=False,
        )
        assert item.category is None

    def test_empty_shipment_id_raises(self) -> None:
        """Empty shipment_id (min_length=1) triggers ValidationError."""
        with pytest.raises(ValidationError):
            RecommendationItem(
                shipment_id="",
                recommendation="Test",
                severity="low",
                immediate_action=False,
            )


class TestRecommendationRunResponse:
    """RecommendationRunResponse schema validation."""

    def test_valid_response(self) -> None:
        """Create a valid RecommendationRunResponse."""
        response = RecommendationRunResponse(
            success=True,
            status="completed",
            exit_code=0,
            message="Completed successfully.",
        )
        assert response.success is True
        assert response.exit_code == 0

    def test_negative_exit_code_raises(self) -> None:
        """Negative exit_code triggers ValidationError (ge=0)."""
        with pytest.raises(ValidationError):
            RecommendationRunResponse(
                success=False,
                status="failed",
                exit_code=-1,
                message="Failed.",
            )


class TestRecommendationListResponse:
    """RecommendationListResponse schema validation."""

    def test_valid_response(self) -> None:
        """Create a valid RecommendationListResponse."""
        response = RecommendationListResponse(
            success=True,
            message="Found 1 recommendation.",
            count=1,
            recommendations=[
                RecommendationItem(
                    shipment_id="SHP001",
                    recommendation="Test",
                    severity="low",
                    immediate_action=False,
                ),
            ],
        )
        assert response.success is True
        assert response.count == 1

    def test_empty_recommendations(self) -> None:
        """Empty recommendations list is valid."""
        response = RecommendationListResponse(
            success=True,
            message="No recommendations.",
            count=0,
            recommendations=[],
        )
        assert response.count == 0
        assert response.recommendations == []


# ===========================================================================
# Risk Schemas
# ===========================================================================

class TestRiskRunResponse:
    """RiskRunResponse schema validation."""

    def test_valid_response(self) -> None:
        """Create a valid RiskRunResponse."""
        response = RiskRunResponse(
            success=True,
            status="completed",
            exit_code=0,
            message="Risk assessment completed.",
        )
        assert response.success is True
        assert response.exit_code == 0


class TestRiskCategoryCount:
    """RiskCategoryCount schema validation."""

    def test_valid(self) -> None:
        """Create a valid RiskCategoryCount."""
        item = RiskCategoryCount(
            category="Critical Risk",
            count=5,
            percentage=2.0,
        )
        assert item.category == "Critical Risk"
        assert item.count == 5
        assert item.percentage == 2.0

    def test_negative_count_raises(self) -> None:
        """Negative count triggers ValidationError."""
        with pytest.raises(ValidationError):
            RiskCategoryCount(category="Low Risk", count=-1)

    def test_percentage_out_of_range_raises(self) -> None:
        """Percentage > 100 triggers ValidationError."""
        with pytest.raises(ValidationError):
            RiskCategoryCount(category="Low Risk", count=1, percentage=150.0)


class TestRiskScoreDistribution:
    """RiskScoreDistribution schema validation."""

    def test_valid(self) -> None:
        """Create a valid RiskScoreDistribution."""
        dist = RiskScoreDistribution(
            minimum=0.0,
            maximum=98.5,
            average=32.4,
            median=28.0,
        )
        assert dist.minimum == 0.0
        assert dist.maximum == 98.5
        assert dist.median == 28.0

    def test_optional_median(self) -> None:
        """Median is optional."""
        dist = RiskScoreDistribution(
            minimum=0.0,
            maximum=100.0,
            average=50.0,
        )
        assert dist.median is None


class TestRiskSummary:
    """RiskSummary schema validation."""

    def test_valid(self) -> None:
        """Create a valid RiskSummary."""
        summary = RiskSummary(
            total_shipments=250,
            critical_count=5,
            high_count=18,
            medium_count=95,
            low_count=132,
            average_risk_score=32.4,
        )
        assert summary.total_shipments == 250
        assert summary.critical_count == 5

    def test_with_distribution(self) -> None:
        """RiskSummary can include distribution."""
        summary = RiskSummary(
            total_shipments=100,
            critical_count=2,
            high_count=8,
            medium_count=40,
            low_count=50,
            average_risk_score=25.0,
            distribution=[
                RiskCategoryCount(category="Low Risk", count=50, percentage=50.0),
                RiskCategoryCount(category="Critical Risk", count=2, percentage=2.0),
            ],
        )
        assert summary.distribution is not None
        assert len(summary.distribution) == 2


class TestRiskAssessmentDetail:
    """RiskAssessmentDetail schema validation."""

    def test_valid(self) -> None:
        """Create a valid RiskAssessmentDetail."""
        detail = RiskAssessmentDetail(
            shipment_id="SHP001",
            overall_risk_score=42.5,
            risk_category="Medium Risk",
            risk_priority="P3",
            temperature_risk_score=35.0,
            humidity_risk_score=28.5,
            battery_risk_score=10.0,
            delay_risk_score=55.0,
        )
        assert detail.shipment_id == "SHP001"
        assert detail.overall_risk_score == 42.5
        assert detail.delay_risk_score == 55.0

    def test_score_out_of_range_raises(self) -> None:
        """Risk score > 100 triggers ValidationError."""
        with pytest.raises(ValidationError):
            RiskAssessmentDetail(
                shipment_id="SHP001",
                overall_risk_score=150.0,
                risk_category="High Risk",
                risk_priority="P1",
                temperature_risk_score=0.0,
                humidity_risk_score=0.0,
                battery_risk_score=0.0,
                delay_risk_score=0.0,
            )


# ===========================================================================
# Analytics Schemas
# ===========================================================================

class TestAnalyticsRunResponse:
    """AnalyticsRunResponse schema validation."""

    def test_valid_response(self) -> None:
        """Create a valid AnalyticsRunResponse."""
        response = AnalyticsRunResponse(
            success=True,
            status="completed",
            exit_code=0,
            message="Pipeline completed.",
        )
        assert response.success is True
        assert response.exit_code == 0

    def test_with_summary(self) -> None:
        """Include optional PipelineSummary."""
        response = AnalyticsRunResponse(
            success=True,
            status="completed",
            exit_code=0,
            message="Pipeline completed.",
            summary=PipelineSummary(
                project="AtmoSync AI",
                version="1.0.0",
                overall_success=True,
                total_execution_time_seconds=1245.87,
                completed_steps=["data_cleaning", "risk_assessment"],
                failed_steps=[],
            ),
        )
        assert response.summary is not None
        assert response.summary.overall_success is True


class TestPipelineStepDetail:
    """PipelineStepDetail schema validation."""

    def test_valid_step(self) -> None:
        """Create a valid PipelineStepDetail."""
        step = PipelineStepDetail(
            step_name="risk_assessment",
            status="Completed",
            start_time_utc="2025-01-15 08:30:00 UTC",
            end_time_utc="2025-01-15 08:32:15 UTC",
            execution_time_seconds=135.42,
        )
        assert step.step_name == "risk_assessment"
        assert step.execution_time_seconds == 135.42

    def test_with_error(self) -> None:
        """PipelineStepDetail can include an error message."""
        step = PipelineStepDetail(
            step_name="export_data",
            status="Failed",
            start_time_utc="2025-01-15 08:30:00 UTC",
            end_time_utc="2025-01-15 08:30:05 UTC",
            execution_time_seconds=5.0,
            error_message="Missing required column: 'Risk Category'",
        )
        assert step.error_message is not None
        assert "Risk Category" in step.error_message

    def test_negative_time_raises(self) -> None:
        """Negative execution_time_seconds triggers ValidationError (ge=0)."""
        with pytest.raises(ValidationError):
            PipelineStepDetail(
                step_name="test",
                status="Completed",
                start_time_utc="2025-01-01 00:00:00 UTC",
                end_time_utc="2025-01-01 00:00:01 UTC",
                execution_time_seconds=-1.0,
            )

