# 📸 AtmoSync AI — Dashboard Screenshots

<p align="center">
  <img src="https://img.shields.io/badge/Status-Optional-8B5CF6?style=for-the-badge" alt="Optional">
  <img src="https://img.shields.io/badge/Purpose-GitHub Documentation-3B82F6?style=for-the-badge" alt="Documentation">
</p>

---

## 📋 Purpose

This directory is intended to store screenshots of the AtmoSync AI Power BI dashboard for use in:

- **GitHub Repository Documentation** — Enhance README and documentation files with visual examples
- **Project Presentations** — Include dashboard visuals in slide decks and demo materials
- **Portfolio Showcase** — Demonstrate Power BI visualization capabilities
- **Internship Submission** — Provide visual evidence of the working dashboard
- **College Project Reports** — Illustrate analytical outputs in project documentation

---

## 🖼️ Recommended Screenshots

The following screenshots are recommended to showcase the key capabilities of the Power BI dashboard. Each screenshot corresponds to one of the 5 dashboard pages.

### 1. `dashboard_overview.png`

**Description**: Full-view screenshot of the entire Power BI dashboard displaying all 5 page tabs in the bottom navigation bar. This provides context for the overall dashboard structure.

**Suggested Content**:
- All 5 page tabs visible (Executive, Operational, Risk, Financial, Business Insights)
- One active page with multiple visuals
- Slicer panel visible (if configured)

---

### 2. `executive_dashboard.png`

**Description**: Screenshot of the **Executive Dashboard** page, which provides high-level business health metrics for leadership.

**Suggested Visuals to Include**:
- KPI cards showing Total Shipments, Financial Loss, Average Risk Score
- Donut chart showing Risk Category distribution (Low/Medium/High/Critical)
- Financial KPIs (Inventory Value, Net Loss, Recovery Amount)
- Any trend lines or top-N charts

---

### 3. `operational_dashboard.png`

**Description**: Screenshot of the **Operational Dashboard** page, which enables sensor monitoring and logistics tracking.

**Suggested Visuals to Include**:
- Gauge charts for Temperature, Humidity, Battery, and Delay
- Geographic map showing shipment origins/destinations
- Bar charts for Vehicle Type or Transport Mode distribution
- Slicers for date range, city, or vehicle type

---

### 4. `risk_dashboard.png`

**Description**: Screenshot of the **Risk Dashboard** page, which provides comprehensive risk analysis.

**Suggested Visuals to Include**:
- KPI cards for Risk Score, Excursion counts
- Pie/Donut chart for Risk Category distribution
- Scatter chart: Risk Score vs Financial Loss
- Bar chart for Top High-Risk Shipments
- Matrix showing dimension-level risk scores

---

### 5. `financial_dashboard.png`

**Description**: Screenshot of the **Financial Dashboard** page, which quantifies financial exposure and recovery opportunities.

**Suggested Visuals to Include**:
- KPI cards for Inventory Value, Financial Loss, Net Loss
- Waterfall chart from inventory through to net loss
- Bar chart for Financial Loss by Loss Category
- Treemap or column chart for Top Products by Loss
- Insurance/Recovery analysis visuals

---

### 6. `business_insights_dashboard.png`

**Description**: Screenshot of the **Business Insights Dashboard** page, which displays stakeholder narratives and KPI summaries.

**Suggested Visuals to Include**:
- Multi-row card or matrix showing executive summaries by stakeholder
- KPI matrix or table
- Gauge showing Cold Chain Compliance Rate
- Business health metrics

---

## 📸 Screenshot Guidelines

| Guideline | Recommendation |
|-----------|---------------|
| **Format** | PNG (preferred for lossless quality) |
| **Resolution** | 1920×1080 or higher (full HD) |
| **File Size** | Keep under 2 MB per image |
| **Naming Convention** | `lowercase_snake_case_descriptive_name.png` |
| **Annotations** | Optional: add callouts or arrows to highlight key metrics |
| **Data Freshness** | Ensure pipeline has been run before capturing screenshots |

---

## 🔄 How to Capture Screenshots

1. **Run the analytics pipeline** to generate the latest data:
   ```bash
   python backend/scripts/pipeline.py
   ```

2. **Open the Power BI dashboard**:
   - Launch Power BI Desktop
   - Open `backend/dashboard/AtmoSync_AI.pbix`
   - Click **Refresh** (Ctrl+R) to load current data

3. **Navigate to each dashboard page** and capture screenshots:
   - Use Windows Snipping Tool, Snagit, or similar screenshot tool
   - Capture the full page including slicers and navigation tabs
   - Save images to this directory

4. **Reference screenshots in documentation** using relative paths:
   ```markdown
   ![Executive Dashboard](../screenshots/executive_dashboard.png)
   ```

---

## 📁 Directory Structure

```
backend/reports/screenshots/
│
├── README.md                           # This file — screenshot guidelines
│
├── dashboard_overview.png              # (Optional) Full dashboard overview
├── executive_dashboard.png             # (Optional) Executive Dashboard page
├── operational_dashboard.png           # (Optional) Operational Dashboard page
├── risk_dashboard.png                  # (Optional) Risk Dashboard page
├── financial_dashboard.png             # (Optional) Financial Dashboard page
└── business_insights_dashboard.png     # (Optional) Business Insights page
```

---

> **Note**: Screenshots are optional but highly recommended for enhancing GitHub documentation and project presentations. They help stakeholders visualize the analytical outputs without needing to open Power BI.

<p align="center">
  <b>AtmoSync AI</b> — Intelligent Cold Chain Analytics for a Safer Supply Chain.
</p>

