# 🎤 AtmoSync AI — Demonstration Script

<p align="center">
  <b>8–10 Minute Project Demonstration</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Duration-10 minutes-22C55E?style=for-the-badge" alt="Duration">
  <img src="https://img.shields.io/badge/Format-Stage by Stage-3B82F6?style=for-the-badge" alt="Format">
</p>

---

## 📋 Demo Setup

**Before Starting**:
- Ensure Python 3.12+ is installed with all dependencies
- Virtual environment is activated
- FastAPI server is running (`uvicorn backend.main:app --reload`)
- Power BI Desktop is open with `AtmoSync_AI.pbix`
- Terminal window ready for commands

**Demo Flow**: 8 stages of the analytics pipeline → Power BI Dashboard walkthrough

---

## 🎬 Demo Script

---

### Section 1: Introduction (30 seconds)

**What to Say**:
> "Welcome to the AtmoSync AI demonstration. AtmoSync AI is a Smart Cold Chain Monitoring and Spoilage Risk Analytics System built with FastAPI, Pandas, NumPy, and integrated with Power BI for visualization. The system simulates IoT sensor data from temperature-controlled shipments, runs a comprehensive analytics pipeline for risk assessment and financial loss estimation, and exports processed datasets to an interactive Power BI dashboard."

**On Screen**:
- Project README or landing page
- Tech stack badges

---

### Section 2: Project Structure Overview (45 seconds)

**What to Say**:
> "Let me walk you through the project structure. The backend is organized into several key directories. The `api/` folder contains all our RESTful route handlers. The `scripts/` folder holds the core analytics pipeline with 8 modules. The `config/` directory manages all system configuration and business rules. And the `data/` directory stores our CSV datasets at each stage of processing."

**On Screen**:
- Navigate the folder structure in VSCode or file explorer
- Highlight: `backend/api/`, `backend/scripts/`, `backend/config/`, `backend/data/`

---

### Section 3: Stage 1 — Sensor Generation (1 minute)

**What to Say**:
> "Let's start with the sensor generator. This module simulates IoT sensor data for cold chain shipments. It generates realistic readings for temperature, humidity, battery level, shock, vibration, and delay hours across 30 Indian cities. The data covers 12 product categories and 32 products, from vaccines requiring -25°C to bakery products needing 2-8°C."

**On Screen**:
- Open `backend/scripts/sensor_generator.py`
- Point out the `generate_sensor_data()` function
- Show the data distribution parameters (82% safe temperature, 78% safe humidity, etc.)
- Run: `python backend/scripts/sensor_generator.py`

**Key Points to Mention**:
- Uses NumPy random distributions with configurable seed (42)
- 1000 default records
- 18% temperature excursion probability for realistic anomalies
- UUID-based shipment and container IDs

---

### Section 4: Stage 2 — Data Cleaning (45 seconds)

**What to Say**:
> "Next, the data cleaning module processes the raw sensor data. It standardizes column names, coerces numeric types, validates sensor readings against business-defined safe ranges, and removes invalid records. For example, if a temperature reading falls outside all defined safe, warning, and critical ranges, that row is removed."

**On Screen**:
- Open `backend/scripts/data_cleaning.py`
- Show the `_clean_and_validate()` function
- Point out range validation logic
- Run: `python backend/scripts/data_cleaning.py`

**Key Points to Mention**:
- 6 required columns validated (Timestamp, Temperature, Humidity, Battery, Delay Hours, Sensor Status)
- Business rules from `config/business_rules.py` define valid ranges
- Invalid rows are dropped with logging

---

### Section 5: Stage 3 — Feature Engineering (1 minute)

**What to Say**:
> "The feature engineering stage is where we extract meaningful analytical features from the raw sensor data. We create over 40 engineered features organized into 7 groups: temperature features like deviation scores and excursion flags, humidity features, battery health scores, shock severity indicators, delay categories, trip efficiency metrics, and dashboard-specific features like cold chain compliance flags and spoilage probability indicators."

**On Screen**:
- Open `backend/scripts/feature_engineering.py`
- Scroll through the feature creation functions
- Run: `python backend/scripts/feature_engineering.py`
- Show the output CSV columns

**Key Points to Mention**:
- `Temperature Deviation`, `Humidity Deviation` — absolute distance from safe midpoint
- `Cold Chain Compliance Flag` — 1 if no excursions and sensor active
- `Spoilage Probability Indicator` — logistic blend of all risk signals
- `Operational Risk Indicator` — count of active flags (0–6)

