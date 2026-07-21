"""AtmoSync AI processing pipeline package.

This package contains the complete data engineering, analytics, business
intelligence, and orchestration pipeline for AtmoSync AI.

Modules (single responsibility)
--------------------------------
sensor_generator
    Generates raw IoT sensor data and persists it for downstream processing.
data_cleaning
    Cleans and normalizes raw sensor data for reliable feature computation.
feature_engineering
    Derives analytical features from cleaned datasets.
risk_assessment
    Computes spoilage and shipment risk indicators from engineered features.
financial_loss
    Estimates potential financial loss based on assessed risk.
recommendation_engine
    Produces operational recommendations informed by risk and analytics.
business_insights
    Builds business-level insights and aggregations for reporting.
export_data
    Exports final datasets and summaries for dashboard consumption.
pipeline
    Orchestrates end-to-end execution order across processing modules.
"""

from __future__ import annotations

from backend.config.config import AUTHOR as __author__
from backend.config.config import VERSION as __version__

from . import business_insights
from . import data_cleaning
from . import export_data
from . import feature_engineering
from . import financial_loss
from . import pipeline
from . import recommendation_engine
from . import risk_assessment
from . import sensor_generator
# Package metadata (no configuration/constants exports)
PACKAGE_NAME: str = "AtmoSync AI"

__all__: list[str] = [
    "sensor_generator",
    "data_cleaning",
    "feature_engineering",
    "risk_assessment",
    "financial_loss",
    "recommendation_engine",
    "business_insights",
    "export_data",
    "pipeline",
]

