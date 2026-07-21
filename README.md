<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.111+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Pandas-2.2+-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas">
  <img src="https://img.shields.io/badge/NumPy-2.0+-013243?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy">
  <img src="https://img.shields.io/badge/scikit--learn-1.5+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="scikit-learn">
  <img src="https://img.shields.io/badge/Power%20BI-Dashboard-F2C811?style=for-the-badge&logo=powerbi&logoColor=black" alt="Power BI">
  <img src="https://img.shields.io/badge/Pydantic-2.9+-E92063?style=for-the-badge&logo=pydantic&logoColor=white" alt="Pydantic">
  <img src="https://img.shields.io/badge/Status-Production Ready-22C55E?style=for-the-badge" alt="Status">
</p>

# 🌡️ AtmoSync AI

**AI-Powered Cold Chain Shipment Monitoring & Risk Analytics Platform**

AtmoSync AI is a production-grade, end-to-end analytics platform designed for cold chain logistics operations. It simulates IoT sensor data from temperature-controlled shipments, executes a modular analytics pipeline for spoilage risk assessment and financial loss estimation, generates actionable business recommendations, and exports processed datasets to an interactive **Power BI dashboard** for real-time decision intelligence.

Built with a **FastAPI** backend, **Pandas/NumPy** data processing engine, **scikit-learn**-ready architecture, and **Pydantic**-validated contracts, AtmoSync AI provides a scalable foundation for monitoring vaccines, medicines, dairy, seafood, frozen foods, and fresh produce across the supply chain.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🚛 **Cold Chain Shipment Monitoring** | Simulates multi-sensor IoT data with temperature, humidity, battery, vibration, and shock readings across 30+ Indian cities |
| 🧠 **AI-Powered Risk Assessment** | Computes composite risk scores (0–100) across temperature, humidity, battery, and delay dimensions with multi-tier classification |
| 📋 **Shipment Recommendation Engine** | Generates context-aware, severity-ranked corrective actions based on excursion flags and risk categories |
| 📊 **Dashboard Analytics** | Exports a fully processed dataset ready for Power BI, Tableau, or custom frontend consumption |
| 🔔 **Alert Generation** | Automatically detects temperature excursions, humidity excursions, low battery, shipment delays, shock/vibration events, and critical-risk escalations |
| 🔄 **CSV Analytics Pipeline** | End-to-end pipeline from raw sensor generation → cleaning → feature engineering → risk → financials → recommendations → export |
| 📈 **Power BI Integration** | Pre-configured `.pbix` dashboard with 8+ analytical pages for executive, operational, and financial oversight |
| ⚙️ **Modular FastAPI Backend** | Well-separated API layer with dedicated routers for analytics, risk, alerts, recommendations, dashboard, map, reports, and health |
| ✅ **Pydantic Validation** | Strict request/response contracts across all API endpoints with comprehensive field metadata |
| 📝 **Structured Logging** | Production-grade rotating file + console logging with configurable log levels and retention policies |
| 🏗️ **Pipeline Execution** | Orchestrated execution controller with step-level timing, success/failure tracking, and summary reporting |
| 🚀 **Production-Ready Architecture** | CORS configuration, environment variable management, modular directory structure, and middleware support |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                   (Future SPA / Dashboard UI)                │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI API Layer                         │
│  ┌─────────┬───────────┬────────┬────────┬────────────────┐  │
│  │Analytics│ Dashboard  │ Alerts │  Risk  │ Recommendation │  │
│  │   API   │    API     │  API   │  API   │      API       │  │
│  ├─────────┼───────────┼────────┼────────┼────────────────┤  │
│  │ Health  │  Shipment  │  Map   │Reports │                │  │
│  │   API   │    API     │  API   │  API   │                │  │
│  └─────────┴───────────┴────────┴────────┴────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                             │
│  ┌───────────┬──────────────┬───────────┬──────────────────┐  │
│  │Analytics  │  Dashboard   │   Alert   │  Recommendation  │  │
│  │ Service   │   Service    │  Service  │    Service       │  │
│  ├───────────┴──────────────┴───────────┴──────────────────┤  │
│  │                    Risk Service                           │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Analytics Pipeline                          │
│                                                               │
│  Sensor Generation → Data Cleaning → Feature Engineering      │
│         → Risk Assessment → Financial Loss                    │
│         → Recommendation Engine → Business Insights           │
│         → Data Export                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Outputs / Reports / Dashboard                    │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐   │
│  │  Reports  │  │  CSV     │  │  Power BI Dashboard      │   │
│  │  (Excel)  │  │  Exports │  │  (AtmoSync_AI.pbix)      │   │
│  └──────────┘  └──────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Folder Structure

