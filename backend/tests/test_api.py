"""Tests for all FastAPI API endpoints.

Verifies that every registered route returns the expected HTTP status,
JSON schema, and handles error conditions appropriately.

No production code is modified; service dependencies are isolated
via ``unittest.mock``.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from backend.main import app


@pytest.fixture
def client() -> TestClient:
    """Yield a FastAPI test client bound to the application."""
    with TestClient(app) as c:
        yield c


# ---------------------------------------------------------------------------
# Health Endpoint
# ---------------------------------------------------------------------------

class TestHealthEndpoint:
    """GET /health"""

    def test_health_returns_200(self, client: TestClient) -> None:
        """Health check returns 200 OK with project metadata."""
        response = client.get("/health")
        assert response.status_code == 200

        data: dict[str, Any] = response.json()
        assert data["status"] == "healthy"
        assert "project" in data
        assert "version" in data
        assert isinstance(data["project"], str)
        assert len(data["project"]) > 0

    def test_health_rejects_post(self, client: TestClient) -> None:
        """Health endpoint only accepts GET."""
        response = client.post("/health")
        assert response.status_code == 405


# ---------------------------------------------------------------------------
# Analytics Endpoint
# ---------------------------------------------------------------------------

class TestAnalyticsEndpoint:
    """POST /analytics/run"""

    def test_analytics_run_success(self, client: TestClient) -> None:
        """Analytics pipeline returns success payload."""
        with patch(
            "backend.api.analytics.run_full_pipeline",
            return_value=0,
        ):
            response = client.post("/analytics/run")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is True
            assert data["status"] == "completed"
            assert data["exit_code"] == 0
            assert "message" in data

    def test_analytics_run_failure(self, client: TestClient) -> None:
        """Analytics pipeline propagates non-zero exit code."""
        with patch(
            "backend.api.analytics.run_full_pipeline",
            return_value=1,
        ):
            response = client.post("/analytics/run")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is False
            assert data["status"] == "failed"
            assert data["exit_code"] == 1

    def test_analytics_run_exception(self, client: TestClient) -> None:
        """Analytics pipeline exception raises HTTP 500."""
        with patch(
            "backend.api.analytics.run_full_pipeline",
            side_effect=RuntimeError("pipeline crashed"),
        ):
            response = client.post("/analytics/run")
            assert response.status_code == 500

            data: dict[str, Any] = response.json()
            assert "detail" in data

    def test_analytics_rejects_get(self, client: TestClient) -> None:
        """Analytics endpoint only accepts POST."""
        response = client.get("/analytics/run")
        assert response.status_code == 405


# ---------------------------------------------------------------------------
# Dashboard Endpoint
# ---------------------------------------------------------------------------

class TestDashboardEndpoint:
    """GET /dashboard/final-data"""

    def test_dashboard_success(self, client: TestClient, tmp_path) -> None:
        """Dashboard returns CSV content when file exists."""
        csv_path = tmp_path / "final_dashboard_data.csv"
        csv_path.write_text("col1,col2\n1,2\n3,4\n", encoding="utf-8")

        with patch(
            "backend.services.dashboard_service.FINAL_DASHBOARD_DATA_CSV",
            csv_path,
        ):
            response = client.get("/dashboard/final-data")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is True
            assert "csv" in data
            assert "col1,col2" in data["csv"]

    def test_dashboard_not_found(self, client: TestClient) -> None:
        """Dashboard returns 404 when CSV file is missing."""
        with patch(
            "backend.services.dashboard_service.FINAL_DASHBOARD_DATA_CSV",
            "/nonexistent/path.csv",
        ):
            response = client.get("/dashboard/final-data")
            assert response.status_code == 404

            data: dict[str, Any] = response.json()
            assert "detail" in data

    def test_dashboard_rejects_post(self, client: TestClient) -> None:
        """Dashboard endpoint only accepts GET."""
        response = client.post("/dashboard/final-data")
        assert response.status_code == 405


# ---------------------------------------------------------------------------
# Alerts Endpoint
# ---------------------------------------------------------------------------

class TestAlertsEndpoint:
    """GET /alerts"""

    def test_alerts_success(self, client: TestClient) -> None:
        """Alerts returns active alert list."""
        mock_alerts = [
            {
                "alert_id": "ALT-TEMP-SHP00A1-0001",
                "severity": "high",
                "label": "Temperature Excursion",
                "message": "Test alert",
                "timestamp": "2025-01-15 14:30:00",
                "shipment_id": "SHP00A1",
            }
        ]

        with (
            patch(
                "backend.api.alerts.get_active_alerts",
                return_value=mock_alerts,
            ),
            patch(
                "backend.api.alerts.count_active_alerts",
                return_value=1,
            ),
        ):
            response = client.get("/alerts")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is True
            assert data["count"] == 1
            assert data["total_active"] == 1
            assert len(data["alerts"]) == 1
            assert data["alerts"][0]["alert_id"] == "ALT-TEMP-SHP00A1-0001"

    def test_alerts_empty(self, client: TestClient) -> None:
        """Alerts returns empty list when no alerts exist."""
        with patch(
            "backend.api.alerts.get_active_alerts",
            return_value=[],
        ):
            response = client.get("/alerts")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is True
            assert data["count"] == 0
            assert data["alerts"] == []

    def test_alerts_with_limit(self, client: TestClient) -> None:
        """Alerts respects the limit query parameter."""
        mock_alerts = [
            {
                "alert_id": f"ALT-TEST-{i:04d}",
                "severity": "low",
                "label": f"Alert {i}",
                "message": "Test",
                "timestamp": "2025-01-15 14:30:00",
                "shipment_id": f"SHP{i:04d}",
            }
            for i in range(5)
        ]

        with (
            patch(
                "backend.api.alerts.get_active_alerts",
                return_value=mock_alerts,
            ),
            patch(
                "backend.api.alerts.count_active_alerts",
                return_value=5,
            ),
        ):
            response = client.get("/alerts?limit=5")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is True
            assert data["count"] == 5

    def test_alerts_exception(self, client: TestClient) -> None:
        """Alerts exception raises HTTP 500."""
        with patch(
            "backend.api.alerts.get_active_alerts",
            side_effect=RuntimeError("service error"),
        ):
            response = client.get("/alerts")
            assert response.status_code == 500

    def test_alerts_rejects_post(self, client: TestClient) -> None:
        """Alerts endpoint only accepts GET."""
        response = client.post("/alerts")
        assert response.status_code == 405


# ---------------------------------------------------------------------------
# Risk Endpoint
# ---------------------------------------------------------------------------

class TestRiskEndpoint:
    """POST /risk/run"""

    def test_risk_run_success(self, client: TestClient) -> None:
        """Risk assessment returns success payload."""
        with patch(
            "backend.api.risk.run_risk_assessment",
            return_value=0,
        ):
            response = client.post("/risk/run")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is True
            assert data["status"] == "completed"
            assert data["exit_code"] == 0

    def test_risk_run_failure(self, client: TestClient) -> None:
        """Risk assessment propagates non-zero exit code."""
        with patch(
            "backend.api.risk.run_risk_assessment",
            return_value=1,
        ):
            response = client.post("/risk/run")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is False
            assert data["status"] == "failed"
            assert data["exit_code"] == 1

    def test_risk_run_exception(self, client: TestClient) -> None:
        """Risk assessment exception raises HTTP 500."""
        with patch(
            "backend.api.risk.run_risk_assessment",
            side_effect=RuntimeError("risk error"),
        ):
            response = client.post("/risk/run")
            assert response.status_code == 500

    def test_risk_rejects_get(self, client: TestClient) -> None:
        """Risk endpoint only accepts POST."""
        response = client.get("/risk/run")
        assert response.status_code == 405


# ---------------------------------------------------------------------------
# Recommendation Endpoint
# ---------------------------------------------------------------------------

class TestRecommendationEndpoint:
    """POST /recommendation/run"""

    def test_recommendation_run_success(self, client: TestClient) -> None:
        """Recommendation engine returns success payload."""
        with patch(
            "backend.api.recommendation.execute_recommendation",
            return_value=0,
        ):
            response = client.post("/recommendation/run")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is True
            assert data["status"] == "completed"
            assert data["exit_code"] == 0

    def test_recommendation_run_failure(self, client: TestClient) -> None:
        """Recommendation engine propagates non-zero exit code."""
        with patch(
            "backend.api.recommendation.execute_recommendation",
            return_value=1,
        ):
            response = client.post("/recommendation/run")
            assert response.status_code == 200

            data: dict[str, Any] = response.json()
            assert data["success"] is False
            assert data["status"] == "failed"
            assert data["exit_code"] == 1

    def test_recommendation_run_exception(self, client: TestClient) -> None:
        """Recommendation engine exception raises HTTP 500."""
        with patch(
            "backend.api.recommendation.execute_recommendation",
            side_effect=RuntimeError("rec error"),
        ):
            response = client.post("/recommendation/run")
            assert response.status_code == 500

    def test_recommendation_rejects_get(self, client: TestClient) -> None:
        """Recommendation endpoint only accepts POST."""
        response = client.get("/recommendation/run")
        assert response.status_code == 405


# ---------------------------------------------------------------------------
# Reports Endpoint
# ---------------------------------------------------------------------------

class TestReportsEndpoint:
    """GET /reports/status"""

    def test_reports_status_available(self, client: TestClient) -> None:
        """Reports status returns available state."""
        response = client.get("/reports/status")
        assert response.status_code == 200

        data: dict[str, Any] = response.json()
        assert data["success"] is True
        assert data["status"] == "available"
        assert data["generation_mode"] == "pipeline"

    def test_reports_rejects_post(self, client: TestClient) -> None:
        """Reports endpoint only accepts GET."""
        response = client.post("/reports/status")
        assert response.status_code == 405


# ---------------------------------------------------------------------------
# Map Endpoint
# ---------------------------------------------------------------------------

class TestMapEndpoint:
    """GET /map/status"""

    def test_map_status_available(self, client: TestClient) -> None:
        """Map status returns available state."""
        response = client.get("/map/status")
        assert response.status_code == 200

        data: dict[str, Any] = response.json()
        assert data["success"] is True
        assert data["status"] == "available"
        assert "tracking_enabled" in data

    def test_map_rejects_post(self, client: TestClient) -> None:
        """Map endpoint only accepts GET."""
        response = client.post("/map/status")
        assert response.status_code == 405


# ---------------------------------------------------------------------------
# Shipment Endpoint
# ---------------------------------------------------------------------------

class TestShipmentEndpoint:
    """POST /shipment/run"""

    def test_shipment_run_redirect(self, client: TestClient) -> None:
        """Shipment endpoint returns redirect to analytics pipeline."""
        response = client.post("/shipment/run")
        assert response.status_code == 200

        data: dict[str, Any] = response.json()
        assert data["success"] is True
        assert data["status"] == "redirect"
        assert "endpoint" in data
        assert data["endpoint"] == "/analytics/run"

    def test_shipment_rejects_get(self, client: TestClient) -> None:
        """Shipment endpoint only accepts POST."""
        response = client.get("/shipment/run")
        assert response.status_code == 405


# ---------------------------------------------------------------------------
# 404 Handling
# ---------------------------------------------------------------------------

class TestNotFound:
    """Requests to non-existent routes."""

    def test_unknown_route_returns_404(self, client: TestClient) -> None:
        """Unknown routes return 404."""
        response = client.get("/nonexistent/route")
        assert response.status_code == 404

    def test_unknown_post_returns_404(self, client: TestClient) -> None:
        """Unknown POST routes return 404."""
        response = client.post("/nonexistent")
        assert response.status_code == 404
