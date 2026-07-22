# 🌡️ AtmoSync AI — Project Report

<p align="center">
  <b>Smart Cold Chain Monitoring & Spoilage Risk Analytics System</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.111+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Pandas-2.2+-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas">
  <img src="https://img.shields.io/badge/NumPy-2.0+-013243?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy">
  <img src="https://img.shields.io/badge/scikit--learn-1.5+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="scikit-learn">
  <img src="https://img.shields.io/badge/Power%20BI-Dashboard-F2C811?style=for-the-badge&logo=powerbi&logoColor=black" alt="Power BI">
</p>

---

## 📑 Table of Contents

1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Folder Structure](#6-folder-structure)
7. [Complete Data Flow](#7-complete-data-flow)
8. [Dataset Description](#8-dataset-description)
9. [Feature Engineering](#9-feature-engineering)
10. [Risk Assessment](#10-risk-assessment)
11. [Financial Loss Analysis](#11-financial-loss-analysis)
12. [Recommendation Engine](#12-recommendation-engine)
13. [Business Insights](#13-business-insights)
14. [Power BI Dashboard](#14-power-bi-dashboard)
15. [Browser Dashboard](#15-browser-dashboard)
16. [Results](#16-results)
17. [Limitations](#17-limitations)
18. [Future Enhancements](#18-future-enhancements)
19. [Conclusion](#19-conclusion)

---

## 1. Introduction

**AtmoSync AI** is a production-grade, end-to-end analytics platform designed for cold chain logistics monitoring and spoilage risk assessment. The system simulates IoT sensor data from temperature-controlled shipments, executes a modular analytics pipeline for data processing, risk evaluation, and financial loss estimation, generates actionable business recommendations, and exports processed datasets to an interactive Power BI dashboard for decision intelligence.

The platform is built to address the critical challenges faced by cold chain logistics operations in India, where temperature-sensitive products such as vaccines, medicines, dairy products, seafood, and frozen foods require continuous monitoring to maintain quality and safety standards throughout the supply chain.

Developed by **Sujan Pradhan**, AtmoSync AI leverages a **FastAPI** backend with **Pandas/NumPy** data processing, **scikit-learn**-ready architecture, and **Pydantic**-validated API contracts to provide a scalable, production-ready foundation for cold chain analytics.

---

## 2. Problem Statement

Cold chain logistics involves the transportation and storage of temperature-sensitive products under controlled environmental conditions. In India, the cold chain industry faces several critical challenges:

### Key Challenges

| Challenge | Impact |
|-----------|--------|
| **Temperature Excursions** | Breaches in temperature control can spoil entire shipments of vaccines, medicines, and perishable goods |
| **Lack of Real-Time Visibility** | Many cold chain operators lack end-to-end visibility into shipment conditions during transit |
| **Manual Monitoring** | Reliance on manual temperature logging introduces errors and delays in response |
| **Financial Loss Quantification** | Without systematic risk assessment, financial losses from spoilage are difficult to predict and mitigate |
| **Compliance Requirements** | Regulatory standards (e.g., WHO Vaccine Cold Chain standards, FSSAI guidelines) require documented temperature monitoring |
| **Data Fragmentation** | Sensor data, logistics information, and financial records often exist in isolated systems |

### Problem Statement

> *"How can we build an intelligent, data-driven platform that simulates IoT sensor data for cold chain shipments, assesses spoilage risk across multiple dimensions, quantifies financial exposure, generates actionable recommendations, and provides executive-level visibility through interactive dashboards — all within a modular, API-first architecture?"*

---

## 3. Objectives

### Primary Objectives

| # | Objective | Implementation |
|---|-----------|----------------|
| 1 | **Simulate IoT sensor data** | Generate realistic temperature, humidity, battery, shock, vibration, and delay data for cold chain shipments across 30+ Indian cities |
| 2 | **Clean and preprocess data** | Implement data validation, range checking, missing value handling, and column standardization |
| 3 | **Extract engineered features** | Compute 40+ features including excursion flags, deviation scores, health metrics, compliance indicators, and probability scores |
| 4 | **Assess spoilage risk** | Calculate dimension-level risk scores (0–100) for temperature, humidity, battery, shock, vibration, and delay; aggregate into composite risk index |
| 5 | **Quantify financial loss** | Estimate inventory value, spoilage costs, insurance eligibility, recovery amounts, and net financial loss |
| 6 | **Generate recommendations** | Produce contextual, severity-ranked corrective actions across 8 recommendation categories |
| 7 | **Create business insights** | Compute executive KPIs, stakeholder-specific narratives, operational and quality summaries |
| 8 | **Export to Power BI** | Deliver processed datasets in CSV format for Power BI dashboard consumption |

### Secondary Objectives

| # | Objective |
|---|-----------|
| 9 | Provide RESTful API endpoints for pipeline execution and data retrieval |
| 10 | Implement Pydantic-validated request/response schemas |
| 11 | Configure production-grade logging with rotating file handlers |
| 12 | Support modular, independent execution of each pipeline stage |

---

## 4. Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Python | 3.12+ | Core programming language |
| **Web Framework** | FastAPI | ≥ 0.111 | RESTful API development |
| **ASGI Server** | Uvicorn | ≥ 0.30 | Production ASGI server |
| **Data Processing** | Pandas | ≥ 2.2 | DataFrame operations and analytics |
| **Numerical Computing** | NumPy | ≥ 2.0 | Array operations and statistical functions |
| **Machine Learning** | scikit-learn | ≥ 1.5 | Future ML model integration (architecture ready) |
| **Data Validation** | Pydantic | ≥ 2.9 | API request/response schema validation |
| **Data Generation** | Faker | ≥ 30.0 | Realistic simulated data generation |
| **Visualization** | Matplotlib, Plotly | Latest | Python-side visualization support |
| **Business Intelligence** | Power BI Desktop | Latest | Interactive dashboard and data visualization |
| **Excel Export** | OpenPyXL, XlsxWriter | Latest | Excel format report generation |
| **Environment Management** | python-dotenv | ≥ 1.0 | Environment variable configuration |
| **Logging** | Python Logging | Standard Library | Structured logging with rotation |
| **Testing** | pytest, httpx | Latest | Unit and integration testing |
| **Frontend** | React + Vite + Tailwind CSS | Latest | Web-based user interface |

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React SPA)                             │
│                    Future web-based user interface                       │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ HTTP/REST
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          FASTAPI API LAYER                               │
│                                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Analytics│ │Dashboard │ │  Alerts  │ │   Risk   │ │Recommendation│  │
│  │   API    │ │   API    │ │   API    │ │   API    │ │     API      │  │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────────┤  │
│  │  Health  │ │ Shipment │ │   Map    │ │ Reports  │ │              │  │
│  │   API    │ │   API    │ │   API    │ │   API    │ │              │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│                                                                          │
│                     Middleware (CORS, Logging, Error Handling)           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVICE LAYER                                   │
│                                                                          │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────────┐ │
│  │ Analytics Service │ │ Dashboard Service│ │    Alert Service        │ │
│  ├──────────────────┤ ├──────────────────┤ ├──────────────────────────┤ │
│  │ Recommendation   │ │    Risk Service  │ │                          │ │
│  │    Service       │ │                  │ │                          │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────────────┘ │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        ANALYTICS PIPELINE                                │
│                                                                          │
│  Sensor Generator → Data Cleaning → Feature Engineering → Risk          │
│  Assessment → Financial Loss → Recommendation Engine → Business         │
│  Insights → Export Data                                                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     DATA STORAGE & OUTPUT                                 │
│                                                                          │
│  ┌────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │   Raw Data     │  │  Processed Data   │  │    Exports & Reports     │ │
│  │  (CSV Files)   │  │   (CSV Files)     │  │   (CSV, Excel, JSON)    │ │
│  └────────────────┘  └──────────────────┘  └──────────────────────────┘ │
│                                                    │                    │
│                              ┌─────────────────────┼──────────────────┐ │
│                              ▼                     ▼                  │ │
│  ┌──────────────────────────────────┐  ┌──────────────────────────┐   │ │
│  │  FastAPI Browser Dashboard       │  │   Power BI Dashboard     │   │ │
│  │  (React SPA via GET /dashboard/  │  │   (AtmoSync_AI.pbix)     │   │ │
│  │   final-data)                    │  │                          │   │ │
│  └──────────────────────────────────┘  └──────────────────────────┘   │ │
│                              Both dashboards consume the same          │ │
│                              final_dashboard_data.csv (Single Source   │ │
│                              of Truth)                                 │ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Layer | Responsibility |
|-------|----------------|
| **API Layer** | Exposes RESTful endpoints for pipeline execution, data retrieval, alert listing, and system health checks. Validates all inputs/outputs via Pydantic schemas. |
| **Service Layer** | Lightweight wrappers that bridge API routes with pipeline scripts. Handles error mapping and exit code interpretation. |
| **Pipeline Layer** | Core analytics engine. Eight sequential stages process data from raw sensor generation through to final export. |
| **Storage Layer** | CSV-based data persistence with organized directory structure for raw, processed, and exported datasets. |

---

## 6. Folder Structure

```
AtmoSync_AI/
│
├── backend/                              # FastAPI Backend Application
│   ├── __init__.py
│   ├── main.py                           # Application entry point & router registration
│   ├── requirements.txt                  # Python dependency manifest
│   │
│   ├── api/                              # REST API Route Handlers
│   │   ├── __init__.py
│   │   ├── analytics.py                  # POST /analytics/run
│   │   ├── alerts.py                     # GET /alerts
│   │   ├── dashboard.py                  # GET /dashboard/final-data
│   │   ├── health.py                     # GET /health
│   │   ├── map.py                        # GET /map/status
│   │   ├── recommendation.py             # POST /recommendation/run
│   │   ├── reports.py                    # GET /reports/status
│   │   ├── risk.py                       # POST /risk/run
│   │   └── shipment.py                   # POST /shipment/run
│   │
│   ├── schemas/                          # Pydantic Validation Models
│   │   ├── __init__.py
│   │   ├── analytics.py                  # Pipeline run/response schemas
│   │   ├── alerts.py                     # Alert item/query/response schemas
│   │   ├── dashboard.py                  # Dashboard data/KPI schemas
│   │   ├── recommendation.py             # Recommendation item/response schemas
│   │   └── risk.py                       # Risk assessment schemas
│   │
│   ├── services/                         # Business Logic Wrappers
│   │   ├── __init__.py
│   │   ├── alert_service.py              # Alert generation from dashboard CSV
│   │   ├── analytics_service.py          # Full pipeline orchestration
│   │   ├── dashboard_service.py          # Dashboard CSV reader
│   │   ├── recommendation_service.py     # Recommendation engine wrapper
│   │   └── risk_service.py               # Risk assessment wrapper
│   │
│   ├── scripts/                          # Core Analytics Pipeline Modules
│   │   ├── __init__.py
│   │   ├── pipeline.py                   # Pipeline orchestrator
│   │   ├── sensor_generator.py           # Stage 1: IoT data simulation
│   │   ├── data_cleaning.py              # Stage 2: Data cleaning
│   │   ├── feature_engineering.py        # Stage 3: Feature extraction
│   │   ├── risk_assessment.py            # Stage 4: Risk scoring
│   │   ├── financial_loss.py             # Stage 5: Financial estimation
│   │   ├── recommendation_engine.py      # Stage 6: Recommendations
│   │   ├── business_insights.py          # Stage 7: KPI and insights
│   │   └── export_data.py               # Stage 8: Data export
│   │
│   ├── config/                           # Configuration Management
│   │   ├── __init__.py
│   │   ├── config.py                     # Central configuration
│   │   ├── business_rules.py             # Domain business rules
│   │   └── logging_config.py             # Logging setup
│   │
│   ├── middleware/                        # FastAPI Middleware
│   │   └── __init__.py
│   │
│   ├── database/                         # Database layer (future-ready)
│   │   ├── __init__.py
│   │   └── connection.py
│   │
│   ├── utils/                            # Utility Functions
│   │   ├── __init__.py
│   │   ├── dataframe_utils.py
│   │   ├── file_utils.py
│   │   └── validation_utils.py
│   │
│   ├── data/                             # Data Storage
│   │   ├── raw/                          # Raw sensor data
│   │   ├── processed/                    # Cleaned data
│   │   └── exports/                      # Final datasets
│   │
│   ├── dashboard/                        # Power BI
│   │   ├── AtmoSync_AI.pbix              # Power BI workbook
│   │   └── Dashboard_Guide.md            # Dashboard documentation
│   │
│   ├── reports/                          # Generated Reports
│   │   ├── output/                       # CSV reports
│   │   ├── documentation/                # Documentation files
│   │   ├── screenshots/                  # Dashboard screenshots
│   │   └── presentation/                # Presentation materials
│   │
│   ├── logs/                             # Application logs
│   ├── tests/                            # Unit tests
│   ├── notebooks/                        # Jupyter notebooks
│   ├── assets/                           # Static assets
│   └── static/                           # Served static files
│
├── frontend/                             # React Frontend Application
├── docs/                                 # Project documentation
├── powerbi/                              # Power BI supplementary files
├── .gitignore
├── TODO.md
└── README.md                             # Project README
```

---

## 7. Complete Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           COMPLETE DATA FLOW                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  📡  STAGE 1: SENSOR GENERATOR                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Input:  Configuration parameters (RANDOM_SEED=42, DEFAULT_RECORDS=1000)│  │
│  │                                                                        │  │
│  │ Process:                                                               │  │
│  │ • Generate 1000 shipment records with UUID-based IDs                   │  │
│  │ • Assign random products, categories, cities, vehicles, transports     │  │
│  │ • Generate realistic sensor values using NumPy distributions:          │  │
│  │   - Temperature: Normal distribution around safe range (-5°C to 5°C)  │  │
│  │     with 18% excursion probability                                     │  │
│  │   - Humidity: Normal distribution around safe range (30%–70%)          │  │
│  │     with 22% excursion probability                                     │  │
│  │   - Battery: Normal distribution around healthy range (40%–100%)       │  │
│  │     with 14% low-battery probability                                   │  │
│  │   - Shock: Random distribution with 28% high-shock probability         │  │
│  │   - Vibration: Gamma distribution (shape=2.0, scale=3.0)              │  │
│  │   - Delay: Normal distribution (mean=2.6h) with 30% delayed trips     │  │
│  │ • Compute trip metrics (distance, duration, fuel consumption)          │  │
│  │ • Assign sensor status (Active/Warning/Critical/Inactive)              │  │
│  │ • Assign weather conditions                                            │  │
│  │                                                                        │  │
│  │ Output: backend/data/raw/sensor_data.csv (26 columns, 1000 rows)       │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  🧹  STAGE 2: DATA CLEANING                                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Input:  backend/data/raw/sensor_data.csv                                │  │
│  │                                                                        │  │
│  │ Process:                                                               │  │
│  │ • Standardize column names (case-insensitive mapping)                  │  │
│  │ • Coerce numeric columns (Temperature, Humidity, Battery, Delay)       │  │
│  │ • Drop rows with all key sensor readings missing                        │  │
│  │ • Validate sensor ranges against business rules:                       │  │
│  │   - Temperature: Safe (-5°C to 5°C), Warning, Critical ranges          │  │
│  │   - Humidity: Safe (30%–70%), Warning, Critical ranges                 │  │
│  │   - Battery: Safe (40%–100%), Critical (0%–19%) valid bounds          │  │
│  │   - Delay: Safe (0–4h), Warning (4.1–12h), Critical (12.1+h)          │  │
│  │ • Remove invalid rows that fall outside all defined ranges              │  │
│  │ • Format timestamps as strings                                          │  │
│  │                                                                        │  │
│  │ Output: backend/data/processed/processed_sensor_data.csv               │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ⚙️  STAGE 3: FEATURE ENGINEERING                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Input:  backend/data/processed/processed_sensor_data.csv                │  │
│  │                                                                        │  │
│  │ Process:                                                               │  │
│  │ • Temperature features: Deviation, Excursion Flag (0/1), Band          │  │
│  │ • Humidity features: Deviation, Excursion Flag (0/1), Band             │  │
│  │ • Battery features: Health Score, Status, Low Flag (0/1)               │  │
│  │ • Shock features: Severity (0–3), High Flag (0/1)                      │  │
│  │ • Delay features: Category (Safe/Warning/Critical), Flag (0/1)         │  │
│  │ • Trip features: Average Speed, Fuel Efficiency, Distance Category     │  │
│  │ • Sensor health: Vibration Severity, Health Score, Operational Status  │  │
│  │ • Dashboard features: Weather Impact, Cold Chain Compliance,           │  │
│  │   Spoilage Probability (logistic blend), Risk Indicator                │  │
│  │ • Initial Risk Category assignment based on Risk Indicator             │  │
│  │ • Operational Risk Indicator (sum of 6 flag columns)                   │  │
│  │                                                                        │  │
│  │ Output: backend/data/exports/final_dashboard_data.csv (40+ features)   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ⚠️  STAGE 4: RISK ASSESSMENT                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Input:  backend/data/exports/final_dashboard_data.csv                   │  │
│  │                                                                        │  │
│  │ Process:                                                               │  │
│  │ • Temperature Risk Score: Normalized deviation + excursion penalty      │  │
│  │ • Humidity Risk Score: Normalized deviation + excursion penalty         │  │
│  │ • Battery Risk Score: 100 - Battery Health Score                       │  │
│  │ • Shock Risk Score: Severity / 3 * 100                                 │  │
│  │ • Vibration Risk Score: Severity / 2 * 100                             │  │
│  │ • Delay Risk Score: Normalized delay hours + delay flag penalty        │  │
│  │ • Overall Risk Index: Weighted composite (25% Temp + 20% Humidity      │  │
│  │   + 15% Delay + 15% Battery + 15% Shock + 10% Vibration)              │  │
│  │ • Risk Category: Low (0–24.9), Medium (25–49.9), High (50–74.9),      │  │
│  │   Critical (75–100)                                                    │  │
│  │ • Risk Priority: P4 (Low), P3 (Medium), P2 (High), P1 (Critical)      │  │
│  │ • Sub-risk categories: Spoilage, Quality, Logistics, Operational       │  │
│  │ • Financial/Spoilage Risk Indicators                                   │  │
│  │                                                                        │  │
│  │ Output: backend/data/exports/final_dashboard_data.csv (updated)        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  💰  STAGE 5: FINANCIAL LOSS                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Input:  backend/data/exports/final_dashboard_data.csv (risk-assessed)   │  │
│  │                                                                        │  │
│  │ Process:                                                               │  │
│  │ • Estimated Quantity: Derived from trip distance and duration          │  │
│  │ • Product Unit Value: Mapped from PRODUCT_VALUES business rules        │  │
│  │ • Inventory Value: Unit Value × Estimated Quantity                     │  │
│  │ • Spoilage %: Risk-based (Low=2%, Medium=6%, High=14%, Critical=28%)  │  │
│  │ • Spoiled Quantity: Estimated Quantity × Spoilage Percentage           │  │
│  │ • Financial Loss: Inventory Value × Risk-based Loss %                  │  │
│  │   (Low=3%, Medium=10%, High=22%, Critical=40%)                        │  │
│  │ • Insurance Eligible: Loss ≥ 15% of Inventory Value                   │  │
│  │ • Recovery Eligible: Loss ≥ 7% of Inventory Value                     │  │
│  │ • Net Financial Loss: Financial Loss - Recovery - Insurance           │  │
│  │ • Loss Category: Low (<25%), Medium (25–50%), High (50–75%),          │  │
│  │   Severe (>75%)                                                        │  │
│  │                                                                        │  │
│  │ Output: backend/data/exports/final_dashboard_data.csv (updated)        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  📋  STAGE 6: RECOMMENDATION ENGINE                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Input:  backend/data/exports/final_dashboard_data.csv (financial)       │  │
│  │                                                                        │  │
│  │ Process:                                                               │  │
│  │ • Temperature Recommendation: Based on Temp Risk Score + Excursion     │  │
│  │ • Humidity Recommendation: Based on Humidity Risk Score + Excursion    │  │
│  │ • Battery Recommendation: Based on Battery Low Flag + Battery Risk     │  │
│  │ • Shipment Recommendation: Based on Delay Flag + Delay Risk Score      │  │
│  │ • Financial Recommendation: Based on Insurance/Recovery Eligibility    │  │
│  │ • Quality Recommendation: Based on Quality Risk Category               │  │
│  │ • Manager Recommendation: Based on Overall Risk Category               │  │
│  │ • Priority Action: First action from operational signal tier           │  │
│  │ • Final Recommendation: Aggregated action text                         │  │
│  │ • Recommendation Severity: low / medium / high                         │  │
│  │ • Escalation Level: L1 (low), L2 (high), L3 (critical)                │  │
│  │ • Immediate Action Required: Flag for high/critical severity           │  │
│  │                                                                        │  │
│  │ Output: backend/data/exports/final_dashboard_data.csv (updated)        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  📈  STAGE 7: BUSINESS INSIGHTS                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Input:  backend/data/exports/final_dashboard_data.csv (finalized)       │  │
│  │                                                                        │  │
│  │ Process:                                                               │  │
│  │ • 30+ System-wide KPIs (shipments, products, risk, financials, ops)    │  │
│  │ • Executive Summaries for 6 stakeholder personas (CEO, Operations      │  │
│  │   Manager, Supply Chain Manager, Quality Manager, Business Analyst,    │  │
│  │   Power BI Dashboard)                                                  │  │
│  │ • Business Insights: Loss categories, delayed routes, affected         │  │
│  │   products, insurance claims, recovery opportunities                   │  │
│  │ • Financial Summary: Aggregate metrics, loss breakdowns                │  │
│  │ • Operational Summary: Compliance rates, delay analysis               │  │
│  │ • Quality Summary: Excursion rates, affected products                  │  │
│  │                                                                        │  │
│  │ Outputs:                                                               │  │
│  │ • backend/reports/output/executive_summary.csv                         │  │
│  │ • backend/reports/output/business_insights.csv                         │  │
│  │ • backend/reports/output/financial_summary.csv                         │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  📤  STAGE 8: EXPORT DATA                                                     │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Input:  All CSVs from previous stages                                   │  │
│  │                                                                        │  │
│  │ Process:                                                               │  │
│  │ • Load and validate all datasets                                       │  │
│  │ • Check required columns exist                                         │  │
│  │ • Log missing values as warnings                                       │  │
│  │ • Export datasets as CSV copies to export directory                    │  │
│  │ • Export datasets as Excel (.xlsx) files                               │  │
│  │ • Generate export_summary.json with metadata (file sizes, row counts)  │  │
│  │                                                                        │  │
│  │ Outputs:                                                               │  │
│  │ • backend/data/exports/reports/output/final_dashboard_data.csv/.xlsx   │  │
│  │ • backend/data/exports/reports/output/executive_summary.csv/.xlsx      │  │
│  │ • backend/data/exports/reports/output/business_insights.csv/.xlsx     │  │
│  │ • backend/data/exports/reports/output/financial_summary.csv/.xlsx     │  │
│  │ • backend/data/exports/reports/output/export_summary.json             │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  📊  STAGE 9: POWER BI DASHBOARD                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Input:  Exported CSV files                                              │  │
│  │                                                                        │  │
│  │ Visualization:                                                         │  │
│  │ • Executive Dashboard: KPIs, risk distribution, financial exposure     │  │
│  │ • Operational Dashboard: Sensor monitoring, logistics, compliance      │  │
│  │ • Risk Dashboard: Risk scores, excursions, priority escalation         │  │
│  │ • Financial Dashboard: Loss analysis, insurance, recovery              │  │
│  │ • Business Insights Dashboard: Stakeholder narratives, KPI analysis    │  │
│  │                                                                        │  │
│  │ Output: Interactive Power BI Dashboard (AtmoSync_AI.pbix)              │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Dataset Description

The system simulates and processes shipment data across multiple dimensions:

### Geographical Scope

| Attribute | Value |
|-----------|-------|
| **Cities** | 30 Indian cities (Kolkata, Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, Pune, Ahmedabad, Jaipur, Lucknow, Patna, Bhubaneswar, Ranchi, Guwahati, Siliguri, Durgapur, Asansol, Nagpur, Indore, Bhopal, Visakhapatnam, Kochi, Coimbatore, Surat, Noida, Gurugram, Kanpur, Varanasi, Chandigarh, Srinagar) |
| **Transport Modes** | Road, Rail, Air, Sea |
| **Vehicle Types** | Refrigerated Truck, Refrigerated Van, Cold Storage Container, Reefer Trailer, Mini Reefer Truck, Insulated Container |

### Product Categories

| Category | Example Products | Storage Requirements |
|----------|-----------------|---------------------|
| Vaccines | COVID-19 Vaccine, Polio Vaccine, BCG Vaccine | -25°C to -15°C |
| Medicines | Insulin, Paracetamol Syrup | 2°C to 8°C |
| Dairy Products | Milk, Butter, Cheese, Curd, Paneer | 2°C to 6°C |
| Frozen Foods | Frozen Meat, Frozen Pizza, Frozen Peas | -25°C to -15°C |
| Seafood | Fish, Prawns, Salmon | -5°C to 2°C |
| Fresh Fruits | Apple, Banana, Orange, Grapes | 2°C to 10°C |
| Fresh Vegetables | Tomato, Potato, Onion, Carrot, Broccoli, Lettuce | 2°C to 8°C |
| Meat | Chicken, Mutton | -5°C to 2°C |
| Poultry | Poultry | -5°C to 2°C |
| Ice Cream | Ice Cream | -30°C to -18°C |
| Chocolate | Chocolate | 12°C to 20°C |
| Bakery Products | Bread, Cake | 2°C to 8°C |

### Sensor Parameters

| Sensor | Unit | Range | Distribution |
|--------|------|-------|--------------|
| Temperature | °C | -25.0 to 15.0 | Normal (82% safe, 18% excursion) |
| Humidity | % | 20.0 to 100.0 | Normal (78% safe, 22% excursion) |
| Battery | % | 0.0 to 100.0 | Normal (86% healthy, 14% low) |
| Shock | g | 0.0 to 500.0 | Uniform (72% normal, 28% high) |
| Vibration | m/s² | 0.0 to 20.0 | Gamma (shape=2.0, scale=3.0) |
| Delay | hours | 0.0 to 72.0 | Normal (70% on-time, 30% delayed) |

---

## 9. Feature Engineering

The feature engineering stage (`backend/scripts/feature_engineering.py`) extracts 40+ engineered features organized into functional groups:

### Temperature Features
| Feature | Description | Computation |
|---------|-------------|-------------|
| `Temperature Deviation` | Absolute deviation from safe midpoint (0°C) | `abs(temp - 0.0)` |
| `Temperature Excursion Flag` | Binary flag for outside safe range | `1 if temp < -5°C or temp > 5°C, else 0` |
| `Temperature Band` | Risk classification | Safe / Warning / Critical |

### Humidity Features
| Feature | Description | Computation |
|---------|-------------|-------------|
| `Humidity Deviation` | Absolute deviation from safe midpoint (50%) | `abs(humidity - 50.0)` |
| `Humidity Excursion Flag` | Binary flag for outside safe range | `1 if humidity < 30% or humidity > 70%` |
| `Humidity Band` | Risk classification | Safe / Warning / Critical |

### Battery Features
| Feature | Description | Computation |
|---------|-------------|-------------|
| `Battery Health Score` | Normalized health score (0–100) | Data-driven from safe/critical bounds |
| `Battery Status` | Operational status label | Healthy / Warning / Critical |
| `Battery Low Flag` | Binary low-battery indicator | `1 if battery ≤ 19%` |

### Shock & Vibration Features
| Feature | Description |
|---------|-------------|
| `Shock Severity` | Integer severity (0–3) based on percentile thresholds |
| `High Shock Flag` | Binary flag for shock ≥ 90th percentile |
| `Vibration Severity` | Integer severity (0–2) based on percentile thresholds |
| `High Vibration Flag` | Binary flag for vibration ≥ 90th percentile |

### Delay & Trip Features
| Feature | Description |
|---------|-------------|
| `Delay Category` | Safe / Warning / Critical based on business rules |
| `Delay Flag` | Binary flag for delay > 4 hours |
| `Average Speed` | Distance / Duration (km/h) |
| `Fuel Efficiency` | Distance / Fuel Consumption (km/liter) |
| `Distance Category` | Short / Medium / Long (percentile-based) |
| `Journey Duration Category` | Short / Medium / Long (percentile-based) |

### Dashboard & Compliance Features
| Feature | Description |
|---------|-------------|
| `Sensor Health Score` | Composite health (0–100) combining battery, shock, vibration |
| `Cold Chain Compliance Flag` | Binary: 1 if no excursions and sensor active |
| `Spoilage Probability Indicator` | Logistic blend of deviation, flag, and delay signals (0–1) |
| `Risk Indicator` | Spoilage probability scaled to 0–100 |
| `Weather Impact Indicator` | Binary flag for impactful weather conditions |
| `Operational Risk Indicator` | Count of active flags (0–6) |

---

## 10. Risk Assessment

The risk assessment stage (`backend/scripts/risk_assessment.py`) computes multi-dimensional risk scores and classifications.

### Dimension-Level Risk Scores

| Dimension | Score Range | Weight | Computation Method |
|-----------|-------------|--------|-------------------|
| Temperature | 0–100 | 25% | Normalized deviation + excursion penalty |
| Humidity | 0–100 | 20% | Normalized deviation + excursion penalty |
| Delay | 0–100 | 15% | Normalized delay hours + delay flag penalty |
| Battery | 0–100 | 15% | 100 - Battery Health Score |
| Shock | 0–100 | 15% | Severity / 3 × 100 |
| Vibration | 0–100 | 10% | Severity / 2 × 100 |

### Composite Risk Index

```
Overall Risk Index = (0.25 × Temperature Risk)
                   + (0.20 × Humidity Risk)
                   + (0.15 × Delay Risk)
                   + (0.15 × Battery Risk)
                   + (0.15 × Shock Risk)
                   + (0.10 × Vibration Risk)
```

### Risk Classification

| Category | Score Range | Priority | Description |
|----------|-------------|----------|-------------|
| 🟢 Low Risk | 0.0 – 24.9 | P4 | Conditions within acceptable cold-chain boundaries |
| 🟡 Medium Risk | 25.0 – 49.9 | P3 | Minor excursions detected; increased monitoring recommended |
| 🟠 High Risk | 50.0 – 74.9 | P2 | Significant deviation; prioritize quality checks |
| 🔴 Critical Risk | 75.0 – 100.0 | P1 | Severe cold-chain risk; quarantine and immediate escalation |

### Sub-Risk Categories

| Category | Composition |
|----------|-------------|
| Spoilage Risk | 60% Temperature + 40% Humidity |
| Quality Risk | 50% Temperature + 30% Humidity + 20% Shock |
| Logistics Risk | 70% Delay + 30% Vibration |
| Operational Risk | 50% Battery + 30% Shock + 20% Vibration |

---

## 11. Financial Loss Analysis

The financial loss stage (`backend/scripts/financial_loss.py`) quantifies the monetary impact of cold chain excursions.

### Financial Calculation Flow

```
Product Unit Value × Estimated Quantity = Inventory Value
                                                   │
                                                   ▼
                              Inventory Value × Spoilage % = Spoilage Cost
                                                   │
                                                   ▼
                              Inventory Value × Loss % = Financial Loss
                                                   │
                                                   ▼
                    ┌──────────────────────────────┴──────────────┐
                    ▼                                             ▼
         Insurance Eligible?                          Recovery Eligible?
         (Loss ≥ 15% of Inventory)                    (Loss ≥ 7% of Inventory)
                    │                                             │
                    ▼                                             ▼
         Insurance Claim Amount                      Recovery Amount
                    │                                             │
                    └──────────────────┬──────────────────────────┘
                                       ▼
                          Net Financial Loss = Financial Loss
                                             - Recovery Amount
                                             - Insurance Claim Amount
```

### Financial Parameters

| Parameter | Value | Source |
|-----------|-------|--------|
| Spoilage % (Low Risk) | 2% | `SPOILAGE_PERCENTAGE_BY_RISK` |
| Spoilage % (Medium Risk) | 6% | `SPOILAGE_PERCENTAGE_BY_RISK` |
| Spoilage % (High Risk) | 14% | `SPOILAGE_PERCENTAGE_BY_RISK` |
| Spoilage % (Critical Risk) | 28% | `SPOILAGE_PERCENTAGE_BY_RISK` |
| Loss % (Low Risk) | 3% | `ESTIMATED_LOSS_PERCENTAGE_BY_RISK` |
| Loss % (Medium Risk) | 10% | `ESTIMATED_LOSS_PERCENTAGE_BY_RISK` |
| Loss % (High Risk) | 22% | `ESTIMATED_LOSS_PERCENTAGE_BY_RISK` |
| Loss % (Critical Risk) | 40% | `ESTIMATED_LOSS_PERCENTAGE_BY_RISK` |
| Insurance Threshold | 15% of Inventory Value | `INSURANCE_THRESHOLD_LOSS_FRACTION` |
| Recovery Threshold | 7% of Inventory Value | `RECOVERY_THRESHOLD_LOSS_FRACTION` |

### Loss Classification

| Category | Loss % of Inventory | Severity |
|----------|-------------------|----------|
| Low | < 25% | low |
| Medium | 25% – 50% | medium |
| High | 50% – 75% | high |
| Severe | ≥ 75% | critical |

---

## 12. Recommendation Engine

The recommendation engine (`backend/scripts/recommendation_engine.py`) generates contextual, severity-ranked corrective actions based on risk and excursion signals.

### Recommendation Tiers

| Tier | Severity | Label |
|------|----------|-------|
| Normal | low | Normal |
| Warning | medium | Warning |
| Critical | high | Critical |
| Battery Low | medium | Battery Low |
| Shipment Delay | medium | Shipment Delay |
| Temperature Issue | high | Temperature Issue |
| Humidity Issue | high | Humidity Issue |

### Recommendation Categories

| Category | Trigger Condition | Example Action |
|----------|------------------|----------------|
| **Temperature** | Temp Risk Score ≥ 75 or Excursion Flag = 1 | "Inspect refrigeration equipment immediately. Move products to safe temperature-controlled environment." |
| **Humidity** | Humidity Risk Score ≥ 75 or Excursion Flag = 1 | "Inspect humidity control systems. Check packaging for moisture damage." |
| **Battery** | Battery Low Flag = 1 or Battery Risk Score ≥ 75 | "Replace or recharge sensor battery immediately. Verify sensor reconnects successfully." |
| **Shipment** | Delay Flag = 1 or Delay Risk Score ≥ 75 | "Prioritize shipment dispatch immediately. Review transport route for delays." |
| **Financial** | Recovery/Insurance Eligible | Recovery-eligible recommendations for financial mitigation |
| **Quality** | Quality Risk = Critical/High | Quality inspection and compliance recommendations |
| **Manager** | Risk Category = Critical/High | Escalation and management notification recommendations |

### Escalation Framework

| Severity | Escalation Level | Action Required |
|----------|-----------------|-----------------|
| low | L1 | Monitor at scheduled interval |
| medium | L1 | Increase monitoring frequency |
| high | L2 | Initiate immediate intervention |
| critical | L3 | Quarantine and escalate to management |

---

## 13. Business Insights

The business insights stage (`backend/scripts/business_insights.py`) generates analytics and narratives for executive decision-making.

### Dashboard KPIs (30+ metrics)

| Category | KPIs |
|----------|------|
| **Shipment** | Total Shipments, Total Products |
| **Financial** | Total Inventory Value, Total Financial Loss, Net Loss, Insurance Claims, Recovery Amounts |
| **Risk** | Average Risk Score, Critical/High/Medium/Low Counts |
| **Operational** | Average Temperature, Humidity, Battery, Delay Hours, Compliance Rates |
| **Quality** | Temperature Excursions, Humidity Excursions, Battery Issues, Delay Issues |
| **Top Items** | Top Product Category, Product, Vehicle Type, Transport Mode, Origin/Destination City |

### Executive Summaries

Six stakeholder-specific narrative summaries are generated:

| Stakeholder | Focus Area |
|-------------|------------|
| CEO | Overall business exposure, risk posture, financial impact |
| Operations Manager | Excursions, delays, sensor health, route-level issues |
| Supply Chain Manager | Temperature/humidity stability, affected lanes, transport modes |
| Quality Manager | Excursion rates, affected products, compliance trends |
| Business Analyst | Loss breakdowns, recovery opportunities, KPI monitoring |
| Power BI Dashboard | Dashboard integration notes, data source references |

### Operational & Quality Summaries

| Summary | Metrics |
|---------|---------|
| **Operational** | Average Delay, Temperature Compliance Rate, Humidity Compliance Rate, Battery Health Rate, Delay Compliance Rate, Most Delayed Route |
| **Quality** | Temperature Excursion Rate, Humidity Excursion Rate, Highest Risk Category, Top Affected Products |

---

## 14. Power BI Dashboard

The Power BI dashboard (`backend/dashboard/AtmoSync_AI.pbix`) provides interactive visualization of all pipeline outputs.

### Dashboard Pages

| Page | Purpose | Key Visuals |
|------|---------|-------------|
| **Executive Dashboard** | High-level business health for leadership | KPI cards, risk distribution donut, financial treemap, shipment trends |
| **Operational Dashboard** | Real-time sensor and logistics monitoring | Sensor gauges, geographic map, delay analysis, vehicle breakdown |
| **Risk Dashboard** | Comprehensive risk analysis | Risk score distribution, excursion counts, priority escalation, dimension breakdown |
| **Financial Dashboard** | Financial exposure and recovery analysis | Financial KPIs, loss waterfall, insurance/recovery analysis, product impact |
| **Business Insights Dashboard** | Narrative-driven stakeholder insights | Executive summaries, KPI matrix, compliance gauges, operational metrics |

### Data Source Integration

| Power BI Table | Source CSV |
|----------------|------------|
| `DashboardData` | `backend/data/exports/final_dashboard_data.csv` (107 columns) |
| `ExecutiveSummary` | `backend/reports/output/executive_summary.csv` |
| `BusinessInsights` | `backend/reports/output/business_insights.csv` |
| `FinancialSummary` | `backend/reports/output/financial_summary.csv` |

### Key Dashboard Features

- Interactive slicers for Date, Product Category, Vehicle Type, Transport Mode, Origin/Destination City, Risk Category
- Cross-filtering between visuals
- Drill-through navigation for detailed analysis
- Conditional formatting based on severity thresholds
- Color-coded KPI indicators (Green/Yellow/Red)

---

## 15. Browser Dashboard

AtmoSync AI includes a web-based **Browser Dashboard** built with **React + Vite + Tailwind CSS**, providing an interactive data visualization layer alongside the Power BI dashboard. Both dashboards consume the same `final_dashboard_data.csv` (Single Source of Truth), ensuring consistency between views.

### Browser Dashboard Pages

| Page | Route | Purpose |
|------|-------|---------|
| **Dashboard** | `/` | Overview page displaying alert summary cards (temperature, humidity, battery, delay, shock, vibration), risk category distribution pie chart, and top risky shipments table |
| **Analytics** | `/analytics` | Detailed analytics views with data tables, charts, and exportable summaries |
| **Alerts** | `/alerts` | Real-time alert monitoring page with severity-colored cards and sorting capabilities |

### Key Features

| Feature | Description |
|---------|-------------|
| **Alert Summary Cards** | Color-coded alert cards showing counts for each alert type (Temperature, Humidity, Battery, Delay, Shock, Vibration) with severity indicators (Red=High, Yellow=Medium, Blue=Info) |
| **Risk Distribution Pie Chart** | Interactive donut chart displaying the breakdown of shipments across Risk Categories (Low, Medium, High, Critical) with automatically extracted data from CSV |
| **Top Risky Shipments Table** | Tabular view of highest-risk shipments sorted by Risk Score descending, with columns for Shipment ID, Risk Category, Risk Score, Temperature, and more |
| **Responsive Design** | Mobile-responsive layout using Tailwind CSS utility classes |
| **Single Source of Truth** | Both browser and Power BI dashboards read from the same `final_dashboard_data.csv` file ensuring data consistency across all views |

### Technology Stack

| Component | Technology |
|-----------|------------|
| **Framework** | React 18+ (Vite) |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts (PieChart, BarChart, LineChart) |
| **Data Integration** | React state management with CSV parsing from FastAPI `GET /dashboard/final-data` endpoint |
| **API Layer** | Fetch API for consuming FastAPI backend endpoints |
| **Routing** | React Router DOM for SPA navigation |

---

## 16. Results

The AtmoSync AI platform delivers the following implemented outputs:

### Pipeline Outputs

| Output | Format | Location | Description |
|--------|--------|----------|-------------|
| Raw Sensor Data | CSV | `backend/data/raw/sensor_data.csv` | 1000 simulated IoT sensor records |
| Processed Data | CSV | `backend/data/processed/processed_sensor_data.csv` | Cleaned and validated records |
| Final Dashboard Dataset | CSV | `backend/data/exports/final_dashboard_data.csv` | 107-column analytical dataset |
| Executive Summary | CSV | `backend/reports/output/executive_summary.csv` | 6 stakeholder narratives |
| Business Insights | CSV | `backend/reports/output/business_insights.csv` | Structured business analytics |
| Financial Summary | CSV | `backend/reports/output/financial_summary.csv` | Aggregate financial metrics |
| Export Summary | JSON | `backend/data/exports/reports/output/export_summary.json` | Export metadata |

### API Endpoints

| Endpoint | Method | Function |
|----------|--------|----------|
| `/health` | GET | Service health check |
| `/analytics/run` | POST | Full pipeline execution |
| `/risk/run` | POST | Independent risk assessment |
| `/recommendation/run` | POST | Independent recommendation generation |
| `/alerts` | GET | Retrieve active alerts by severity |
| `/dashboard/final-data` | GET | Retrieve dashboard dataset as CSV |
| `/reports/status` | GET | Reports module status |
| `/shipment/run` | POST | Shipment processing (redirects to analytics) |
| `/map/status` | GET | Map module status |

### Dashboard

- Interactive Power BI dashboard with 5 analytical pages
- 4 CSV data sources for dashboard consumption
- Cross-filtering, slicers, and drill-through capabilities

---

## 17. Limitations

| Limitation | Description | Impact |
|------------|-------------|--------|
| **Simulated Data** | Sensor data is generated synthetically rather than from real IoT devices | Insights are based on realistic but not actual data |
| **CSV Storage** | Data is stored in CSV files rather than a relational database | Limited querying capability, no ACID transactions, potential performance issues at scale |
| **No Real-Time Processing** | Pipeline runs in batch mode; data is not streamed in real-time | Cannot support live monitoring of in-transit shipments |
| **No ML Predictions** | Risk assessment uses rule-based scoring rather than trained ML models | Proactive prediction of spoilage before excursions is not implemented |
| **No Authentication** | API endpoints currently lack authentication/authorization | Not suitable for production deployment without additional security |
| **Static Product Values** | Product unit values are hardcoded in business rules | Requires code changes to update pricing |
| **Single-Threaded Pipeline** | Pipeline executes stages sequentially without parallelization | Processing time scales linearly with data volume |

---

## 18. Future Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| **Live IoT Integration** | Replace simulated data with real IoT sensor ingestion via MQTT/WebSocket | High |
| **Database Migration** | Migrate from CSV to PostgreSQL/SQLite for persistent storage and query performance | High |
| **ML-Based Risk Prediction** | Train scikit-learn models to predict spoilage risk using historical patterns | High |
| **Real-Time Dashboard** | Implement WebSocket-based updates for real-time monitoring | Medium |
| **Authentication & Authorization** | Add JWT-based authentication and role-based access control | Medium |
| **Docker Deployment** | Containerize the application with Docker and docker-compose | Medium |
| **CI/CD Pipeline** | Set up automated testing and deployment pipeline | Medium |
| **Weather API Integration** | Integrate OpenWeatherMap for external weather risk correlation | Medium |
| **GPS Tracking** | Real-time GPS tracking with geofencing and route optimization | Low |
| **Mobile Dashboard** | Responsive Power BI dashboard optimized for mobile devices | Low |

---

## 19. Conclusion

AtmoSync AI successfully demonstrates an end-to-end cold chain monitoring and spoilage risk analytics platform that integrates IoT sensor simulation, data processing, multi-dimensional risk assessment, financial loss quantification, recommendation generation, and Power BI visualization within a modular, API-first architecture.

### Key Achievements

| Achievement | Detail |
|-------------|--------|
| **Modular Architecture** | 8-stage pipeline with independent, testable components |
| **Comprehensive Risk Assessment** | 6-dimensional risk scoring with weighted composite index |
| **Financial Integration** | End-to-end financial loss estimation with insurance and recovery analysis |
| **Actionable Recommendations** | 8 recommendation categories with severity-based escalation |
| **Executive Analytics** | Stakeholder-specific narratives and 30+ KPIs for decision support |
| **Power BI Integration** | Interactive dashboard with 5 analytical pages and cross-filtering |

The platform provides a scalable foundation that can be extended with real IoT device integration, machine learning-based predictive analytics, and cloud deployment for enterprise cold chain operations. It serves as a robust demonstration of data engineering, analytics pipeline design, API development, and business intelligence integration.

---

<p align="center">
  <b>AtmoSync AI</b> — Intelligent Cold Chain Analytics for a Safer Supply Chain.
</p>
<p align="center">
  <sub>Developed by Sujan Pradhan</sub>
</p>