```
AtmoSync_AI/
│
├── backend/                          # FastAPI Backend Application
│   ├── main.py                       # Application entry point & router registration
│   ├── requirements.txt              # Python dependency manifest
│   │
│   ├── api/                          # REST API Layer (Route Handlers)
│   │   ├── analytics.py              # Pipeline execution endpoint
│   │   ├── alerts.py                 # Active alert retrieval endpoint
│   │   ├── dashboard.py              # Dashboard dataset endpoint
│   │   ├── health.py                 # Service health check endpoint
│   │   ├── map.py                    # Map module status endpoint
│   │   ├── recommendation.py         # Recommendation engine trigger endpoint
│   │   ├── reports.py                # Reports module status endpoint
│   │   ├── risk.py                   # Risk assessment trigger endpoint
│   │   └── shipment.py              # Shipment processing redirect endpoint
│   │
│   ├── schemas/                      # Pydantic Validation Models
│   │   ├── analytics.py              # Pipeline run request/response schemas
│   │   ├── alerts.py                 # Alert item, query params, list response schemas
│   │   ├── dashboard.py              # Dashboard data response, KPI entry, overview schemas
│   │   ├── recommendation.py         # Recommendation item, run response schemas
│   │   └── risk.py                   # Risk summary, distribution, detail schemas
│   │
│   ├── services/                     # Lightweight Business Logic Wrappers
│   │   ├── analytics_service.py      # Full pipeline orchestration wrapper
│   │   ├── alert_service.py          # Alert generation from dashboard CSV
│   │   ├── dashboard_service.py      # Dashboard CSV reader
│   │   ├── recommendation_service.py # Recommendation engine wrapper
│   │   └── risk_service.py           # Risk assessment wrapper
│   │
│   ├── scripts/                      # Core Analytics Pipeline Modules
│   │   ├── pipeline.py               # Pipeline orchestrator & step controller
│   │   ├── sensor_generator.py       # IoT sensor data simulation
│   │   ├── data_cleaning.py          # Data cleaning & preprocessing
│   │   ├── feature_engineering.py    # Feature extraction & engineering
│   │   ├── risk_assessment.py        # Composite risk scoring engine
│   │   ├── financial_loss.py         # Financial loss estimation
│   │   ├── recommendation_engine.py  # Recommendation generation engine
│   │   ├── business_insights.py      # Business KPI & insight generation
│   │   └── export_data.py            # Final dataset export
│   │
│   ├── config/                       # Configuration Management
│   │   ├── config.py                 # Central configuration (paths, API, sensors, alerts)
│   │   ├── business_rules.py         # Domain rules (risk bands, spoilage rates, thresholds)
│   │   └── logging_config.py         # Logging setup (console + rotating file)
│   │
│   ├── middleware/                    # FastAPI Middleware
│   ├── database/                     # Database layer (future-ready SQLite)
│   ├── utils/                        # Utility functions
│   ├── tests/                        # Unit tests
│   ├── assets/                       # Static assets (icons, logos)
│   ├── static/                       # Served static files
│   │
│   ├── data/                         # Data Storage
│   │   ├── raw/                      # Raw sensor data CSV
│   │   ├── processed/                # Cleaned & engineered data CSV
│   │   └── exports/                  # Final dashboard dataset & reports
│   │
│   ├── dashboard/                    # Power BI
│   │   ├── AtmoSync_AI.pbix          # Power BI Desktop workbook
│   │   └── Dashboard_Guide.md        # Dashboard user guide
│   │
│   ├── reports/                      # Generated Reports
│   │   ├── output/                   # CSV reports (business insights, executive summary)
│   │   ├── documentation/            # Report documentation
│   │   ├── screenshots/              # Dashboard screenshots
│   │   └── presentation/            # Presentation materials
│   │
│   ├── notebooks/                    # Jupyter analysis notebooks
│   └── logs/                         # Rotating application logs
│
├── frontend/                         # React Frontend Application (Vite)
├── docs/                             # Project documentation
├── powerbi/                          # Power BI supplementary files
│
├── requirements.txt                  # Root dependencies
├── TODO.md                           # Development roadmap
├── .gitignore                        # Git exclusion rules
└── README.md                         # Project documentation (this file)
```

