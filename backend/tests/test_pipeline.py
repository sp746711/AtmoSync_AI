"""
Tests for the AtmoSync AI data pipeline.

Tests verify that each pipeline step can execute end-to-end
using generated test data.
"""

from __future__ import annotations

import logging
import tempfile
from pathlib import Path
from unittest.mock import patch

import pandas as pd
import pytest

from backend.config.config import (
    FINAL_DASHBOARD_DATA_CSV,
    PROCESSED_SENSOR_DATA_CSV,
    SENSOR_DATA_CSV,
)
from backend.scripts import (
    business_insights,
    data_cleaning,
    feature_engineering,
    financial_loss,
    recommendation_engine,
    risk_assessment,
    sensor_generator,
)


@pytest.fixture(autouse=True)
def setup_test_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    """Redirect CSV paths to temporary directory for test isolation."""
    tmp_dir = Path(tempfile.mkdtemp(prefix="atmosync_test_"))
    monkeypatch.setattr(
        "backend.config.config.RAW_DATA_DIR",
        tmp_dir / "raw",
    )
    monkeypatch.setattr(
        "backend.config.config.PROCESSED_DATA_DIR",
        tmp_dir / "processed",
    )
    monkeypatch.setattr(
        "backend.config.config.EXPORTS_DIR",
        tmp_dir / "exports",
    )
    monkeypatch.setattr(
        "backend.config.config.SENSOR_DATA_CSV",
        tmp_dir / "raw" / "sensor_data.csv",
    )
    monkeypatch.setattr(
        "backend.config.config.PROCESSED_SENSOR_DATA_CSV",
        tmp_dir / "processed" / "processed_sensor_data.csv",
    )
    monkeypatch.setattr(
        "backend.config.config.FINAL_DASHBOARD_DATA_CSV",
        tmp_dir / "exports" / "final_dashboard_data.csv",
    )


def test_sensor_generation() -> None:
    """Test that sensor data generation produces valid output."""
    df = sensor_generator.generate_sensor_data(records=100, rng_seed=42)
    assert len(df) == 100
    assert "Shipment ID" in df.columns
    assert "Temperature" in df.columns
    assert "Humidity" in df.columns
    assert df["Temperature"].between(-25, 15).all()


def test_sensor_generator_main() -> None:
    """Test sensor_generator.main() end-to-end."""
    result = sensor_generator.main(records=50)
    assert isinstance(result, pd.DataFrame)
    assert len(result) == 50
    assert SENSOR_DATA_CSV.exists()


def test_data_cleaning_main() -> None:
    """Test data_cleaning.main() end-to-end."""
    sensor_generator.main(records=50)
    cleaned = data_cleaning.main()
    assert isinstance(cleaned, pd.DataFrame)
    assert len(cleaned) > 0
    assert PROCESSED_SENSOR_DATA_CSV.exists()


def test_feature_engineering_main() -> None:
    """Test feature_engineering.main() end-to-end."""
    sensor_generator.main(records=50)
    data_cleaning.main()
    engineered = feature_engineering.main()
    assert isinstance(engineered, pd.DataFrame)
    assert "Temperature Deviation" in engineered.columns
    assert "Humidity Deviation" in engineered.columns
    assert "Risk Indicator" in engineered.columns
    assert FINAL_DASHBOARD_DATA_CSV.exists()


def test_risk_assessment_main() -> None:
    """Test risk_assessment.main() end-to-end."""
    sensor_generator.main(records=50)
    data_cleaning.main()
    feature_engineering.main()
    risk_assessment.main()
    df = pd.read_csv(FINAL_DASHBOARD_DATA_CSV)
    assert "Risk Score" in df.columns
    assert "Risk Category" in df.columns
    assert "Temperature Risk Score" in df.columns


def test_financial_loss_main() -> None:
    """Test financial_loss.main() end-to-end."""
    sensor_generator.main(records=50)
    data_cleaning.main()
    feature_engineering.main()
    risk_assessment.main()
    financial_loss.main()
    df = pd.read_csv(FINAL_DASHBOARD_DATA_CSV)
    assert "Financial Loss" in df.columns
    assert "Inventory Value" in df.columns
    assert "Insurance Eligible" in df.columns


def test_recommendation_engine_main() -> None:
    """Test recommendation_engine.main() end-to-end."""
    sensor_generator.main(records=50)
    data_cleaning.main()
    feature_engineering.main()
    risk_assessment.main()
    financial_loss.main()
    recommendation_engine.main()
    df = pd.read_csv(FINAL_DASHBOARD_DATA_CSV)
    assert "Operational Recommendation" in df.columns
    assert "Recommendation Severity" in df.columns


def test_full_pipeline() -> None:
    """Test the complete pipeline via business_insights.main()."""
    sensor_generator.main(records=50)
    data_cleaning.main()
    feature_engineering.main()
    risk_assessment.main()
    financial_loss.main()
    recommendation_engine.main()
    business_insights.main()

    # Verify all output files exist
    from backend.config.config import (
        EXECUTIVE_SUMMARY_CSV,
        BUSINESS_INSIGHTS_CSV,
        FINANCIAL_SUMMARY_CSV,
    )
    assert EXECUTIVE_SUMMARY_CSV.exists()
    assert BUSINESS_INSIGHTS_CSV.exists()
    assert FINANCIAL_SUMMARY_CSV.exists()


def test_data_cleaning_handles_missing_values() -> None:
    """Test that data cleaning handles rows with missing sensor readings."""
    sensor_generator.main(records=50)
    cleaned = data_cleaning.main()
    assert not cleaned["Temperature"].isna().all()
    assert not cleaned["Humidity"].isna().all()