---

### Section 6: Stage 4 — Risk Assessment (1 minute 15 seconds)

**What to Say**:
> "The risk assessment engine is the analytical core of the system. It computes risk scores across 6 dimensions: Temperature at 25% weight, Humidity at 20%, Delay at 15%, Battery at 15%, Shock at 15%, and Vibration at 10%. These are combined into a weighted Overall Risk Index ranging from 0 to 100."

**On Screen**:
- Open `backend/scripts/risk_assessment.py`
- Show the `risk_assessment_pipeline()` function
- Run: `python backend/scripts/risk_assessment.py`
- Display the risk score distribution

**Key Points to Mention**:
- 4 risk categories: Low (0–24.9), Medium (25–49.9), High (50–74.9), Critical (75–100)
- Priority levels: P1 (Critical) through P4 (Low)
- Sub-risk categories: Spoilage, Quality, Logistics, Operational
- Risk description text for business context

---

### Section 7: Stage 5 — Financial Loss (1 minute)

**What to Say**:
> "The financial loss module quantifies monetary impact. It calculates inventory value by multiplying product unit prices with estimated quantities. Then it applies risk-based spoilage percentages — 2% for Low Risk, up to 28% for Critical Risk. Financial loss is estimated using loss percentages ranging from 3% to 40%. The system also determines insurance eligibility when losses exceed 15% of inventory value, and recovery eligibility at 7%."

**On Screen**:
- Open `backend/scripts/financial_loss.py`
- Show the `financial_loss_pipeline()` function
- Run: `python backend/scripts/financial_loss.py`

**Key Points to Mention**:
- Product values from `PRODUCT_VALUES` (₹10 for Onion to ₹1,200 for COVID-19 Vaccine)
- Insurance threshold: 15% of inventory value
- Recovery threshold: 7% of inventory value
- Loss categories: Low, Medium, High, Severe

---

### Section 8: Stage 6 — Recommendation Engine (1 minute)

**What to Say**:
> "The recommendation engine generates contextual corrective actions. It produces 8 types of recommendations: Temperature, Humidity, Battery, Shipment, Financial, Quality, Manager, and Operational. Each recommendation has a severity rating — low, medium, or high — and an escalation level of L1, L2, or L3. Critical issues are flagged with 'Immediate Action Required' for prompt response."

**On Screen**:
- Open `backend/scripts/recommendation_engine.py`
- Show the recommendation tier logic
- Run: `python backend/scripts/recommendation_engine.py`

**Key Points to Mention**:
- 7 recommendation tiers: Normal, Warning, Critical, Battery Low, Shipment Delay, Temperature Issue, Humidity Issue
- Priority-based tier selection (Battery Low > Shipment Delay > Temperature Issue > Humidity Issue)
- Escalation framework: L1 (monitor), L2 (intervene), L3 (escalate)

---

### Section 9: Stages 7 & 8 — Business Insights & Export (1 minute)

**What to Say**:
> "The business insights stage generates over 30 system-wide KPIs across shipment, financial, risk, operational, and quality categories. It also produces narrative executive summaries for 6 stakeholder personas — from the CEO to the quality manager. The export stage then packages everything into CSV and Excel formats, along with a JSON metadata file describing the export."

**On Screen**:
- Open `backend/scripts/business_insights.py`
- Show the KPI generation and executive summary functions
- Run: `python backend/scripts/business_insights.py`
- Open `backend/scripts/export_data.py`
- Run: `python backend/scripts/export_data.py`
- Show the generated CSV files

**Key Points to Mention**:
- 30+ KPIs including Total Shipments, Average Risk Score, Financial Loss, Compliance Rates
- 6 stakeholder-specific executive summaries
- Operational and Quality summary payloads
- 8 exported files (4 CSV + 4 XLSX) plus JSON metadata

---

### Section 10: Full Pipeline Execution (45 seconds)

**What to Say**:
> "While we've run each stage individually, the pipeline can also execute all 8 stages sequentially through the orchestrator. This provides step-level timing, status tracking, and a comprehensive execution summary. The pipeline stops immediately if any critical stage fails, preventing cascading errors."

**On Screen**:
- Run: `python backend/scripts/pipeline.py`
- Show the pipeline execution summary output
- Alternatively: `curl -X POST http://localhost:8000/analytics/run`

**Key Points to Mention**:
- Orchestrator in `pipeline.py`
- Each step logged with start time, end time, and duration
- Fails fast on critical stage failure
- Returns exit code 0 for success, 1 for failure