---

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| 🐍 **Language** | Python | 3.12+ |
| ⚡ **Web Framework** | FastAPI | ≥ 0.111 |
| 🏃 **ASGI Server** | Uvicorn | ≥ 0.30 |
| 🐼 **Data Processing** | Pandas | ≥ 2.2 |
| 🔢 **Numerical Computing** | NumPy | ≥ 2.0 |
| 🤖 **Machine Learning** | scikit-learn | ≥ 1.5 (future-ready) |
| ✅ **Data Validation** | Pydantic | ≥ 2.9 |
| 📊 **Visualization** | Matplotlib, Plotly | Latest |
| 📈 **Business Intelligence** | Power BI | Desktop |
| 🎲 **Data Generation** | Faker | ≥ 30.0 |
| 📝 **Logging** | Python Logging (RotatingFileHandler) | Standard Library |
| 🗄️ **Database** | SQLite | Future-ready |
| 📋 **Excel Export** | OpenPyXL, XlsxWriter | Latest |
| 🖥️ **Frontend** | React + Vite + Tailwind CSS | Latest |

---

## 🔄 Analytics Pipeline

The system runs a sequential 8-stage analytics pipeline, with each stage producing outputs consumed by the next:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PIPELINE OVERVIEW                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📡  1. Sensor Generation                                            │
│       └── Simulates IoT sensor data (temp, humidity, battery,        │
│           vibration, shock, GPS) across Indian cities for            │
│           multiple product categories → raw/sensor_data.csv          │
│                          │                                           │
│                          ▼                                           │
│  🧹  2. Data Cleaning                                                │
│       └── Handles missing values, removes duplicates, standardizes   │
│           column names, formats timestamps, validates ranges         │
│           → data/processed/processed_sensor_data.csv                 │
│                          │                                           │
│                          ▼                                           │
│  ⚙️  3. Feature Engineering                                          │
│       └── Extracts excursion flags (temp, humidity, battery, delay,  │
│           shock, vibration), computes deviation scores, creates      │
│           derived metrics for risk computation                       │
│                          │                                           │
│                          ▼                                           │
│  ⚠️  4. Risk Assessment                                              │
│       └── Computes dimension-level risk scores (0–100) for           │
│           temperature, humidity, battery, and delay. Aggregates      │
│           into a composite score. Classifies into Low / Medium /     │
│           High / Critical Risk categories                            │
│                          │                                           │
│                          ▼                                           │
│  💰  5. Financial Loss Estimation                                    │
│       └── Calculates spoilage quantity, spoilage cost, estimated     │
│           financial loss, insurance recommendations, and recovery    │
│           analysis based on product values and risk bands            │
│                          │                                           │
│                          ▼                                           │
│  📋  6. Recommendation Engine                                        │
│       └── Generates context-aware corrective recommendations based   │
│           on risk category, excursion types, battery status, and     │
│           delay conditions. Maps to severity tiers                   │
│                          │                                           │
│                          ▼                                           │
│  📈  7. Business Insights                                            │
│       └── Computes executive KPIs, shipment health metrics,          │
│           risk distribution summaries, financial overview, and       │
│           category-level analytics                                   │
│                          │                                           │
│                          ▼                                           │
│  📤  8. Data Export                                                  │
│       └── Finalizes the complete dashboard dataset → exports to      │
│           CSV. Generates executive summary, business insights,       │
│           and financial summary reports                              │
│                          │                                           │
│                          ▼                                           │
│  📊   9. Power BI Dashboard                                          │
│       └── AtmoSync_AI.pbix consumes the exported CSV for             │
│           interactive visualization and decision intelligence        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔁 Project Workflow

