# 🌡️ AtmoSync AI — Power BI Dashboard Guide

<p align="center">
  <img src="https://img.shields.io/badge/Power%20BI-Dashboard-F2C811?style=for-the-badge&logo=powerbi&logoColor=black" alt="Power BI">
  <img src="https://img.shields.io/badge/FastAPI-0.111+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Pandas-2.2+-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas">
  <img src="https://img.shields.io/badge/Status-Production Ready-22C55E?style=for-the-badge" alt="Status">
</p>

## 📑 Table of Contents

1. [Introduction](#-introduction)
2. [Dashboard Architecture](#-dashboard-architecture)
3. [Dashboard Pages](#-dashboard-pages)
4. [Data Sources](#-data-sources)
5. [Dashboard Filters](#-dashboard-filters)
6. [KPIs](#-kpis)
7. [Visualizations](#-visualizations)
8. [Refresh Process](#-refresh-process)
9. [Folder Structure](#-folder-structure)
10. [Usage](#-usage)
11. [Future Enhancements](#-future-enhancements)

---

## 1. 📘 Introduction

The **AtmoSync AI Power BI Dashboard** is the visual analytics layer of the AtmoSync AI cold chain monitoring platform. It transforms raw IoT sensor data, risk assessments, financial loss estimates, and business recommendations into actionable, interactive visual intelligence.

### Purpose

| Objective | Description |
|-----------|-------------|
| **Monitor** | Track real-time and historical cold chain conditions across temperature, humidity, battery, shock, vibration, and delay dimensions |
| **Analyze** | Identify risk patterns, spoilage trends, and operational bottlenecks across product categories, transport modes, and geographic routes |
| **Quantify** | Measure financial exposure through inventory valuation, loss estimation, insurance eligibility, and recovery analysis |
| **Decide** | Enable data-driven decisions with executive KPIs, risk prioritization, and severity-ranked recommendations |
| **Optimize** | Improve cold chain compliance rates, reduce spoilage, and minimize financial losses through targeted interventions |

### Stakeholder Audience

| Stakeholder | Role |
|-------------|------|
| **CEO / Executive Leadership** | High-level business health, financial exposure, and strategic KPIs |
| **Operations Manager** | Day-to-day shipment tracking, sensor health, delay management |
| **Supply Chain Manager** | Route efficiency, transport mode analysis, inventory integrity |
| **Quality Assurance Manager** | Cold chain compliance, excursion analysis, spoilage risk |
| **Business Analyst** | Financial summaries, loss category breakdowns, recovery opportunities |
| **Data Analyst** | Data exploration, trend analysis, and ad-hoc insights |

---

## 2. 🏗️ Dashboard Architecture

### Data Flow

The Power BI dashboard sits at the end of an 8-stage analytics pipeline. Each stage processes data and passes it to the next, culminating in CSV exports consumed by Power BI.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ANALYTICS PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📡  1. Sensor Generator                                                 │
│       ┌──────────────────────────────────────────────────────────────┐   │
│       │ Simulates IoT sensor data for cold chain shipments across    │   │
│       │ 30+ Indian cities. Generates temperature, humidity, battery, │   │
│       │ vibration, shock, GPS, delay, and metadata fields.           │   │
│       └──────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  🧹  2. Data Cleaning                                                   │
│       ┌──────────────────────────────────────────────────────────────┐   │
│       │ Standardizes column names, coerces numeric types, removes    │   │
│       │ invalid sensor readings, drops rows with missing critical    │   │
│       │ values, validates ranges against business rules.             │   │
│       └──────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  ⚙️  3. Feature Engineering                                              │
│       ┌──────────────────────────────────────────────────────────────┐   │
│       │ Creates 40+ engineered features: excursion flags, deviation  │   │
│       │ scores, health scores, severity indices, probability         │   │
│       │ indicators, compliance flags, and categorical bands.         │   │
│       └──────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  ⚠️  4. Risk Assessment                                                  │
│       ┌──────────────────────────────────────────────────────────────┐   │
│       │ Computes 6 dimension-level risk scores (0-100): Temperature, │   │
│       │ Humidity, Battery, Shock, Vibration, Delay. Aggregates into  │   │
│       │ Overall Risk Index. Classifies: Low / Medium / High /        │   │
│       │ Critical. Assigns priority (P1-P4) and risk descriptions.    │   │
│       └──────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  💰  5. Financial Loss                                                   │
│       ┌──────────────────────────────────────────────────────────────┐   │
│       │ Calculates inventory value, spoilage percentages, spoilage   │   │
│       │ quantities, financial loss, net financial loss, insurance    │   │
│       │ eligibility/amounts, recovery eligibility/amounts. Assigns   │   │
│       │ loss category, severity, business impact, profit impact.     │   │
│       └──────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  📋  6. Recommendation Engine                                            │
│       ┌──────────────────────────────────────────────────────────────┐   │
│       │ Generates 8 types of contextual recommendations:             │   │
│       │ Temperature, Humidity, Battery, Shipment, Financial,         │   │
│       │ Quality, Manager, and Operational. Assigns severity,         │   │
│       │ escalation level (L1-L3), and immediate action flags.        │   │
│       └──────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  📈  7. Business Insights                                                │
│       ┌──────────────────────────────────────────────────────────────┐   │
│       │ Generates executive KPIs, operational summary, financial     │   │
│       │ summary, quality summary, narrative insights for 6           │   │
│       │ stakeholder personas (CEO, Ops, Supply Chain, Quality,       │   │
│       │ Business Analyst, Power BI).                                 │   │
│       └──────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  📤  8. Data Export                                                     │
│       ┌──────────────────────────────────────────────────────────────┐   │
│       │ Exports final datasets as CSV and Excel (XLSX):              │   │
│       │ • final_dashboard_data.csv (107 columns, 900+ rows)          │   │
│       │ • executive_summary.csv (narrative summaries)                │   │
│       │ • business_insights.csv (structured insights)                │   │
│       │ • financial_summary.csv (financial analytics)                │   │
│       └──────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  📊  9. Power BI Dashboard                                               │
│       ┌──────────────────────────────────────────────────────────────┐   │
│       │ AtmoSync_AI.pbix consumes exported CSVs via folder          │   │
│       │ connection. 5 dashboard pages with 40+ visuals, slicers,    │   │
│       │ KPIs, and drill-through navigation.                         │   │
│       └──────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Technology Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│                        POWER BI DESKTOP                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     Data Source: Folder                       │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │  backend/data/exports/final_dashboard_data.csv          │  │   │
│  │  │  backend/reports/output/executive_summary.csv           │  │   │
│  │  │  backend/reports/output/business_insights.csv           │  │   │
│  │  │  backend/reports/output/financial_summary.csv           │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                    │                                 │
│                                    ▼                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Data Model (Star Schema)                   │   │
│  │                                                               │   │
│  │  ┌─────────────┐    ┌──────────────────┐    ┌─────────────┐  │   │
│  │  │   Dim Date   │◄───│  Fact Shipments   │───►│  Dim Product│  │   │
│  │  └─────────────┘    │  (107 columns)    │    └─────────────┘  │   │
│  │                      └──────────────────┘                     │   │
│  │                         │        │        │                    │   │
│  │                         ▼        ▼        ▼                    │   │
│  │  ┌─────────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │   │
│  │  │ Dim Location│  │Dim Risk  │  │Dim Fin.  │  │Dim Vehicle │ │   │
│  │  └─────────────┘  └──────────┘  └──────────┘  └────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                    │                                 │
│                                    ▼                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     Visualization Layer                       │   │
│  │  5 Pages × 40+ Visuals × Slicers × Drill-through × Tooltips  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. 📊 Dashboard Pages

The dashboard is organized into **5 analytical pages**, each serving a distinct business perspective.

---

### 3.1 👔 Executive Dashboard

**Purpose**: Provides a high-level business health overview for executive leadership. Displays aggregate metrics across all shipments, financial exposure, and overall risk posture.

#### Metrics & KPIs Displayed

| KPI | Description | Data Source Column |
|-----|-------------|-------------------|
| **Total Shipments** | Count of all unique shipment IDs tracked in the dataset | `Shipment ID` (DISTINCT COUNT) |
| **Total Products** | Count of unique product names shipped | `Product Name` (DISTINCT COUNT) |
| **Inventory Value** | Sum of inventory value across all shipments (INR) | `Inventory Value` (SUM) |
| **Financial Loss** | Total estimated financial loss due to spoilage/damage (INR) | `Financial Loss` (SUM) |
| **Net Financial Loss** | Financial loss after insurance claims and recovery (INR) | `Net Financial Loss` (SUM) |
| **Recovery Amount** | Total potential recovery amount from eligible shipments (INR) | `Recovery Amount` (SUM) |
| **Insurance Claims** | Total insurance claim amount from eligible shipments (INR) | `Insurance Claim Amount` (SUM) |
| **Average Risk Score** | Mean composite risk score across all shipments (0–100) | `Risk Score` (AVG) |

#### Recommended Visuals

| Visual | Placement |
|--------|-----------|
| 8 KPI Cards | Top row: summary metrics with conditional formatting |
| Line Chart | Monthly trend of Total Shipments and Average Risk Score |
| Donut Chart | Risk Category distribution (Low / Medium / High / Critical) |
| Treemap | Financial Loss by Product Category |
| Column Chart | Top 10 Origin Cities by Total Shipments |
| Gauge | Current Cold Chain Compliance Rate vs Target (95%) |
| Matrix | Executive summary narrative text from `executive_summary.csv` |

---

### 3.2 🔧 Operational Dashboard

**Purpose**: Enables operations teams to monitor real-time sensor conditions, identify active issues, and track shipment logistics performance.

#### Metrics & KPIs Displayed

| KPI | Description | Data Source Column |
|-----|-------------|-------------------|
| **Temperature** | Average temperature across all active shipments (°C) | `Temperature` (AVG) |
| **Humidity** | Average relative humidity across all shipments (%) | `Humidity` (AVG) |
| **Battery** | Average battery level across all sensors (%) | `Battery` (AVG) |
| **Delay Hours** | Average shipment delay hours | `Delay Hours` (AVG) |
| **Vehicle Type** | Distribution of shipments by vehicle type | `Vehicle Type` |
| **Transport Mode** | Distribution of shipments by transport mode | `Transport Mode` |
| **Origin City** | Geographic origin of shipments | `Origin City` |
| **Destination City** | Geographic destination of shipments | `Destination City` |

#### Recommended Visuals

| Visual | Placement |
|--------|-----------|
| 4 Gauge Charts | Temperature, Humidity, Battery, Delay with safe/warning/critical thresholds |
| Line Chart | Temperature and Humidity trends over time (dual axis) |
| Bar Chart | Average Delay Hours by Transport Mode |
| Stacked Bar Chart | Sensor Status distribution (Active / Warning / Critical / Inactive) |
| Map | Geographic scatter plot of shipment origins and destinations (Latitude, Longitude) |
| Column Chart | Shipment count by Vehicle Type |
| Matrix | Operational metrics by Route ID (delay, distance, duration, fuel) |
| Slicers | Date range, Vehicle Type, Transport Mode, Origin/Destination City |

---

### 3.3 ⚠️ Risk Dashboard

**Purpose**: Provides a comprehensive view of risk scores, excursion events, and priority-based escalation for risk management teams.

#### Metrics & KPIs Displayed

| KPI | Description | Data Source Column |
|-----|-------------|-------------------|
| **Risk Score** | Overall composite risk score (0–100) | `Risk Score` (AVG) |
| **Risk Category** | Classification: Low / Medium / High / Critical | `Risk Category` |
| **Temperature Excursions** | Count of shipments with temperature outside safe range | `Temperature Excursion Flag` (SUM = 1) |
| **Humidity Excursions** | Count of shipments with humidity outside safe range | `Humidity Excursion Flag` (SUM = 1) |
| **Battery Issues** | Count of shipments with critically low battery | `Battery Low Flag` (SUM = 1) |
| **Delay Issues** | Count of shipments with abnormal delays | `Delay Flag` (SUM = 1) |

#### Recommended Visuals

| Visual | Placement |
|--------|-----------|
| 6 KPI Cards | Risk Score, Excursion counts with trend arrows |
| Pie Chart | Risk Category distribution (% of total shipments) |
| Stacked Column Chart | Risk Category breakdown by Product Category |
| Scatter Chart | Risk Score vs Financial Loss (bubble size = Inventory Value) |
| Bar Chart | Top 10 Highest Risk Shipments by Risk Score |
| Matrix | Dimension-level risk scores (Temperature, Humidity, Battery, Shock, Vibration, Delay) per shipment |
| KPI Cards | Count of P1 (Critical), P2 (High), P3 (Medium), P4 (Low) priority items |
| Donut Chart | Cold Chain Compliance Flag (Compliant vs Non-Compliant) |

#### Risk Score Classification

| Risk Category | Score Range | Priority | Description |
|---------------|-------------|----------|-------------|
| 🟢 **Low Risk** | 0.0 – 24.9 | P4 | Conditions are generally within acceptable cold-chain boundaries |
| 🟡 **Medium Risk** | 25.0 – 49.9 | P3 | Minor excursions detected; increased monitoring recommended |
| 🟠 **High Risk** | 50.0 – 74.9 | P2 | Significant deviation; prioritize quality checks and interventions |
| 🔴 **Critical Risk** | 75.0 – 100.0 | P1 | Severe cold-chain risk; quarantine and immediate escalation required |

---

### 3.4 💰 Financial Dashboard

**Purpose**: Provides deep financial analytics including inventory valuation, loss quantification, insurance claims, and recovery opportunities for finance and business leadership.

#### Metrics & KPIs Displayed

| KPI | Description | Data Source Column |
|-----|-------------|-------------------|
| **Inventory Value** | Total value of all shipped inventory (INR) | `Inventory Value` (SUM) |
| **Financial Loss** | Total estimated financial loss (INR) | `Financial Loss` (SUM) |
| **Recovery Amount** | Total potential recovery from eligible shipments (INR) | `Recovery Amount` (SUM) |
| **Insurance Claim** | Total insurance claim amount (INR) | `Insurance Claim Amount` (SUM) |
| **Loss Category** | Classification: Low / Medium / High / Severe | `Loss Category` |
| **Recovery Status** | Eligibility status: Eligible / Not Eligible | `Recovery Status` |

#### Recommended Visuals

| Visual | Placement |
|--------|-----------|
| 5 KPI Cards | Inventory Value, Financial Loss, Net Financial Loss, Recovery Amount, Insurance Claims |
| Waterfall Chart | Financial impact breakdown: Inventory → Loss → Recovery → Insurance → Net Loss |
| Bar Chart | Financial Loss by Loss Category (Low / Medium / High / Severe) |
| Stacked Bar Chart | Insurance and Recovery eligibility counts |
| Column Chart | Top 10 Products by Financial Loss |
| Treemap | Financial Loss by Origin City → Destination City route |
| Matrix | Financial metrics per shipment (Inventory Value, Loss, Recovery, Insurance, Net Loss) |
| Scatter Chart | Financial Loss vs Spoilage Percentage (color = Risk Category) |

#### Financial Loss Structure

```
                        ┌──────────────────┐
                        │  Inventory Value  │
                        │  (Unit Value ×    │
                        │   Quantity)       │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  Spoilage %      │
                        │  (Risk-based)    │
                        └────────┬─────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
           ┌─────────────────┐    ┌──────────────────────┐
           │ Financial Loss   │    │  Insurance Claim     │
           │ (Risk Category × │    │  (If Loss ≥ 15% of  │
           │  Inventory Value)│    │   Inventory Value)   │
           └────────┬────────┘    └──────────┬───────────┘
                    │                         │
                    ▼                         ▼
           ┌─────────────────┐    ┌──────────────────────┐
           │ Recovery Amount  │    │  Net Financial Loss  │
           │ (If Loss ≥ 7% of │    │  = Financial Loss    │
           │  Inventory Value)│    │    - Recovery        │
           └─────────────────┘    │    - Insurance        │
                                  └──────────────────────┘
```

---

### 3.5 📈 Business Insights Dashboard

**Purpose**: Curates narrative-driven insights, stakeholder-specific summaries, and operational/quality analytics for cross-functional decision-making.

#### Metrics & KPIs Displayed

| Section | Description | Source |
|---------|-------------|--------|
| **KPI Summary** | 30+ system-wide KPIs covering shipments, products, risk, financials, and operations | `business_insights.py` → `generate_dashboard_kpis()` |
| **Executive Summary** | Narrative summaries tailored for 6 stakeholder personas (CEO, Ops, Supply Chain, Quality, Business Analyst, Power BI) | `executive_summary.csv` |
| **Business Insights** | Structured insight rows: highest loss category, most delayed route, most affected product/city/transport mode, top insurance claims, recovery opportunities | `business_insights.csv` |
| **Financial Summary** | Aggregate financial metrics: Total Inventory, Loss, Net Loss, Insurance, Recovery, Loss %, Loss Category Breakdown | `financial_summary.csv` |
| **Operational Summary** | Average delay hours, temperature/humidity/battery/delay compliance rates, most delayed route | `business_insights.py` → `generate_operational_summary()` |
| **Quality Summary** | Temperature and humidity excursion rates, highest risk category, top affected products by spoiled quantity | `business_insights.py` → `generate_quality_summary()` |

#### Recommended Visuals

| Visual | Placement |
|--------|-----------|
| Multi-row Card | Executive summary narratives by stakeholder (from `executive_summary.csv`) |
| Matrix | All KPIs with current value and target comparison |
| Donut Chart | Operational risk indicator distribution (count of active issues per shipment) |
| Bar Chart | Top insurance claims by route (Origin → Destination) |
| Column Chart | Recovery opportunities by route |
| Gauge | Cold chain compliance rate with 95% target indicator |
| Cards | Business health metrics: Loss fraction of inventory, spoilage rate, risk distribution |
| Line Chart | Trend of compliance rate over time |

---

## 4. 📂 Data Sources

The Power BI dashboard consumes **4 CSV files**, each exported by the analytics pipeline.

### 4.1 Primary Dataset

| Property | Value |
|----------|-------|
| **File** | `backend/data/exports/final_dashboard_data.csv` |
| **Format** | CSV (Comma-Separated Values) |
| **Columns** | 107 columns |
| **Rows** | ~900+ (configurable via `DEFAULT_RECORDS`) |
| **Grain** | One row per shipment record |
| **Generated By** | `backend/scripts/export_data.py` |
| **Last Stage** | Post-Recommendation Engine |

#### Column Categories

| Group | Columns | Count |
|-------|---------|-------|
| **Shipment Identifiers** | Shipment ID, Container ID, Driver ID, Route ID | 4 |
| **Temporal** | Timestamp, Date, Time | 3 |
| **Product Dimensions** | Product Category, Product Name | 2 |
| **Logistics Dimensions** | Vehicle Type, Transport Mode, Origin City, Destination City, Latitude, Longitude | 6 |
| **Sensor Readings** | Temperature, Humidity, Battery, Shock, Vibration, Delay Hours, Sensor Status, Weather | 8 |
| **Trip Metrics** | Trip Distance, Trip Duration, Fuel Consumption | 3 |
| **Engineered Features** | Temperature Deviation, Temp Excursion Flag, Temp Band, Humidity Deviation, Humidity Excursion Flag, Humidity Band, Battery Health Score, Battery Status, Battery Low Flag, Shock Severity, High Shock Flag, Delay Category, Delay Flag, Journey Duration Category, Avg Speed, Fuel Efficiency, Trip Efficiency, Distance Category, Vibration Severity, High Vibration Flag, Operational Status, Sensor Health Score, Weather Impact Indicator, Temp Excursion Duration Risk, Cold Chain Compliance Flag, Spoilage Probability Indicator, Risk Indicator, Operational Risk Indicator | 28 |
| **Risk Scores** | Temperature Risk Score, Humidity Risk Score, Battery Risk Score, Shock Risk Score, Vibration Risk Score, Delay Risk Score, Overall Risk Index, Risk Score, Risk Category, Risk Priority, Risk Level, Risk Description | 12 |
| **Sub-Risk Categories** | Spoilage Risk, Quality Risk, Logistics Risk, Operational Risk | 4 |
| **Financial Risk** | Financial Risk Indicator, Spoilage Risk Indicator | 2 |
| **Financial Metrics** | Estimated Quantity, Product Unit Value, Inventory Value, Spoilage Percentage, Spoiled Quantity, Estimated Loss, Financial Loss, Estimated Loss Percentage | 8 |
| **Insurance & Recovery** | Insurance Eligible, Insurance Claim Amount, Recovery Eligible, Recovery Amount, Net Financial Loss | 5 |
| **Loss Classification** | Loss Category, Loss Severity, Business Impact, Profit Impact, Cost Impact, Recovery Status, Insurance Status | 7 |
| **Recommendations** | Operational Recommendation, Temperature Recommendation, Humidity Recommendation, Battery Recommendation, Shipment Recommendation, Financial Recommendation, Quality Recommendation, Manager Recommendation, Priority Action, Recommendation Severity, Recommendation Category, Immediate Action Required, Recommendation Status, Escalation Level, Final Recommendation | 15 |

### 4.2 Executive Summary

| Property | Value |
|----------|-------|
| **File** | `backend/reports/output/executive_summary.csv` |
| **Columns** | Stakeholder, Executive Summary |
| **Purpose** | Narrative summaries for 6 stakeholder personas |

### 4.3 Business Insights

| Property | Value |
|----------|-------|
| **File** | `backend/reports/output/business_insights.csv` |
| **Columns** | Insight, Value |
| **Purpose** | Structured business insight rows (top losses, delays, insurance claims, etc.) |

### 4.4 Financial Summary

| Property | Value |
|----------|-------|
| **File** | `backend/reports/output/financial_summary.csv` |
| **Columns** | Metric, Value |
| **Purpose** | Aggregate financial metrics and loss category breakdown |

---

## 5. 🔍 Dashboard Filters

The dashboard includes cross-filtering slicers and page-level filters to enable dynamic data exploration.

| Filter | Available Values | Data Source Column | Type |
|--------|-----------------|-------------------|------|
| **Date** | Continuous date range | `Date` | Date slicer (between) |
| **Product Category** | Vaccines, Medicines, Dairy Products, Frozen Foods, Seafood, Fresh Fruits, Fresh Vegetables, Meat, Ice Cream, Chocolate, Bakery Products | `Product Category` | Dropdown/Multi-select |
| **Product Name** | COVID-19 Vaccine, Insulin, Milk, Cheese, Chicken, Fish, Apple, etc. (32 products) | `Product Name` | Dropdown/Multi-select |
| **Vehicle Type** | Refrigerated Truck, Refrigerated Van, Cold Storage Container, Reefer Trailer, Mini Reefer Truck, Insulated Container | `Vehicle Type` | Dropdown/Multi-select |
| **Transport Mode** | Road, Rail, Air, Sea | `Transport Mode` | Dropdown/Multi-select |
| **Origin City** | Kolkata, Delhi, Mumbai, Bengaluru, Chennai, etc. (30 cities) | `Origin City` | Dropdown/Multi-select |
| **Destination City** | Kolkata, Delhi, Mumbai, Bengaluru, Chennai, etc. (30 cities) | `Destination City` | Dropdown/Multi-select |
| **Risk Category** | Low Risk, Medium Risk, High Risk, Critical Risk | `Risk Category` | Dropdown/Multi-select / Tile |

### Slicer Placement

| Dashboard Page | Slicers |
|----------------|---------|
| **Executive** | Date, Product Category, Risk Category |
| **Operational** | Date, Vehicle Type, Transport Mode, Origin City, Destination City |
| **Risk** | Date, Product Category, Risk Category, Risk Priority |
| **Financial** | Date, Product Category, Loss Category, Recovery Status |
| **Business Insights** | Date (global), Product Category |

---

## 6. 🎯 KPIs

### 6.1 Shipment KPIs

| KPI | Formula | Unit | Interpretation |
|-----|---------|------|----------------|
| **Total Shipments** | `DISTINCTCOUNT(Shipment ID)` | Count | Higher = more shipment volume |
| **Total Products** | `DISTINCTCOUNT(Product Name)` | Count | Higher = greater product diversity |

### 6.2 Financial KPIs

| KPI | Formula | Unit | Interpretation |
|-----|---------|------|----------------|
| **Inventory Value** | `SUM(Inventory Value)` | INR | Higher = more capital at risk |
| **Financial Loss** | `SUM(Financial Loss)` | INR | Lower = better cold chain performance |
| **Net Financial Loss** | `SUM(Net Financial Loss)` | INR | Lower = better insurance/recovery coverage |
| **Recovery Amount** | `SUM(Recovery Amount)` | INR | Higher = more recovery opportunities leveraged |
| **Insurance Claims** | `SUM(Insurance Claim Amount)` | INR | Higher = more insurance coverage utilized |
| **Average Loss %** | `SUM(Financial Loss) / SUM(Inventory Value)` | % | Lower = better; target < 10% |
| **Loss to Inventory Ratio** | `AVG(Financial Loss / Inventory Value)` | % | Benchmark across product categories |

### 6.3 Risk KPIs

| KPI | Formula | Unit | Interpretation |
|-----|---------|------|----------------|
| **Average Risk Score** | `AVG(Risk Score)` | 0–100 | Lower = healthier supply chain |
| **Critical Shipments** | `COUNTROWS(FILTER(Risk Category = "Critical Risk"))` | Count | Lower = better; immediate action needed |
| **High Risk Shipments** | `COUNTROWS(FILTER(Risk Category = "High Risk"))` | Count | Lower = better |
| **Medium Risk Shipments** | `COUNTROWS(FILTER(Risk Category = "Medium Risk"))` | Count | Monitor |
| **Low Risk Shipments** | `COUNTROWS(FILTER(Risk Category = "Low Risk"))` | Count | Higher = better |
| **Cold Chain Compliance Rate** | `AVG(Cold Chain Compliance Flag) × 100` | % | Higher = better; target > 95% |
| **Temperature Excursions** | `SUM(Temperature Excursion Flag)` | Count | Lower = better |
| **Humidity Excursions** | `SUM(Humidity Excursion Flag)` | Count | Lower = better |
| **Battery Issues** | `SUM(Battery Low Flag)` | Count | Lower = better |
| **Delay Issues** | `SUM(Delay Flag)` | Count | Lower = better |

### 6.4 Operational KPIs

| KPI | Formula | Unit | Interpretation |
|-----|---------|------|----------------|
| **Average Temperature** | `AVG(Temperature)` | °C | Should remain within safe range (-5°C to 5°C) |
| **Average Humidity** | `AVG(Humidity)` | % | Should remain within safe range (30%–70%) |
| **Average Battery** | `AVG(Battery)` | % | Higher = healthier sensors; target > 40% |
| **Average Delay Hours** | `AVG(Delay Hours)` | Hours | Lower = better; target < 4 hours |
| **Average Speed** | `AVG(Average Speed)` | km/h | Depends on transport mode |
| **Fuel Efficiency** | `AVG(Fuel Efficiency)` | km/liter | Higher = more efficient |
| **Sensor Health Score** | `AVG(Sensor Health Score)` | 0–100 | Higher = healthier sensors |
| **Operational Risk Indicator** | `SUM(Operational Risk Indicator) / COUNTROWS()` | Avg flags | Lower = fewer concurrent issues |
| **Temperature Compliance Rate** | `(1 - AVG(Temperature Excursion Flag)) × 100` | % | Higher = better; target > 95% |
| **Humidity Compliance Rate** | `(1 - AVG(Humidity Excursion Flag)) × 100` | % | Higher = better; target > 90% |
| **Battery Health Rate** | `(1 - AVG(Battery Low Flag)) × 100` | % | Higher = better; target > 90% |
| **Delay Compliance Rate** | `(1 - AVG(Delay Flag)) × 100` | % | Higher = better; target > 85% |

### 6.5 Recommendation KPIs

| KPI | Formula | Unit | Interpretation |
|-----|---------|------|----------------|
| **Immediate Actions** | `COUNTROWS(FILTER(Immediate Action Required = TRUE))` | Count | Lower = fewer crisis situations |
| **Open Recommendations** | `COUNTROWS(FILTER(Recommendation Status = "Open"))` | Count | Lower = more issues resolved |
| **L3 Escalations** | `COUNTROWS(FILTER(Escalation Level = "L3"))` | Count | Lower = fewer critical escalations |
| **High Severity Items** | `COUNTROWS(FILTER(Recommendation Severity = "high"))` | Count | Lower = better |

### 6.6 Quality KPIs

| KPI | Formula | Unit | Interpretation |
|-----|---------|------|----------------|
| **Spoilage Probability** | `AVG(Spoilage Probability Indicator)` | 0–1 | Lower = lower spoilage risk |
| **Spoiled Quantity** | `SUM(Spoiled Quantity)` | Units | Lower = less product loss |
| **Spoilage Percentage** | `AVG(Spoilage Percentage)` | % | Lower = better; varies by risk tier |
| **Temperature Deviation** | `AVG(Temperature Deviation)` | °C | Lower = more stable cold chain |
| **Humidity Deviation** | `AVG(Humidity Deviation)` | % | Lower = more stable humidity |

---

## 7. 📈 Visualizations

The following visualization types are recommended across the dashboard pages.

| Visualization | Best Use Case | Recommended Page |
|---------------|---------------|------------------|
| **KPI Card** | Display single, critical aggregate metric with conditional formatting (color-coded by threshold) | Executive, Financial |
| **Line Chart** | Show trends over time (daily/weekly/monthly): Risk Score, Temperature, Financial Loss | Executive, Operational, Risk |
| **Column Chart** | Compare values across categories: Product Categories, Vehicle Types, Transport Modes | Operational, Risk, Financial |
| **Bar Chart** | Rank items: Top 10 High-Risk Shipments, Top Affected Products, Most Delayed Routes | Risk, Financial, Business Insights |
| **Pie Chart** | Show proportional distribution: Transport Mode split, Vehicle Type composition | Operational |
| **Donut Chart** | Show percentage breakdown with center label: Risk Category distribution, Compliance rate | Executive, Risk, Business Insights |
| **Gauge** | Track performance against target: Temperature vs Safe Range, Compliance Rate vs 95% Target | Operational, Business Insights |
| **Matrix** | Tabular display with row/column totals and conditional formatting: Per-shipment risk scores, Financial details | Risk, Financial |
| **Treemap** | Hierarchical data with area encoding: Financial Loss by Product Category → Product Name | Executive, Financial |
| **Map** | Geographic scatter plot of shipment coordinates with bubble size = Financial Loss or Risk Score | Operational |
| **Scatter Chart** | Correlation analysis: Risk Score vs Financial Loss, Temperature Deviation vs Spoilage Probability | Risk, Financial |
| **Waterfall Chart** | Incremental breakdown: Inventory Value → Loss → Recovery → Insurance → Net Loss | Financial |
| **Stacked Bar Chart** | Composition across categories: Risk Category by Product Category, Sensor Status distribution | Risk, Operational |
| **Multi-row Card** | Display narrative text: Executive summaries by stakeholder | Business Insights |

### Conditional Formatting Rules

| Metric | Green (Safe) | Yellow (Warning) | Red (Critical) |
|--------|-------------|------------------|----------------|
| **Risk Score** | 0–24.9 | 25.0–49.9 | 50.0–100.0 |
| **Temperature** | -5°C to 5°C | -10°C to -5°C or 5°C to 8°C | <-10°C or >8°C |
| **Humidity** | 30%–70% | 20%–30% or 70%–80% | <20% or >80% |
| **Battery** | 40%–100% | 20%–39% | 0%–19% |
| **Delay Hours** | 0–4 | 4.1–12 | >12 |
| **Compliance Rate** | ≥95% | 80%–94% | <80% |
| **Loss % of Inventory** | <5% | 5%–15% | >15% |

---

## 8. 🔄 Refresh Process

### 8.1 Pipeline Execution → CSV Update

The refresh process begins by running the AtmoSync AI analytics pipeline, which regenerates all CSV files consumed by Power BI.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REFRESH WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────┐                                        │
│  │  Step 1: Run Pipeline         │                                        │
│  │  python backend/scripts/     │                                        │
│  │         pipeline.py          │                                        │
│  │                             │                                        │
│  │  OR via API:                │                                        │
│  │  POST /api/v1/analytics/run │                                        │
│  └─────────────┬───────────────┘                                        │
│                │                                                         │
│                ▼                                                         │
│  ┌──────────────────────────────┐                                        │
│  │  Step 2: Pipeline Executes    │       ┌───────────────────────────┐  │
│  │  in Order:                    │       │ Step Duration             │  │
│  │                             │       │ (Approx. Total:           │  │
│  │  1. Sensor Generation    ───┼───────┤  3–8 seconds for 1000      │  │
│  │  2. Data Cleaning        ───┼───────┤  records)                  │  │
│  │  3. Feature Engineering  ───┼───────┤                           │  │
│  │  4. Risk Assessment      ───┼───────┤  Each step is logged       │  │
│  │  5. Financial Loss       ───┼───────┤  with start/end times      │  │
│  │  6. Recommendation Engine──┼───────┤  and execution duration.    │  │
│  │  7. Business Insights    ───┼───────┤                           │  │
│  │  8. Data Export          ───┼───────┤  Failures stop the         │  │
│  │                             │       │  pipeline immediately.     │  │
│  └─────────────┬───────────────┘       └───────────────────────────┘  │
│                │                                                         │
│                ▼                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Step 3: CSV Files Updated / Created                              │   │
│  │                                                                   │   │
│  │  📄 backend/data/exports/final_dashboard_data.csv                 │   │
│  │      (107 columns, ~N rows)                                      │   │
│  │                                                                   │   │
│  │  📄 backend/reports/output/executive_summary.csv                  │   │
│  │      (Stakeholder narratives)                                     │   │
│  │                                                                   │   │
│  │  📄 backend/reports/output/business_insights.csv                  │   │
│  │      (Structured insights)                                        │   │
│  │                                                                   │   │
│  │  📄 backend/reports/output/financial_summary.csv                  │   │
│  │      (Financial analytics)                                        │   │
│  │                                                                   │   │
│  │  📄 backend/data/exports/reports/output/export_summary.json       │   │
│  │      (Export metadata, file sizes, row counts)                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                │                                                         │
│                ▼                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Step 4: Power BI Refresh                                        │   │
│  │                                                                   │   │
│  │  Power BI Desktop → Home Tab → Refresh                            │   │
│  │  (Ctrl + R)                                                       │   │
│  │                                                                   │   │
│  │  Power BI reads the updated CSVs from the local file paths.       │   │
│  │  All visuals, KPIs, and slicers update automatically.             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Pipeline Triggering Methods

| Method | Command / Action | When to Use |
|--------|-----------------|-------------|
| **CLI (Full Pipeline)** | `python backend/scripts/pipeline.py` | Scheduled runs, CI/CD, manual refresh |
| **REST API** | `POST /api/v1/analytics/run` | From frontend UI, automation scripts |
| **Individual Steps** | `python backend/scripts/risk_assessment.py` | Targeted re-runs of specific stages |
| **FastAPI Server** | `uvicorn backend.main:app --reload` | Development with auto-reload |

### 8.3 Power BI Refresh Methods

| Method | Steps | Notes |
|--------|-------|-------|
| **Manual Refresh** | Home → Refresh (Ctrl+R) | Quickest way; requires manual trigger |
| **Power BI Service** | Schedule refresh via Power BI Service (cloud) | Requires publishing .pbix to cloud workspace |
| **Power Automate** | Create automated flow triggered by file modification | Advanced setup for enterprise automation |
| **DirectQuery Mode** | (Future) Connect to live API endpoint | Real-time data without manual refresh |

### 8.4 Refresh Best Practices

1. **Run pipeline before opening Power BI** to ensure the latest data is available.
2. **Schedule pipeline runs** via cron (Linux) or Task Scheduler (Windows) for daily updates.
3. **Monitor pipeline logs** at `backend/logs/atmosync.log` for step failures.
4. **Validate export summary** at `backend/data/exports/reports/output/export_summary.json` to confirm row counts and file sizes.
5. **Use relative paths** in Power BI data source settings for portability across environments.
6. **Backup CSVs** before re-running the pipeline if historical data persistence is required.

---

## 9. 📁 Folder Structure

```
backend/
├── dashboard/                          # Power BI Dashboard Directory
│   ├── AtmoSync_AI.pbix               # Power BI Desktop Workbook
│   └── Dashboard_Guide.md             # This guide
│
├── data/                               # Data Storage Directory
│   ├── raw/
│   │   └── sensor_data.csv            # Raw sensor data (generated)
│   │
│   ├── processed/
│   │   └── processed_sensor_data.csv   # Cleaned + validated data
│   │
│   └── exports/                        # Dashboard Consumption Data
│       ├── final_dashboard_data.csv    # ★ PRIMARY: 107-column dashboard dataset
│       ├── reports/
│       │   └── output/
│       │       ├── final_dashboard_data.csv      # CSV export copy
│       │       ├── final_dashboard_data.xlsx     # Excel export copy
│       │       ├── executive_summary.csv         # Executive narratives
│       │       ├── executive_summary.xlsx        # Excel format
│       │       ├── business_insights.csv         # Structured insights
│       │       ├── business_insights.xlsx        # Excel format
│       │       ├── financial_summary.csv         # Financial metrics
│       │       ├── financial_summary.xlsx        # Excel format
│       │       └── export_summary.json           # Export metadata
│       └── placeholder.txt
│
├── reports/
│   └── output/
│       ├── executive_summary.csv       # Executive narrative summaries
│       ├── business_insights.csv       # Business insight payloads
│       └── financial_summary.csv       # Financial summary payloads
│
├── scripts/                            # Pipeline Modules
│   ├── pipeline.py                     # Orchestrator (steps 1–8)
│   ├── sensor_generator.py             # Step 1: Generate raw data
│   ├── data_cleaning.py                # Step 2: Clean & validate
│   ├── feature_engineering.py          # Step 3: Feature extraction
│   ├── risk_assessment.py              # Step 4: Risk scoring
│   ├── financial_loss.py               # Step 5: Financial estimation
│   ├── recommendation_engine.py        # Step 6: Recommendations
│   ├── business_insights.py            # Step 7: KPI & insights
│   └── export_data.py                  # Step 8: CSV/Excel export
│
└── config/
    ├── config.py                       # Paths, API, sensor configuration
    └── business_rules.py               # Risk bands, spoilage rates, thresholds
```

### Power BI Data Source Connections

The `AtmoSync_AI.pbix` file is configured to connect to the following local file paths:

| Table Name in Power BI | Source File | Connection Mode |
|------------------------|-------------|-----------------|
| `DashboardData` | `backend/data/exports/final_dashboard_data.csv` | Import |
| `ExecutiveSummary` | `backend/reports/output/executive_summary.csv` | Import |
| `BusinessInsights` | `backend/reports/output/business_insights.csv` | Import |
| `FinancialSummary` | `backend/reports/output/financial_summary.csv` | Import |

> **Note**: If Power BI is unable to locate the files, update the data source settings to use absolute file paths or configure a folder connection pointing to the `backend/data/exports/` and `backend/reports/output/` directories.

---

## 10. 🚀 Usage

### 10.1 Prerequisites

| Requirement | Details |
|-------------|---------|
| **Power BI Desktop** | Free download from [powerbi.microsoft.com](https://powerbi.microsoft.com/desktop/) |
| **Python 3.12+** | Installed and available in PATH |
| **Pipeline Dependencies** | Installed via `pip install -r backend/requirements.txt` |
| **Virtual Environment** | Recommended: `python -m venv venv && venv\Scripts\activate` |

### 10.2 Step-by-Step Guide

#### Step 1: Run the Analytics Pipeline

Generate the latest data by executing the full analytics pipeline:

```bash
# Option A: Run via Python directly
cd backend
python scripts/pipeline.py

# Option B: Run via FastAPI server (start server then call endpoint)
uvicorn main:app --reload
# In another terminal:
curl -X POST http://localhost:8000/api/v1/analytics/run

# Option C: Run individual stages (if targeted refresh needed)
python scripts/sensor_generator.py
python scripts/data_cleaning.py
python scripts/feature_engineering.py
python scripts/risk_assessment.py
python scripts/financial_loss.py
python scripts/recommendation_engine.py
python scripts/business_insights.py
python scripts/export_data.py
```

#### Step 2: Verify Data Export

Confirm that the CSV files were generated successfully:

```bash
# Check export summary
cat backend/data/exports/reports/output/export_summary.json

# Expected output:
# {
#   "project": "AtmoSync AI",
#   "total_exported_files": 8,
#   "overall_export_success": true,
#   ...
# }

# Quick data validation
python -c "
import pandas as pd
df = pd.read_csv('backend/data/exports/final_dashboard_data.csv')
print(f'Shape: {df.shape[0]} rows × {df.shape[1]} columns')
print(f'Columns: {list(df.columns)}')
print(f'Risk categories: {df[\"Risk Category\"].value_counts().to_dict()}')
"
```

#### Step 3: Open Power BI Dashboard

1. Launch **Power BI Desktop**.
2. Navigate to **File → Open**, select `backend/dashboard/AtmoSync_AI.pbix`.
3. If prompted about data source credentials, select **Import** mode.

#### Step 4: Refresh Data

1. Click the **Refresh** button in the **Home** tab (or press `Ctrl + R`).
2. Power BI will re-import data from the CSV files.
3. Verify that visuals update with the latest data.

#### Step 5: Explore the Dashboard

| Action | Description |
|--------|-------------|
| **Page Navigation** | Click page tabs at the bottom: Executive, Operational, Risk, Financial, Business Insights |
| **Apply Filters** | Use slicer panels to filter by Date, Product Category, Risk Category, etc. |
| **Cross-Filter** | Click on any visual to highlight/cross-filter related visuals |
| **Drill Through** | Right-click data points to drill through to detail views |
| **Tooltips** | Hover over data points for contextual information |
| **Export Data** | Right-click any visual → Export Data (CSV) |
| **Bookmarks** | Use preset bookmarks for common views and stakeholder perspectives |

### 10.3 Troubleshooting

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| **No data in visuals** | CSV files not found | Run pipeline first; check data source paths in Power BI |
| **Refresh error: file not found** | Incorrect file path | Update data source settings to absolute paths |
| **Old data displayed** | Power BI not refreshed | Click Refresh or press Ctrl+R |
| **Missing columns** | Pipeline version mismatch | Re-run full pipeline to regenerate all columns |
| **Pipeline error** | Missing dependencies | Run `pip install -r backend/requirements.txt` |
| **Data type errors in Power BI** | CSV parsing issue | Check CSV encoding (UTF-8); verify column delimiters |

---

## 11. 🔮 Future Enhancements

| Enhancement | Description | Impact |
|-------------|-------------|--------|
| **📡 Real-Time Sensor Streaming** | Replace CSV pipeline with live MQTT/WebSocket IoT data ingestion for real-time dashboard updates | Enables live monitoring of in-transit shipments |
| **🌐 Live API Integration** | Connect Power BI to FastAPI REST endpoints via DirectQuery or Power BI Dataflows instead of static CSV import | Eliminates manual refresh; enables live query |
| **☁️ Azure Deployment** | Deploy pipeline as Azure Functions with Power BI Service scheduled refresh. Store data in Azure Blob Storage or Azure SQL Database | Enterprise scalability, cloud collaboration, mobile access |
| **📱 Mobile Dashboard** | Optimize Power BI report for mobile viewing with responsive layout and mobile-optimized visuals | Field operations access for drivers, warehouse staff |
| **🧠 Predictive Analytics** | Integrate scikit-learn ML models to predict spoilage risk before excursions occur. Features: temperature deviation trends, humidity patterns, delay probability | Proactive risk mitigation instead of reactive monitoring |
| **🔔 Alert Notifications** | Configure Power BI data alerts and Power Automate flows to send email/Teams notifications when critical thresholds are breached | Immediate incident response for operations teams |
| **🗄️ Historical Database** | Migrate from CSV to SQLite/PostgreSQL with time-series partitioning for efficient historical querying and trend analysis | Faster performance on large datasets; enables year-over-year comparisons |
| **🔄 Incremental Refresh** | Implement incremental data refresh in Power BI Service to load only new/changed records | Faster refresh times for growing datasets |
| **👤 Row-Level Security (RLS)** | Implement Power BI RLS roles (Executive, Operations, Quality, Finance) to restrict data access by stakeholder | Secure data governance across teams |
| **📊 Custom Visuals** | Add custom Power BI visuals: advanced heatmaps, radar charts for multi-dimensional risk, sankey diagrams for route flow analysis | Enhanced analytical depth |

---

## 📋 Appendix

### A. Data Pipeline Metadata

| Attribute | Value |
|-----------|-------|
| **Project** | AtmoSync AI |
| **Version** | 1.0.0 |
| **Author** | Sujan Pradhan |
| **Description** | Smart Cold Chain Monitoring & Spoilage Risk Analytics System |
| **Backend** | FastAPI (Python) |
| **Data Processing** | Pandas, NumPy |
| **Dashboard** | Power BI Desktop |
| **Storage** | CSV Pipeline (Raw → Processed → Export) |
| **Risk Engine** | Composite weighted scoring (ML-ready) |
| **Default Records** | 1,000 shipments |
| **Indian Cities** | 30 cities |
| **Product Categories** | 12 categories (32 products) |
| **Transport Modes** | 4 modes |
| **Vehicle Types** | 6 types |

### B. Business Rules Reference

| Domain | Safe Range | Warning Range | Critical Range |
|--------|-----------|---------------|----------------|
| **Temperature** | -5°C to 5°C | -10°C to -5°C or 5°C to 8°C | -15°C to -10°C or 8°C to 12°C |
| **Humidity** | 30%–70% | 20%–30% or 70%–80% | 10%–20% or 80%–90% |
| **Battery** | 40%–100% | 20%–39% | 0%–19% |
| **Delay** | 0–4 hrs | 4.1–12 hrs | 12.1+ hrs |

### C. Risk Category → Financial Impact

| Risk Category | Spoilage % | Financial Loss % | Priority |
|---------------|-----------|------------------|----------|
| Low Risk | 2% | 3% | P4 |
| Medium Risk | 6% | 10% | P3 |
| High Risk | 14% | 22% | P2 |
| Critical Risk | 28% | 40% | P1 |

### D. Key Formulas

```dax
// DAX Measure: Cold Chain Compliance Rate
Cold Chain Compliance Rate = 
AVERAGE(DashboardData[Cold Chain Compliance Flag]) * 100

// DAX Measure: Net Loss Ratio
Net Loss Ratio = 
DIVIDE(
    SUM(DashboardData[Net Financial Loss]),
    SUM(DashboardData[Inventory Value]),
    0
)

// DAX Measure: Risk Score Category Count
Critical Shipments = 
CALCULATE(
    COUNTROWS(DashboardData),
    DashboardData[Risk Category] = "Critical Risk"
)

// DAX Measure: Weighted Average Risk Score
Weighted Avg Risk Score = 
DIVIDE(
    SUMX(DashboardData, DashboardData[Risk Score] * DashboardData[Inventory Value]),
    SUM(DashboardData[Inventory Value]),
    0
)

// DAX Measure: Recovery Coverage %
Recovery Coverage % = 
DIVIDE(
    SUM(DashboardData[Recovery Amount]),
    SUM(DashboardData[Financial Loss]),
    0
) * 100
```

---

<p align="center">
  <b>AtmoSync AI</b> — Intelligent Cold Chain Analytics for a Safer Supply Chain.
</p>
<p align="center">
  <sub>Built with ❄️ using Python, FastAPI, Pandas & Power BI</sub>
</p>

