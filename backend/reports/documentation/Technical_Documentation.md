# 🔧 AtmoSync AI — Technical Documentation

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-0.111+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Pandas-2.2+-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas">
  <img src="https://img.shields.io/badge/Power%20BI-Integration-F2C811?style=for-the-badge&logo=powerbi&logoColor=black" alt="Power BI">
</p>

---

## 📑 Table of Contents

1. [Backend Architecture](#1-backend-architecture)
2. [Folder Structure](#2-folder-structure)
3. [Config Module](#3-config-module)
4. [Scripts (Pipeline Modules)](#4-scripts-pipeline-modules)
5. [Services Layer](#5-services-layer)
6. [Schemas (Pydantic Models)](#6-schemas-pydantic-models)
7. [Utils Module](#7-utils-module)
8. [Middleware](#8-middleware)
9. [Pipeline Controller](#9-pipeline-controller)
10. [Logging System](#10-logging-system)
11. [Error Handling](#11-error-handling)
12. [Business Rules Engine](#12-business-rules-engine)
13. [CSV Data Flow](#13-csv-data-flow)
14. [Power BI Integration](#14-power-bi-integration)
15. [Environment Variables](#15-environment-variables)
16. [Deployment Notes](#16-deployment-notes)

---

## 1. Backend Architecture

AtmoSync AI follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                            │
│  FastAPI (main.py) + Routers (api/) + Middleware                     │
├─────────────────────────────────────────────────────────────────────┤
│                        SERVICE LAYER                                 │
│  Lightweight wrappers (services/) bridging APIs and pipeline         │
├─────────────────────────────────────────────────────────────────────┤
│                        PIPELINE LAYER                                │
│  Core analytics engine (scripts/) with 8 sequential stages           │
├─────────────────────────────────────────────────────────────────────┤
│                        CONFIGURATION LAYER                           │
│  Business rules, paths, environment (config/)                        │
├─────────────────────────────────────────────────────────────────────┤
│                        DATA LAYER                                    │
│  CSV storage, exports, reports (data/ + reports/)                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Application Entry Point

**File**: `backend/main.py`

```python
from fastapi import FastAPI
from backend.api import alerts, analytics, dashboard, health, map as map_api,
                       recommendation, risk, reports, shipment
from backend.middleware import register_middleware

def create_app() -> FastAPI:
    app = FastAPI(
        title="AtmoSync AI API",
        version="1.0.0",
        description="Smart Cold Chain Monitoring & Spoilage Risk Analytics System",
    )
    register_middleware(app)
    app.include_router(health.router)
    app.include_router(analytics.router)
    app.include_router(recommendation.router)
    app.include_router(risk.router)
    app.include_router(shipment.router)
    app.include_router(dashboard.router)
    app.include_router(reports.router)
    app.include_router(map_api.router)
    app.include_router(alerts.router)
    return app

app = create_app()
```

The application factory pattern (`create_app()`) allows for:
- Clean initialization and testing
- Modular router registration
- Middleware configuration before route mounting

---

## 2. Folder Structure

```
backend/
│
├── main.py                     # FastAPI application factory & entry point
├── requirements.txt            # Python dependency manifest
│
├── api/                        # REST API route handlers
│   ├── __init__.py
│   ├── analytics.py            # POST /analytics/run
│   ├── alerts.py               # GET /alerts
│   ├── dashboard.py            # GET /dashboard/final-data
│   ├── health.py               # GET /health
│   ├── map.py                  # GET /map/status
│   ├── recommendation.py       # POST /recommendation/run
│   ├── reports.py              # GET /reports/status
│   ├── risk.py                 # POST /risk/run
│   └── shipment.py             # POST /shipment/run
│
├── schemas/                    # Pydantic validation models
│   ├── __init__.py
│   ├── analytics.py            # AnalyticsRunRequest, PipelineStepDetail, etc.
│   ├── alerts.py               # AlertItem, AlertQueryParams, AlertListResponse
│   ├── dashboard.py            # DashboardDataResponse, DashboardKPIEntry, etc.
│   ├── recommendation.py       # RecommendationRunRequest, RecommendationItem, etc.
│   └── risk.py                 # RiskRunRequest, RiskCategoryCount, RiskSummary, etc.
│
├── services/                   # Business logic wrappers
│   ├── __init__.py
│   ├── alert_service.py        # Alert generation from dashboard CSV
│   ├── analytics_service.py    # Full pipeline orchestration
│   ├── dashboard_service.py    # Dashboard CSV reader
│   ├── recommendation_service.py   # Recommendation engine wrapper
│   └── risk_service.py         # Risk assessment wrapper
│
├── scripts/                    # Core analytics pipeline modules
│   ├── __init__.py
│   ├── pipeline.py             # Orchestrator with step-level tracking
│   ├── sensor_generator.py     # Stage 1: IoT data simulation
│   ├── data_cleaning.py        # Stage 2: Data cleaning & validation
│   ├── feature_engineering.py  # Stage 3: Feature extraction
│   ├── risk_assessment.py      # Stage 4: Risk scoring & classification
│   ├── financial_loss.py       # Stage 5: Financial estimation
│   ├── recommendation_engine.py # Stage 6: Recommendation generation
│   ├── business_insights.py    # Stage 7: KPI & insight generation
│   └── export_data.py          # Stage 8: CSV/Excel export
│
├── config/                     # Configuration management
│   ├── __init__.py
│   ├── config.py               # Central configuration (paths, APIs, sensors)
│   ├── business_rules.py       # Domain rules (risk bands, spoilage rates)
│   └── logging_config.py       # Logging setup (console + rotating file)
│
├── middleware/                  # FastAPI middleware
│   └── __init__.py
│
├── database/                   # Database layer (future-ready)
│   ├── __init__.py
│   └── connection.py
│
├── utils/                      # Utility functions
│   ├── __init__.py
│   ├── dataframe_utils.py      # DataFrame helper functions
│   ├── file_utils.py           # File system utilities
│   └── validation_utils.py     # Data validation utilities
│
├── tests/                      # Unit tests
│   └── test_pipeline.py
│
├── data/                       # Data storage
│   ├── raw/                    # Raw sensor data (sensor_data.csv)
│   ├── processed/              # Cleaned data (processed_sensor_data.csv)
│   └── exports/                # Final datasets (final_dashboard_data.csv)
│
├── dashboard/                  # Power BI
│   ├── AtmoSync_AI.pbix        # Power BI workbook
│   └── Dashboard_Guide.md      # Dashboard user guide
│
├── reports/                    # Generated reports
│   ├── output/                 # CSV reports (executive_summary, etc.)
│   ├── documentation/          # Documentation files
│   ├── screenshots/            # Dashboard screenshots
│   └── presentation/           # Presentation materials
│
├── logs/                       # Application logs (rotating)
│   └── atmosync.log
│
├── assets/                     # Static assets
├── static/                     # Served static files
└── notebooks/                  # Jupyter notebooks
    └── analysis.ipynb
```

---

## 3. Config Module

### `backend/config/config.py`

Central configuration module that manages all system settings. Key components:

#### Path Configuration
Ensures all data directories exist at startup:

```python
DATA_DIR = ensure_folder(PROJECT_ROOT / "data")
RAW_DATA_DIR = ensure_folder(DATA_DIR / "raw")
PROCESSED_DATA_DIR = ensure_folder(DATA_DIR / "processed")
EXPORTS_DIR = ensure_folder(DATA_DIR / "exports")
REPORTS_OUTPUT_DIR = ensure_folder(REPORTS_DIR / "output")
# ... additional directories
```

#### CSV File Paths
Pre-defined paths for all CSV outputs:

| Variable | Path |
|----------|------|
| `SENSOR_DATA_CSV` | `backend/data/raw/sensor_data.csv` |
| `PROCESSED_SENSOR_DATA_CSV` | `backend/data/processed/processed_sensor_data.csv` |
| `FINAL_DASHBOARD_DATA_CSV` | `backend/data/exports/final_dashboard_data.csv` |
| `EXECUTIVE_SUMMARY_CSV` | `backend/reports/output/executive_summary.csv` |
| `BUSINESS_INSIGHTS_CSV` | `backend/reports/output/business_insights.csv` |
| `FINANCIAL_SUMMARY_CSV` | `backend/reports/output/financial_summary.csv` |

#### Sensor Configuration
Defines ranges for all simulated sensors and alert thresholds:
- Temperature: -25.0°C to 15.0°C
- Humidity: 20.0% to 100.0%
- Battery: 0.0% to 100.0%
- Vibration: 0.0 to 20.0 m/s²
- Shock: 0.0 to 500.0 g
- Delay: 0.0 to 72.0 hours

#### Product Storage Rules
Safe temperature ranges for 12 product categories (Vaccines, Medicines, Dairy, Frozen Foods, Seafood, Fresh Fruits, Fresh Vegetables, Meat, Poultry, Ice Cream, Chocolate, Bakery Products).

#### API Configuration
- Host: configurable via `API_HOST` env variable (default: `0.0.0.0`)
- Port: configurable via `API_PORT` env variable (default: `8000`)
- Debug mode: configurable via `API_DEBUG` env variable
- CORS origins: configurable via `ALLOWED_ORIGINS` env variable

#### Financial Parameters
- Currency: configurable via `CURRENCY` env variable (default: INR)
- Delay cost per hour: `DELAY_COST_PER_HOUR` (default: 500.0)
- Spoilage cost percentage: `SPOILAGE_COST_PERCENTAGE` (default: 0.15)
- Fuel cost per liter: `FUEL_COST_PER_LITER` (default: 90.0)
- Insurance cost percentage: `INSURANCE_COST_PERCENTAGE` (default: 0.02)

### `backend/config/business_rules.py`

Domain-specific business logic constants organized in 7 sections:

1. **Temperature Rules**: Safe, Warning, and Critical range boundaries
2. **Humidity, Battery & Delay Rules**: Threshold-based classifications
3. **Risk Score Rules**: Score ranges for Low/Medium/High/Critical categories
4. **Financial Rules**: Product values, spoilage percentages, loss percentages by risk tier
5. **Recommendation Rules**: Severity mappings, recommendation text for 7 tiers
6. **Dashboard KPI Rules**: Performance tiers with color coding and severity

### `backend/config/logging_config.py`

Configures structured logging with:
- Console handler (stdout) at configurable log level
- Rotating file handler (10 MB max, 5 backups)
- Standardized format: `%(asctime)s | %(levelname)s | %(name)s | %(message)s`
- Graceful fallback to console-only if log directory is unavailable

---

## 4. Scripts (Pipeline Modules)

### Pipeline Stage Details

#### Stage 1: `sensor_generator.py`
**Input**: Configuration parameters (`RANDOM_SEED=42`, `DEFAULT_RECORDS=1000`)
**Process**: Uses NumPy random distributions to generate realistic sensor readings with configurable excursion probabilities
**Output**: `backend/data/raw/sensor_data.csv` (26 columns)

#### Stage 2: `data_cleaning.py`
**Input**: Raw sensor CSV
**Process**: Column standardization, numeric coercion, range validation against business rules, removal of invalid rows
**Output**: `backend/data/processed/processed_sensor_data.csv`

#### Stage 3: `feature_engineering.py`
**Input**: Cleaned sensor data
**Process**: 7 feature groups (Temperature, Humidity, Battery, Shock, Delay, Trip, Dashboard) producing 40+ engineered features
**Output**: `backend/data/exports/final_dashboard_data.csv`

#### Stage 4: `risk_assessment.py`
**Input**: Engineered features
**Process**: 6 dimension-level risk scores → weighted composite → category/priority/description assignment
**Output**: Updated `final_dashboard_data.csv` with 12 risk columns

#### Stage 5: `financial_loss.py`
**Input**: Risk-assessed data
**Process**: Inventory valuation, spoilage calculation, financial loss estimation, insurance/recovery analysis
**Output**: Updated `final_dashboard_data.csv` with 19 financial columns

#### Stage 6: `recommendation_engine.py`
**Input**: Financially-assessed data
**Process**: 8 recommendation types based on risk scores and excursion flags; severity and escalation mapping
**Output**: Updated `final_dashboard_data.csv` with 15 recommendation columns

#### Stage 7: `business_insights.py`
**Input**: Finalized dashboard dataset
**Process**: 30+ KPIs, 6 stakeholder summaries, business insights, financial/operational/quality summaries
**Outputs**: `executive_summary.csv`, `business_insights.csv`, `financial_summary.csv`

#### Stage 8: `export_data.py`
**Input**: All generated datasets
**Process**: Validation, CSV export, Excel export, metadata JSON generation
**Outputs**: CSV + XLSX copies in `backend/data/exports/reports/output/`

---

## 5. Services Layer

Services are lightweight wrappers that bridge API endpoints with pipeline scripts.

### Service Architecture

| Service | File | API Endpoint | Wraps |
|---------|------|--------------|-------|
| `AnalyticsService` | `analytics_service.py` | `POST /analytics/run` | `pipeline.run_complete_pipeline()` |
| `RiskService` | `risk_service.py` | `POST /risk/run` | `risk_assessment.main()` |
| `RecommendationService` | `recommendation_service.py` | `POST /recommendation/run` | `recommendation_engine.main()` |
| `AlertService` | `alert_service.py` | `GET /alerts` | Dashboard CSV → alert generation |
| `DashboardService` | `dashboard_service.py` | `GET /dashboard/final-data` | Dashboard CSV reader |

### Service Patterns

All services follow a consistent pattern:
1. Receive request from API route
2. Invoke the underlying pipeline script
3. Interpret exit codes (0 = success, non-zero = failure)
4. Return structured response to API layer

The AlertService is the most complex, implementing:
- Column validation against expected schema
- Vectorized flag processing for performance
- Severity-sorted alert generation
- Configurable result limiting

---

## 6. Schemas (Pydantic Models)

All API contracts are validated using Pydantic v2 models.

### Analytics Schemas (`backend/schemas/analytics.py`)

| Model | Fields | Purpose |
|-------|--------|---------|
| `AnalyticsRunRequest` | (empty, reserved) | Pipeline trigger request |
| `PipelineStepDetail` | step_name, status, start_time_utc, end_time_utc, execution_time_seconds, error_message | Per-step execution detail |
| `PipelineSummary` | project, version, overall_success, total_execution_time_seconds, completed_steps, failed_steps, steps | Full execution summary |
| `AnalyticsRunResponse` | success, status, exit_code, message, summary (optional) | Pipeline trigger response |

### Alert Schemas (`backend/schemas/alerts.py`)

| Model | Fields | Purpose |
|-------|--------|---------|
| `AlertItem` | alert_id, severity, label, message, timestamp, shipment_id | Single alert entry |
| `AlertQueryParams` | limit (1–1000) | Query parameter validation |
| `AlertListResponse` | success, message, count, total_active (optional), alerts | Paginated alert list |

### Dashboard Schemas (`backend/schemas/dashboard.py`)

| Model | Fields | Purpose |
|-------|--------|---------|
| `DashboardDataResponse` | success, message, csv | Raw CSV response |
| `DashboardKPIEntry` | kpi, value, label (optional), severity (optional) | KPI display entry |
| `DashboardOverview` | total_shipments, average_risk_score, critical_shipments, temperature_excursions, humidity_excursions, battery_issues, delay_issues | High-level summary |

### Recommendation Schemas (`backend/schemas/recommendation.py`)

| Model | Fields | Purpose |
|-------|--------|---------|
| `RecommendationRunRequest` | (empty, reserved) | Recommendation trigger request |
| `RecommendationRunResponse` | success, status, exit_code, message | Trigger response |
| `RecommendationItem` | shipment_id, recommendation, severity, immediate_action, category (optional) | Single recommendation |
| `RecommendationListResponse` | success, message, count, recommendations | Paginated recommendation list |

### Risk Schemas (`backend/schemas/risk.py`)

| Model | Fields | Purpose |
|-------|--------|---------|
| `RiskRunRequest` | (empty, reserved) | Risk trigger request |
| `RiskRunResponse` | success, status, exit_code, message | Trigger response |
| `RiskCategoryCount` | category, count, percentage (optional) | Category distribution |
| `RiskScoreDistribution` | minimum, maximum, average, median (optional) | Score statistics |
| `RiskSummary` | total_shipments, critical_count, high_count, medium_count, low_count, average_risk_score, distribution (optional) | Aggregated risk |
| `RiskAssessmentDetail` | shipment_id, overall_risk_score, risk_category, risk_priority, temperature_risk_score, humidity_risk_score, battery_risk_score, delay_risk_score | Per-shipment detail |

---

## 7. Utils Module

### `backend/utils/__init__.py`
Exports utility functions for project-wide use:
- `coerce_numeric()` – Safely converts DataFrame columns to numeric
- `setup_logging()` – Configures consistent logging across modules

### `backend/utils/dataframe_utils.py`
DataFrame helper functions for common operations:
- Column validation and type coercion
- Missing value handling strategies

### `backend/utils/file_utils.py`
File system utilities:
- Path resolution and directory creation
- File existence checks with logging

### `backend/utils/validation_utils.py`
Data validation utilities:
- Range validation against business rule thresholds
- Schema validation helpers

---

## 8. Middleware

Registered via `register_middleware()` in `backend/middleware/__init__.py`.

Current middleware includes:
- **CORS Middleware**: Configured via `ALLOWED_ORIGINS` environment variable (default: localhost origins)
- **Logging Middleware**: Request/response logging for audit trail

Future-ready middleware stubs:
- Error handling middleware
- Request timing middleware
- Authentication middleware

---

## 9. Pipeline Controller

The pipeline controller (`backend/scripts/pipeline.py`) orchestrates all 8 analytics stages with:

### Core Components

**`PipelineStepResult`** (dataclass):
- `step_name`: Human-readable step identifier
- `status`: "Completed" or "Failed"
- `start_time` / `end_time`: UTC timestamps
- `execution_time_seconds`: Wall-clock duration
- `error_message`: Error detail on failure

**`run_pipeline_step()`**:
- Generic executor that wraps any callable with timing
- Handles exceptions gracefully, capturing error messages
- Returns structured `PipelineStepResult`

**`run_complete_pipeline()`**:
- Executes stages in order: Sensor Generator → Data Cleaning → Feature Engineering → Risk Assessment → Financial Loss → Recommendation Engine → Business Insights → Export Data
- Stops on first failure (critical stages)
- Generates comprehensive summary with per-step timing

### Execution Flow

```
run_complete_pipeline()
  │
  ├── run_pipeline_step(sensor_generator.main)
  ├── run_pipeline_step(data_cleaning.main)
  ├── run_pipeline_step(feature_engineering.main)
  ├── run_pipeline_step(risk_assessment.main)
  ├── run_pipeline_step(financial_loss.main)
  ├── run_pipeline_step(recommendation_engine.main)
  ├── run_pipeline_step(business_insights.main)
  ├── run_pipeline_step(export_data.main)
  │
  └── generate_pipeline_summary() → print_pipeline_summary()
```

### Trigger Methods

| Method | Command | Use Case |
|--------|---------|----------|
| **CLI** | `python backend/scripts/pipeline.py` | Direct execution, scheduling |
| **REST API** | `POST /analytics/run` | Remote execution, automation |
| **Programmatic** | `pipeline.run_complete_pipeline(logger)` | Integration into other systems |

---

## 10. Logging System

### Configuration

Defined in `backend/config/logging_config.py` and deployed through `build_production_logging_config()`.

### Log Outputs

| Handler | Destination | Format | Level |
|---------|-------------|--------|-------|
| Console | stdout | `%(asctime)s | %(levelname)s | %(name)s | %(message)s` | INFO |
| File | `backend/logs/atmosync.log` | Same format | INFO |

### File Rotation

- **Max file size**: 10 MB (`LOG_MAX_BYTES`)
- **Backup count**: 5 rotated files (`LOG_BACKUP_COUNT`)
- **Encoding**: UTF-8

### Logger Name

All modules use the project-scoped logger: `LOGGER_NAME = "AtmoSyncAI"`

### Graceful Degradation

If the log directory cannot be created, the system falls back to console-only logging without crashing.

---

## 11. Error Handling

### Pipeline-Level Error Handling

- Each step is wrapped in `try/except` within `run_pipeline_step()`
- Errors are captured in `PipelineStepResult.error_message`
- The pipeline stops on the first critical stage failure
- A structured summary is always generated, even on failure

### API-Level Error Handling

- All route handlers include `try/except` blocks
- Known errors (e.g., `FileNotFoundError`) return appropriate HTTP status codes:
  - `404 Not Found` for missing datasets
  - `500 Internal Server Error` for unexpected failures
- HTTP exceptions include descriptive `detail` messages

### Data Validation Errors

- Required column checks raise `ValueError` with descriptive messages
- Missing value warnings are logged but do not fail execution
- Numeric coercion uses `errors='coerce'` to avoid hard failures on type mismatches

---

## 12. Business Rules Engine

The business rules engine (`backend/config/business_rules.py`) centralizes all domain logic.

### Risk Score Classification

```python
RISK_SCORE_RANGES = {
    "Low Risk":      {"min_score": 0.0,  "max_score": 24.9},
    "Medium Risk":   {"min_score": 25.0, "max_score": 49.9},
    "High Risk":     {"min_score": 50.0, "max_score": 74.9},
    "Critical Risk": {"min_score": 75.0, "max_score": 100.0},
}
```

### Product Values

32 products mapped to unit prices (INR) ranging from ₹10 (Onion) to ₹1,200 (COVID-19 Vaccine).

### Financial Rules

| Rule | Value | Threshold |
|------|-------|-----------|
| Spoilage % (Low Risk) | 2% | - |
| Spoilage % (Critical Risk) | 28% | - |
| Loss % (Low Risk) | 3% | - |
| Loss % (Critical Risk) | 40% | - |
| Insurance Threshold | 15% of inventory | ≥ threshold |
| Recovery Threshold | 7% of inventory | ≥ threshold |

### Recommendation Tiers

7 tiers with severity mapping and contextual action text for conditions including Normal, Warning, Critical, Battery Low, Shipment Delay, Temperature Issue, and Humidity Issue.

---

## 13. CSV Data Flow

### Data Lineage

```
sensor_generator.py
    ↓ sensor_data.csv
data_cleaning.py
    ↓ processed_sensor_data.csv
feature_engineering.py
    ↓ final_dashboard_data.csv (initial)
risk_assessment.py
    ↓ final_dashboard_data.csv (+ risk columns)
financial_loss.py
    ↓ final_dashboard_data.csv (+ financial columns)
recommendation_engine.py
    ↓ final_dashboard_data.csv (+ recommendation columns)
business_insights.py
    ├── executive_summary.csv
    ├── business_insights.csv
    └── financial_summary.csv
export_data.py
    ├── final_dashboard_data.csv (copy)
    ├── final_dashboard_data.xlsx
    ├── executive_summary.csv (copy)
    ├── executive_summary.xlsx
    ├── business_insights.csv (copy)
    ├── business_insights.xlsx
    ├── financial_summary.csv (copy)
    ├── financial_summary.xlsx
    └── export_summary.json
```

### File Relationships

| File | Created By | Consumed By | Columns (approx) |
|------|-----------|-------------|-------------------|
| `sensor_data.csv` | stage 1 | stage 2 | 26 |
| `processed_sensor_data.csv` | stage 2 | stage 3 | 26 |
| `final_dashboard_data.csv` | stage 3+ | stages 4-6, Power BI | 107 |
| `executive_summary.csv` | stage 7 | Power BI | 2 |
| `business_insights.csv` | stage 7 | Power BI | 2 |
| `financial_summary.csv` | stage 7 | Power BI | 2 |

---

## 14. Power BI Integration

### Dashboard File

**Location**: `backend/dashboard/AtmoSync_AI.pbix`

### Data Source Configuration

The `.pbix` file is configured to import data from 4 CSV sources:

| Table | Source File | Connection Mode |
|-------|-------------|-----------------|
| `DashboardData` | `backend/data/exports/final_dashboard_data.csv` | Import |
| `ExecutiveSummary` | `backend/reports/output/executive_summary.csv` | Import |
| `BusinessInsights` | `backend/reports/output/business_insights.csv` | Import |
| `FinancialSummary` | `backend/reports/output/financial_summary.csv` | Import |

### Dashboard Pages

| Page | Data Source | Focus |
|------|-------------|-------|
| Executive Dashboard | `final_dashboard_data.csv` | High-level KPIs and risk overview |
| Operational Dashboard | `final_dashboard_data.csv` | Sensor monitoring and logistics |
| Risk Dashboard | `final_dashboard_data.csv` | Risk analysis and excursions |
| Financial Dashboard | `final_dashboard_data.csv` + `financial_summary.csv` | Financial exposure and recovery |
| Business Insights | All 4 CSVs | Stakeholder narratives and KPIs |

### Refresh Workflow

1. Run pipeline: `python backend/scripts/pipeline.py`
2. Open `AtmoSync_AI.pbix` in Power BI Desktop
3. Click **Refresh** (Ctrl+R) in Home tab
4. All visuals update automatically

---

## 15. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_HOST` | `0.0.0.0` | FastAPI server bind address |
| `API_PORT` | `8000` | FastAPI server port |
| `API_DEBUG` | `false` | Enable debug mode |
| `API_RELOAD` | `false` | Enable auto-reload (development) |
| `API_PREFIX` | `/api/v1` | Global URL prefix |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000,http://localhost:8000` | CORS allowed origins |
| `ALERT_TEMP_HIGH_C` | `12.0` | High temperature alert threshold |
| `ALERT_TEMP_LOW_C` | `-15.0` | Low temperature alert threshold |
| `ALERT_HUMIDITY_HIGH` | `90.0` | High humidity alert threshold |
| `ALERT_HUMIDITY_LOW` | `10.0` | Low humidity alert threshold |
| `ALERT_BATTERY_LOW` | `20.0` | Low battery alert threshold |
| `ALERT_DELAY_HIGH_H` | `12.0` | High delay alert threshold |
| `CURRENCY` | `INR` | Currency code for financial calculations |
| `DELAY_COST_PER_HOUR` | `500.0` | Estimated cost per hour of delay |
| `SPOILAGE_COST_PERCENTAGE` | `0.15` | Default spoilage cost fraction |
| `FUEL_COST_PER_LITER` | `90.0` | Fuel price per liter |
| `INSURANCE_COST_PERCENTAGE` | `0.02` | Insurance premium fraction |

Environment variables are loaded via `python-dotenv` from a `.env` file (if present) in the project root.

---

## 16. Deployment Notes

### Prerequisites

- Python 3.12+
- pip (package manager)
- (Optional) Power BI Desktop for dashboard

### Installation

```bash
# Clone repository
git clone <repository-url>
cd AtmoSync_AI

# Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Start server
uvicorn backend.main:app --reload
```

### Running the Pipeline

```bash
# Full pipeline via CLI
python backend/scripts/pipeline.py

# Full pipeline via API
curl -X POST http://localhost:8000/analytics/run

# Individual stages
python backend/scripts/sensor_generator.py
python backend/scripts/data_cleaning.py
# ... etc.
```

### API Documentation (Auto-generated)

| Interface | URL |
|-----------|-----|
| Swagger UI | `http://localhost:8000/docs` |
| ReDoc | `http://localhost:8000/redoc` |

### Production Considerations

1. Set `API_DEBUG=false` and `API_RELOAD=false` in production
2. Configure `ALLOWED_ORIGINS` for the frontend domain
3. Set up a process manager (e.g., `supervisor`, `systemd`) for the FastAPI server
4. Schedule periodic pipeline execution via cron/Task Scheduler
5. Monitor logs at `backend/logs/atmosync.log`
6. Consider database migration for persistent storage at scale

---

<p align="center">
  <b>AtmoSync AI</b> — Intelligent Cold Chain Analytics for a Safer Supply Chain.
</p>