```
                         ┌──────────────┐
                         │  User /  SPA  │
                         └──────┬───────┘
                                │
                    POST /analytics/run
                                │
                                ▼
                    ┌─────────────────────┐
                    │  Analytics API       │
                    │  (FastAPI Route)     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Analytics Service   │
                    │  (Service Layer)     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Pipeline Controller │
                    │  (Orchestrator)      │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
    │  Sensor Gen │ → │ Data Cleaning│ → │Feature Eng.  │
    └─────────────┘   └──────────────┘   └──────────────┘
           ▼                   ▼                   ▼
    ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
    │Risk Assess. │ → │Financial Loss│ → │Recommend.    │
    └─────────────┘   └──────────────┘   └──────────────┘
           ▼                   ▼                   ▼
    ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
    │Bus. Insights│ → │ Data Export  │   │  Alerts API  │
    └─────────────┘   └──────────────┘   └──────────────┘
           │                 │                  │
           ▼                 ▼                  ▼
    ┌───────────────────────────────────────────────┐
    │           Power BI Dashboard (.pbix)           │
    │  Executive | Temperature | Humidity | Risk     │
    │  Financial | Product | Location | Alerts       │
    └───────────────────────────────────────────────┘
```

The system can be triggered via:
1. **REST API**: `POST /analytics/run` to execute the full pipeline
2. **CLI**: `python backend/main.py` or direct pipeline invocation
3. **Individual endpoints**: Risk, Recommendation, and analytics stages can be triggered independently

---

## 📡 API Modules

| Module | Endpoint Prefix | Description |
|--------|----------------|-------------|
| 🔬 **Analytics API** | `POST /analytics/run` | Executes the complete 8-stage analytics pipeline with step-level timing and status tracking |
| 📊 **Dashboard API** | `GET /dashboard/final-data` | Returns the processed dashboard dataset as raw CSV for frontend/Power BI consumption |
| 🔔 **Alerts API** | `GET /alerts` | Retrieves active alerts sorted by severity (critical → low), including temperature, humidity, battery, delay, shock, vibration, and critical-risk alerts |
| ⚠️ **Risk API** | `POST /risk/run` | Executes the risk assessment pipeline independently (risk scoring & categorization) |
| 📋 **Recommendation API** | `POST /recommendation/run` | Triggers the recommendation engine independently |
| ❤️ **Health API** | `GET /health` | Lightweight health check returning project name, version, and status |
| 🚛 **Shipment API** | `POST /shipment/run` | Redirects to the analytics pipeline for shipment processing |
| 🗺️ **Map API** | `GET /map/status` | Returns the map module availability and data source information |
| 📑 **Reports API** | `GET /reports/status` | Returns the reporting module status and generation mode |

---

## ⚙️ Configuration

The configuration layer is organized into three dedicated modules under `backend/config/`:

### 📄 `config.py` — Central Configuration
Centralizes all environment-aware settings including:
- **Project metadata**: Name, version, author, description
- **Directory paths**: Data, reports, dashboard, logs, exports
- **CSV file paths**: Raw sensor data, processed data, final dashboard dataset
- **API configuration**: Host, port, debug mode, CORS settings, URL prefix
- **Sensor ranges**: Temperature, humidity, battery, vibration, shock, delay
- **Alert thresholds**: Temperature, humidity, battery, delay thresholds
- **GPS defaults**: Latitude/longitude precision and fallback coordinates
- **Financial parameters**: Currency, delay cost, fuel cost, insurance rates
- **Product definitions**: Categories, product names, storage temperature rules
- **Indian cities**: 30+ city database for shipment routing
- **Transport modes**: Road, Rail, Air, Sea
- **Logging defaults**: Log format, level, file rotation settings