---

### Section 11: API Demo (1 minute)

**What to Say**:
> "AtmoSync AI provides 9 RESTful API endpoints. Let me demonstrate a few key ones. The health check endpoint confirms the service is running. The alerts endpoint retrieves active shipment alerts sorted by severity. And the dashboard endpoint returns the processed dataset as raw CSV."

**On Screen**:
- Run API calls in terminal:

```bash
# Health Check
curl http://localhost:8000/health

# Get Alerts (limit 5)
curl "http://localhost:8000/alerts?limit=5"

# Dashboard Data (first 5 lines)
curl http://localhost:8000/dashboard/final-data | head -5
```

- Optionally show Swagger UI at `http://localhost:8000/docs`

---

### Section 12: Power BI Dashboard (1 minute 30 seconds)

**What to Say**:
> "Finally, let's look at the Power BI dashboard. Open AtmoSync_AI.pbix, click Refresh to load the latest data, and explore the 5 dashboard pages. The Executive Dashboard shows key KPIs and risk distribution. The Operational Dashboard lets us monitor sensor conditions across shipments. The Risk Dashboard provides detailed risk analysis. The Financial Dashboard quantifies losses and recovery opportunities. And the Business Insights Dashboard displays stakeholder-specific narratives."

**On Screen**:
- Open `backend/dashboard/AtmoSync_AI.pbix` in Power BI Desktop
- Click Refresh (Ctrl+R)
- Navigate through each dashboard page:
  1. Executive Dashboard — KPI cards, risk donut chart
  2. Operational Dashboard — Sensor gauges, geographic map
  3. Risk Dashboard — Score distribution, excursion tracking
  4. Financial Dashboard — Loss waterfall, insurance analysis
  5. Business Insights Dashboard — Executive summaries, KPI matrix
- Demonstrate cross-filtering by clicking a data point
- Demonstrate slicer functionality

---

### Section 13: Conclusion & Q&A (30 seconds)

**What to Say**:
> "To summarize, AtmoSync AI demonstrates an end-to-end cold chain analytics platform with modular architecture, comprehensive risk assessment, financial loss quantification, actionable recommendations, and interactive visualization. The system is production-ready, extensible, and provides a solid foundation for real-world cold chain monitoring applications. Thank you for your attention. I'm happy to answer any questions."

**On Screen**:
- Summary slide showing key achievements
- Open floor for questions

---

## 📝 Quick Reference — Demo Commands

```bash
# Activate virtual environment (Windows)
venv\Scripts\activate

# Start FastAPI server
uvicorn backend.main:app --reload

# Run individual pipeline stages
python backend/scripts/sensor_generator.py
python backend/scripts/data_cleaning.py
python backend/scripts/feature_engineering.py
python backend/scripts/risk_assessment.py
python backend/scripts/financial_loss.py
python backend/scripts/recommendation_engine.py
python backend/scripts/business_insights.py
python backend/scripts/export_data.py

# Run full pipeline
python backend/scripts/pipeline.py

# API calls
curl http://localhost:8000/health
curl -X POST http://localhost:8000/analytics/run
curl "http://localhost:8000/alerts?limit=10"
curl http://localhost:8000/dashboard/final-data

# Swagger UI
# Open http://localhost:8000/docs in browser
```

---

## ⏱️ Timing Breakdown

| Section | Duration | Cumulative |
|---------|----------|------------|
| Introduction | 30s | 0:30 |
| Project Structure | 45s | 1:15 |
| Stage 1: Sensor Generation | 1:00 | 2:15 |
| Stage 2: Data Cleaning | 0:45 | 3:00 |
| Stage 3: Feature Engineering | 1:00 | 4:00 |
| Stage 4: Risk Assessment | 1:15 | 5:15 |
| Stage 5: Financial Loss | 1:00 | 6:15 |
| Stage 6: Recommendation Engine | 1:00 | 7:15 |
| Stages 7 & 8: Insights & Export | 1:00 | 8:15 |
| Full Pipeline Execution | 0:45 | 9:00 |
| API Demo | 1:00 | 10:00 |
| Power BI Dashboard | 1:30 | 11:30 |
| Conclusion & Q&A | 0:30 | 12:00 |

> **Note**: Adjust timing based on audience interest. The Power BI dashboard section can be shortened if needed.

---

<p align="center">
  <b>AtmoSync AI</b> — Intelligent Cold Chain Analytics for a Safer Supply Chain.
</p>

