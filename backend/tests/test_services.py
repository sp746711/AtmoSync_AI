"""Tests for the backend service layer.

Verifies that services with real business logic behave correctly:
- ``alert_service``: DataFrame-based alert generation
- ``dashboard_service``: CSV file reading
- ``risk_service``: Risk assessment pipeline wrapper
- ``recommendation_service``: Recommendation engine wrapper
- ``analytics_service``: Full pipeline orchestration

Services that are simple wrappers around script calls are tested
with mocked dependencies to verify error propagation.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any
from unittest.mock import patch

import pandas as pd
import pytest

from backend.services.alert_service import (
    get_active_alerts,
    count_active_alerts,
)
from backend.services.dashboard_service import read_final_dashboard_data_csv


# ===========================================================================
# Alert Service
# ===========================================================================

class TestGetActiveAlerts:
    """``get_active_alerts`` — DataFrame-based alert generation."""

    @pytest.fixture
    def sample_df(self) -> pd.DataFrame:
        """Create a sample DataFrame with alert flags."""
        return pd.DataFrame(
            {
                "Shipment ID": ["SHP001", "SHP002", "SHP003"],
                "Timestamp": ["2025-01-15 10:00:00", "2025-01-15 11:00:00", "2025-01-15 12:00:00"],
                "Temperature Excursion Flag": [1, 0, 0],
                "Humidity Excursion Flag": [0, 1, 0],
                "Battery Low Flag": [0, 0, 1],
                "Delay Flag": [0, 0, 0],
                "High Shock Flag": [0, 0, 0],
                "High Vibration Flag": [0, 0, 0],
                "Risk Category": ["High Risk", "Medium Risk", "Critical Risk"],
            }
        )

    def test_returns_alerts_for_flagged_rows(self, sample_df: pd.DataFrame) -> None:
        """Alerts are generated for rows with active flags."""
        alerts = get_active_alerts(df=sample_df, limit=100)
        assert len(alerts) >= 3  # temp excursion + humidity excursion + critical risk

    def test_alert_structure(self, sample_df: pd.DataFrame) -> None:
        """Each alert has the expected fields."""
        alerts = get_active_alerts(df=sample_df, limit=100)
        for alert in alerts:
            assert "alert_id" in alert
            assert "severity" in alert
            assert "label" in alert
            assert "message" in alert
            assert "timestamp" in alert
            assert "shipment_id" in alert

    def test_alert_id_format(self, sample_df: pd.DataFrame) -> None:
        """Alert IDs follow the ALT-XXXX- pattern."""
        alerts = get_active_alerts(df=sample_df, limit=100)
        for alert in alerts:
            assert alert["alert_id"].startswith("ALT-")

    def test_empty_dataframe_returns_empty_list(self) -> None:
        """Empty DataFrame yields no alerts."""
        df = pd.DataFrame(columns=[
            "Shipment ID", "Timestamp", "Temperature Excursion Flag",
            "Humidity Excursion Flag", "Battery Low Flag", "Delay Flag",
            "High Shock Flag", "High Vibration Flag", "Risk Category",
        ])
        alerts = get_active_alerts(df=df, limit=100)
        assert alerts == []

    def test_no_flags_returns_empty(self) -> None:
        """DataFrame with no active flags returns no alerts."""
        df = pd.DataFrame({
            "Shipment ID": ["SHP001"],
            "Timestamp": ["2025-01-15 10:00:00"],
            "Temperature Excursion Flag": [0],
            "Humidity Excursion Flag": [0],
            "Battery Low Flag": [0],
            "Delay Flag": [0],
            "High Shock Flag": [0],
            "High Vibration Flag": [0],
            "Risk Category": ["Low Risk"],
        })
        alerts = get_active_alerts(df=df, limit=100)
        assert alerts == []

    def test_missing_columns_warns_but_does_not_fail(self) -> None:
        """Missing columns result in partial alerts instead of failure."""
        df = pd.DataFrame({
            "Shipment ID": ["SHP001"],
            "Timestamp": ["2025-01-15 10:00:00"],
            "Temperature Excursion Flag": [1],
            "Risk Category": ["High Risk"],
        })
        # Should not raise despite missing several columns
        alerts = get_active_alerts(df=df, limit=100)
        assert len(alerts) >= 1

    def test_limit_truncates_results(self, sample_df: pd.DataFrame) -> None:
        """Limit parameter truncates alerts."""
        alerts = get_active_alerts(df=sample_df, limit=1)
        assert len(alerts) <= 1

    def test_severity_critical_sorted_first(self, sample_df: pd.DataFrame) -> None:
        """Critical severity alerts appear first in sorted output."""
        alerts = get_active_alerts(df=sample_df, limit=100)
        if len(alerts) >= 2:
            severities = [a["severity"] for a in alerts]
            # Critical should be before high, before medium, before low
            assert severities == sorted(severities, key=lambda s: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(s, 99))

    def test_risk_category_critical_triggers_alert(self) -> None:
        """'Critical Risk' category generates an alert."""
        df = pd.DataFrame({
            "Shipment ID": ["SHP001"],
            "Timestamp": ["2025-01-15 10:00:00"],
            "Temperature Excursion Flag": [0],
            "Humidity Excursion Flag": [0],
            "Battery Low Flag": [0],
            "Delay Flag": [0],
            "High Shock Flag": [0],
            "High Vibration Flag": [0],
            "Risk Category": ["Critical Risk"],
        })
        alerts = get_active_alerts(df=df, limit=100)
        assert len(alerts) == 1
        assert alerts[0]["label"] == "Critical Risk"

    def test_file_not_found_raises(self) -> None:
        """FileNotFoundError is raised when CSV does not exist and no df provided."""
        with patch(
            "backend.services.alert_service.FINAL_DASHBOARD_DATA_CSV",
            "/nonexistent/path.csv",
        ):
            with pytest.raises(FileNotFoundError):
                get_active_alerts(limit=100)


class TestCountActiveAlerts:
    """``count_active_alerts`` — total alert count."""

    def test_returns_zero_for_empty(self) -> None:
        """Empty DataFrame yields count 0."""
        df = pd.DataFrame(columns=[
            "Shipment ID", "Timestamp", "Temperature Excursion Flag",
            "Humidity Excursion Flag", "Battery Low Flag", "Delay Flag",
            "High Shock Flag", "High Vibration Flag", "Risk Category",
        ])
        count = count_active_alerts(df=df)
        assert count == 0

    def test_returns_positive_count(self) -> None:
        """DataFrame with flags returns positive count."""
        df = pd.DataFrame({
            "Shipment ID": ["SHP001", "SHP002"],
            "Timestamp": ["2025-01-15 10:00:00", "2025-01-15 11:00:00"],
            "Temperature Excursion Flag": [1, 0],
            "Humidity Excursion Flag": [0, 1],
            "Battery Low Flag": [0, 0],
            "Delay Flag": [0, 0],
            "High Shock Flag": [0, 0],
            "High Vibration Flag": [0, 0],
            "Risk Category": ["High Risk", "High Risk"],
        })
        count = count_active_alerts(df=df)
        assert count >= 2


# ===========================================================================
# Dashboard Service
# ===========================================================================

class TestReadFinalDashboardDataCsv:
    """``read_final_dashboard_data_csv`` — CSV file reader."""

    def test_returns_csv_text(self, tmp_path: Path) -> None:
        """Reads and returns raw CSV text."""
        csv_path = tmp_path / "final_dashboard_data.csv"
        csv_path.write_text("col1,col2\n1,2\n3,4\n", encoding="utf-8")

        with patch(
            "backend.services.dashboard_service.FINAL_DASHBOARD_DATA_CSV",
            csv_path,
        ):
            result = read_final_dashboard_data_csv()
            assert "col1,col2" in result
            assert "1,2" in result

    def test_raises_file_not_found(self) -> None:
        """FileNotFoundError is raised when CSV does not exist."""
        with patch(
            "backend.services.dashboard_service.FINAL_DASHBOARD_DATA_CSV",
            "/nonexistent/path.csv",
        ):
            with pytest.raises(FileNotFoundError):
                read_final_dashboard_data_csv()


# ===========================================================================
# Risk Service
# ===========================================================================

class TestRiskService:
    """``run_risk_assessment`` — risk service wrapper."""

    def test_success_returns_0(self) -> None:
        """Successful execution returns 0."""
        with patch("backend.services.risk_service.risk_main") as mock_main:
            from backend.services.risk_service import run_risk_assessment
            mock_main.return_value = None  # main() doesn't return anything
            result = run_risk_assessment()
            assert result == 0
            mock_main.assert_called_once()

    def test_exception_returns_1(self) -> None:
        """Exception during execution returns 1."""
        with patch(
            "backend.services.risk_service.risk_main",
            side_effect=ValueError("test error"),
        ):
            from backend.services.risk_service import run_risk_assessment
            result = run_risk_assessment()
            assert result == 1


# ===========================================================================
# Recommendation Service
# ===========================================================================

class TestRecommendationService:
    """``run_recommendation`` — recommendation service wrapper."""

    def test_success_returns_0(self) -> None:
        """Successful execution returns 0."""
        with patch("backend.services.recommendation_service.recommendation_main") as mock_main:
            from backend.services.recommendation_service import run_recommendation
            mock_main.return_value = None
            result = run_recommendation()
            assert result == 0
            mock_main.assert_called_once()

    def test_exception_returns_1(self) -> None:
        """Exception during execution returns 1."""
        with patch(
            "backend.services.recommendation_service.recommendation_main",
            side_effect=ValueError("test error"),
        ):
            from backend.services.recommendation_service import run_recommendation
            result = run_recommendation()
            assert result == 1


# ===========================================================================
# Analytics Service
# ===========================================================================

class TestAnalyticsService:
    """``run_full_pipeline`` — analytics service wrapper."""

    def test_success_returns_0(self) -> None:
        """Successful execution returns 0."""
        with patch("backend.services.analytics_service.run_complete_pipeline") as mock_pipeline:
            from backend.services.analytics_service import run_full_pipeline
            mock_pipeline.return_value = 0
            result = run_full_pipeline()
            assert result == 0
            mock_pipeline.assert_called_once()

    def test_failure_returns_non_zero(self) -> None:
        """Failed execution returns non-zero."""
        with patch(
            "backend.services.analytics_service.run_complete_pipeline",
            return_value=1,
        ):
            from backend.services.analytics_service import run_full_pipeline
            result = run_full_pipeline()
            assert result == 1