### 📋 `business_rules.py` — Domain Business Rules
Defines the domain logic constants used across the platform:
- **Temperature rules**: Safe, warning, and critical range boundaries
- **Humidity rules**: Percentage-based safety thresholds
- **Battery rules**: Low-battery detection thresholds
- **Shipment delay rules**: Acceptable delay windows
- **Risk score bands**: Low (0–24.9), Medium (25–49.9), High (50–74.9), Critical (75–100)
- **Product values**: Unit costs for 30+ products across 8 categories
- **Spoilage rates**: Percentage by risk tier (2%–28%)
- **Financial loss rates**: Estimated loss by risk tier (3%–40%)
- **Recommendation tiers**: Severity mappings and action rules for 7 conditions
- **Dashboard KPI rules**: Performance tiers with color coding

### 🪵 `logging_config.py` — Logging Setup
Configures structured logging with:
- **Console handler**: Stdout streaming with formatted output
- **Rotating file handler**: 5 MB file size with 5 backup rotations
- **Configurable log levels**: Environment-driven log verbosity
- **Standardized format**: Timestamp | Level | Logger | Message
- **Graceful fallback**: Console-only if log directory is unavailable

---

## 🧩 Services

Services act as lightweight wrappers between the API layer and the analytics pipeline scripts:

| Service | File | Responsibility |
|---------|------|----------------|
| 📊 **Analytics Service** | `analytics_service.py` | Orchestrates the complete pipeline execution by invoking `pipeline.run_complete_pipeline()` |
| 📈 **Dashboard Service** | `dashboard_service.py` | Reads the final dashboard CSV and returns raw text for API consumption |
| 🔔 **Alert Service** | `alert_service.py` | Parses the dashboard dataset for excursion flags and constructs structured alert objects with severity ordering and ID generation |
| 📋 **Recommendation Service** | `recommendation_service.py` | Wraps the recommendation engine script with error handling and exit code management |
| ⚠️ **Risk Service** | `risk_service.py` | Wraps the risk assessment script with error handling and exit code management |

---

## 📐 Schemas

All API request/response contracts are validated using **Pydantic v2** models:

| Schema Module | Key Models | Purpose |
|--------------|-----------|---------|
| `analytics.py` | `AnalyticsRunRequest`, `PipelineStepDetail`, `PipelineSummary`, `AnalyticsRunResponse` | Pipeline trigger and execution summary with per-step timing |
| `alerts.py` | `AlertItem`, `AlertQueryParams`, `AlertListResponse` | Alert data structure with severity, label, message, and pagination |
| `dashboard.py` | `DashboardDataResponse`, `DashboardKPIEntry`, `DashboardOverview` | Dashboard dataset, KPI entries, and high-level metrics overview |
| `recommendation.py` | `RecommendationRunRequest`, `RecommendationRunResponse`, `RecommendationItem`, `RecommendationListResponse` | Recommendation engine trigger and structured recommendation output |
| `risk.py` | `RiskRunRequest`, `RiskRunResponse`, `RiskCategoryCount`, `RiskScoreDistribution`, `RiskSummary`, `RiskAssessmentDetail` | Risk assessment trigger, category distribution, score statistics, and per-shipment detail |

---

## 📥 Installation

### Prerequisites
- Python 3.12 or higher
- Git
- (Optional) Power BI Desktop for dashboard visualization

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/AtmoSync_AI.git
cd AtmoSync_AI

# 2. Create a virtual environment (recommended)
python -m venv venv

# 3. Activate the virtual environment
#    Windows:
venv\Scripts\activate
#    macOS / Linux:
# source venv/bin/activate

# 4. Install dependencies
pip install -r backend/requirements.txt

# 5. Start the FastAPI server
uvicorn backend.main:app --reload
```

The API server will be available at **http://localhost:8000**.

---

## 📚 API Documentation

AtmoSync AI provides auto-generated API documentation via two interfaces:

| Interface | URL | Description |
|-----------|-----|-------------|
| 📘 **Swagger UI** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive API playground with request/response testing |
| 📙 **ReDoc** | [http://localhost:8000/redoc](http://localhost:8000/redoc) | Clean, two-panel API reference documentation |

### Quick Start API Calls

```bash
# Health Check
curl http://localhost:8000/health

# Run Analytics Pipeline
curl -X POST http://localhost:8000/analytics/run

# Get Active Alerts
curl "http://localhost:8000/alerts?limit=20"

# Get Dashboard Dataset
curl http://localhost:8000/dashboard/final-data
```

---

## 📊 Dashboard

### Generated Dashboard Dataset

The analytics pipeline exports a comprehensive `final_dashboard_data.csv` containing the following analytical dimensions per shipment:

| Column Group | Fields |
|-------------|--------|
| 📦 **Shipment Info** | Shipment ID, Product Name, Product Category, Origin City, Destination City, Vehicle Type, Transport Mode, Timestamp |
| 🌡️ **Sensor Readings** | Temperature (°C), Humidity (%), Battery (%), Vibration (m/s²), Shock (g), Delay (hours) |
| ⚠️ **Excursion Flags** | Temperature Excursion, Humidity Excursion, Battery Low, Delay Flag, High Shock, High Vibration |
| 📊 **Risk Scores** | Overall Risk Score, Temperature Risk, Humidity Risk, Battery Risk, Delay Risk, Risk Category, Risk Priority |
| 💰 **Financial Metrics** | Product Value, Spoilage Qty, Spoilage Cost, Estimated Loss, Insurance Required, Recovery Feasible |
| 📋 **Recommendations** | Recommendation Text, Recommendation Severity, Immediate Action Flag |
| 🏢 **Business KPIs** | Shipment Health Score, KPI Tier, KPI Label |

### Power BI Integration

The `backend/dashboard/AtmoSync_AI.pbix` file is a pre-configured Power BI Desktop workbook that connects directly to the exported `final_dashboard_data.csv`. The dashboard includes **8 analytical pages**:

1. **Executive Dashboard** — High-level KPIs and overall shipment health
2. **Temperature Dashboard** — Temperature trends and excursion analysis
3. **Humidity Dashboard** — Humidity patterns and risk correlation
4. **Risk Dashboard** — Risk distribution by category and priority
5. **Financial Dashboard** — Loss analysis, cost breakdowns, and recovery metrics
6. **Product Dashboard** — Category-wise performance and spoilage analysis
7. **Location Dashboard** — Geographic heatmaps and route analytics
8. **Recommendation Dashboard** — Action items by severity and category

> **To use**: Open `AtmoSync_AI.pbix` in Power BI Desktop, ensure the pipeline has been run to generate the CSV, and refresh the data source connection.

---

## 🔮 Future Improvements

| Area | Planned Enhancement |
|------|-------------------|
| 🗄️ **Database Integration** | Migrate from CSV to SQLite/PostgreSQL for persistent storage and historical querying |
| 📡 **Live IoT Devices** | Replace simulated sensor data with real IoT device ingestion via MQTT or WebSocket |
| 🌤️ **Weather API** | Integrate OpenWeatherMap / AccuWeather APIs for external weather risk correlation |
| 🛰️ **GPS Tracking** | Real-time GPS tracking with map visualization and geofencing alerts |
| 🔔 **Real-Time Notifications** | WebSocket-based push notifications for critical alerts and escalations |
| ☁️ **Cloud Deployment** | Docker containerization with deployment to AWS/GCP/Azure with CI/CD pipelines |
| 🧠 **ML Prediction** | Train predictive spoilage models using scikit-learn for proactive risk forecasting |
| 📱 **Mobile Support** | Responsive mobile dashboard for field operations and on-the-go monitoring |

---

## 📄 License

**MIT License**

Copyright (c) 2025 Sujan Pradhan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 👨‍💻 Author

**Sujan Pradhan**  
B.Tech Artificial Intelligence & Machine Learning  
Brainware University  

[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=flat-square&logo=github)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/YOUR_PROFILE)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=flat-square&logo=gmail)](mailto:YOUR_EMAIL)

---

<p align="center">
  <b>AtmoSync AI</b> — Intelligent Cold Chain Analytics for a Safer Supply Chain.
</p>

