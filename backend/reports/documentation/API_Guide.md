# 🌐 AtmoSync AI — API Guide

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Swagger-UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
  <img src="https://img.shields.io/badge/ReDoc-Documentation-C6193D?style=for-the-badge&logo=readthedocs&logoColor=white" alt="ReDoc">
</p>

---

## 📑 Table of Contents

1. [API Overview](#1-api-overview)
2. [Base URL](#2-base-url)
3. [Authentication](#3-authentication)
4. [Endpoints](#4-endpoints)
   - [4.1 Health Check](#41-health-check)
   - [4.2 Run Analytics Pipeline](#42-run-analytics-pipeline)
   - [4.3 Run Risk Assessment](#43-run-risk-assessment)
   - [4.4 Run Recommendation Engine](#44-run-recommendation-engine)
   - [4.5 Get Shipment Alerts](#45-get-shipment-alerts)
   - [4.6 Get Dashboard Dataset](#46-get-dashboard-dataset)
   - [4.7 Reports Module Status](#47-reports-module-status)
   - [4.8 Shipment Processing](#48-shipment-processing)
   - [4.9 Map Module Status](#49-map-module-status)
5. [Error Codes](#5-error-codes)
6. [Interactive Documentation](#6-interactive-documentation)

---

## 1. API Overview

AtmoSync AI provides a RESTful API through FastAPI that exposes endpoints for pipeline execution, data retrieval, alert management, and system monitoring.

### API Modules

| Module | Endpoint Prefix | Tag | Description |
|--------|----------------|-----|-------------|
| Analytics | `/analytics/run` | Analytics | Full pipeline execution |
| Risk | `/risk/run` | Risk | Independent risk assessment |
| Recommendation | `/recommendation/run` | Recommendation | Independent recommendation generation |
| Alerts | `/alerts` | Alerts | Shipment alert retrieval |
| Dashboard | `/dashboard/final-data` | Dashboard | Dashboard dataset access |
| Health | `/health` | Health | Service health monitoring |
| Reports | `/reports/status` | Reports | Reporting module status |
| Shipment | `/shipment/run` | Shipment | Shipment processing |
| Map | `/map/status` | Map | Map module status |

---

## 2. Base URL

| Environment | URL |
|-------------|-----|
| **Local Development** | `http://localhost:8000` |
| **Swagger UI** | `http://localhost:8000/docs` |
| **ReDoc** | `http://localhost:8000/redoc` |

The API prefix `/api/v1` can be configured via the `API_PREFIX` environment variable but is not applied by default.

---

## 3. Authentication

**Current Status**: Authentication is not implemented in the current version. The API is open-access for development and demonstration purposes.

> **Note**: Authentication (JWT-based) is planned for future releases. All endpoints currently operate without access control.

---

## 4. Endpoints

### 4.1 Health Check

Returns the current health status of the AtmoSync AI backend service.

| Property | Value |
|----------|-------|
| **Endpoint** | `/health` |
| **Method** | `GET` |
| **Tag** | Health |
| **Purpose** | Verify the backend service is running and available |

#### Request

**Parameters**: None

**Request Body**: None

#### Response

**Response Model**: `dict[str, str]`

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Service status indicator (`"healthy"`) |
| `project` | string | Project name (`"AtmoSync AI"`) |
| `version` | string | Project version (`"1.0.0"`) |

#### Example

**Request**:
```bash
curl http://localhost:8000/health
```

**Response** (200 OK):
```json
{
  "status": "healthy",
  "project": "AtmoSync AI",
  "version": "1.0.0"
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Service is running and healthy |

---

### 4.2 Run Analytics Pipeline

Executes the complete 8-stage AtmoSync AI analytics pipeline: Sensor Generator → Data Cleaning → Feature Engineering → Risk Assessment → Financial Loss → Recommendation Engine → Business Insights → Export Data.

| Property | Value |
|----------|-------|
| **Endpoint** | `/analytics/run` |
| **Method** | `POST` |
| **Tag** | Analytics |
| **Purpose** | Execute the full analytics pipeline with step-level timing |

#### Request

**Parameters**: None

**Request Body**: None (reserved for future `AnalyticsRunRequest`)

#### Response

**Response Model**: `dict[str, object]`

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the pipeline completed without errors |
| `status` | string | Pipeline status (`"completed"` or `"failed"`) |
| `exit_code` | integer | Process exit code (0 = success, non-zero = failure) |
| `message` | string | Human-readable status message |

#### Example

**Request**:
```bash
curl -X POST http://localhost:8000/analytics/run
```

**Response** (200 OK):
```json
{
  "success": true,
  "status": "completed",
  "exit_code": 0,
  "message": "Analytics pipeline completed successfully."
}
```

**Response** (failed):
```json
{
  "success": false,
  "status": "failed",
  "exit_code": 1,
  "message": "Analytics pipeline finished with errors."
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Pipeline executed (check `success` field for outcome) |
| 500 | Internal server error during pipeline execution |

---

### 4.3 Run Risk Assessment

Executes the risk assessment pipeline independently, computing risk scores and classifications from the engineered dataset.

| Property | Value |
|----------|-------|
| **Endpoint** | `/risk/run` |
| **Method** | `POST` |
| **Tag** | Risk |
| **Purpose** | Execute risk assessment scoring and categorization |

#### Request

**Parameters**: None

**Request Body**: None (reserved for future `RiskRunRequest`)

#### Response

**Response Model**: `dict[str, object]`

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether risk assessment completed without errors |
| `status` | string | Execution status (`"completed"` or `"failed"`) |
| `exit_code` | integer | Process exit code (0 = success, non-zero = failure) |
| `message` | string | Execution summary message |

#### Example

**Request**:
```bash
curl -X POST http://localhost:8000/risk/run
```

**Response** (200 OK):
```json
{
  "success": true,
  "status": "completed",
  "exit_code": 0,
  "message": "Risk assessment completed successfully."
}
```

**Response** (failed):
```json
{
  "success": false,
  "status": "failed",
  "exit_code": 1,
  "message": "Risk assessment completed with errors."
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Risk assessment executed (check `success` field) |
| 500 | Internal server error during risk assessment |

---

### 4.4 Run Recommendation Engine

Triggers the recommendation engine independently, generating actionable recommendations based on existing risk and financial data.

| Property | Value |
|----------|-------|
| **Endpoint** | `/recommendation/run` |
| **Method** | `POST` |
| **Tag** | Recommendation |
| **Purpose** | Generate shipment recommendations independently |

#### Request

**Parameters**: None

**Request Body**: None (reserved for future `RecommendationRunRequest`)

#### Response

**Response Model**: `dict[str, object]`

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether recommendation engine completed without errors |
| `status` | string | Execution status (`"completed"` or `"failed"`) |
| `exit_code` | integer | Process exit code (0 = success, non-zero = failure) |
| `message` | string | Execution summary message |

#### Example

**Request**:
```bash
curl -X POST http://localhost:8000/recommendation/run
```

**Response** (200 OK):
```json
{
  "success": true,
  "status": "completed",
  "exit_code": 0,
  "message": "Recommendation pipeline completed successfully."
}
```

**Response** (failed):
```json
{
  "success": false,
  "status": "failed",
  "exit_code": 1,
  "message": "Recommendation pipeline completed with errors."
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Recommendation engine executed (check `success` field) |
| 500 | Internal server error during recommendation generation |

---

### 4.5 Get Shipment Alerts

Retrieves active shipment alerts derived from the pipeline output. Alerts include temperature excursions, humidity excursions, low battery, shipment delays, high shock/vibration events, and critical-risk classifications.

| Property | Value |
|----------|-------|
| **Endpoint** | `/alerts` |
| **Method** | `GET` |
| **Tag** | Alerts |
| **Purpose** | Retrieve active shipment alerts sorted by severity |

#### Request

**Query Parameters**:

| Parameter | Type | Default | Min | Max | Description |
|-----------|------|---------|-----|-----|-------------|
| `limit` | integer | `100` | `1` | `1000` | Maximum number of alerts to return (sorted by severity, then timestamp) |

#### Response

**Response Model**: `dict[str, object]`

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request was processed successfully |
| `message` | string | Status message describing the result |
| `count` | integer | Number of alerts returned |
| `total_active` | integer | (Optional) Total active alerts in the system |
| `alerts` | array[object] | List of alert items |

**Alert Item Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `alert_id` | string | Unique alert identifier (e.g., `ALT-TEMP-SHP00A1-0001`) |
| `severity` | string | Alert severity: `"critical"`, `"high"`, `"medium"`, or `"low"` |
| `label` | string | Short human-readable label (e.g., `"Temperature Excursion"`) |
| `message` | string | Descriptive alert message with recommended action |
| `timestamp` | string | ISO 8601 timestamp of the alert event |
| `shipment_id` | string | Associated shipment identifier |

#### Example

**Request**:
```bash
curl "http://localhost:8000/alerts?limit=5"
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Found 5 active alert(s).",
  "count": 5,
  "total_active": 47,
  "alerts": [
    {
      "alert_id": "ALT-CRIS-SHP00A1-0001",
      "severity": "critical",
      "label": "Critical Risk",
      "message": "Shipment classified as Critical Risk — quarantine and escalate.",
      "timestamp": "2025-01-15 14:30:00",
      "shipment_id": "SHP00A1"
    },
    {
      "alert_id": "ALT-TEMP-SHP00B2-0002",
      "severity": "high",
      "label": "Temperature Excursion",
      "message": "Temperature excursion detected — immediate inspection required.",
      "timestamp": "2025-01-15 14:30:00",
      "shipment_id": "SHP00B2"
    }
  ]
}
```

**Response** (no alerts):
```json
{
  "success": true,
  "message": "No active alerts found.",
  "count": 0,
  "alerts": []
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Alerts retrieved successfully (list may be empty) |
| 500 | Internal server error while retrieving alerts |

---

### 4.6 Get Dashboard Dataset

Returns the processed dashboard dataset as raw CSV text for direct ingestion by dashboards and reporting tools.

| Property | Value |
|----------|-------|
| **Endpoint** | `/dashboard/final-data` |
| **Method** | `GET` |
| **Tag** | Dashboard |
| **Purpose** | Retrieve the processed dashboard dataset in CSV format |

#### Request

**Parameters**: None

**Request Body**: None

#### Response

**Response Model**: `dict[str, object]`

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the dataset was loaded successfully |
| `message` | string | Status message |
| `csv` | string | Complete dashboard dataset in CSV format with header row |

#### Example

**Request**:
```bash
curl http://localhost:8000/dashboard/final-data
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Dashboard dataset loaded successfully.",
  "csv": "Shipment ID,Product Name,Origin City,Temperature,Humidity,...\nSHP-ABC123,Apple,Kolkata,2.5,65.0,...\n..."
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Dashboard dataset loaded successfully |
| 404 | Dashboard CSV file not found (run pipeline first) |
| 500 | Internal server error while loading dataset |

---

### 4.7 Reports Module Status

Returns the current status of the reporting module.

| Property | Value |
|----------|-------|
| **Endpoint** | `/reports/status` |
| **Method** | `GET` |
| **Tag** | Reports |
| **Purpose** | Check the availability and generation mode of reports |

#### Request

**Parameters**: None

**Request Body**: None

#### Response

**Response Model**: `dict[str, object]`

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the status was retrieved successfully |
| `status` | string | Module status (`"available"`) |
| `message` | string | Description of report generation |
| `generation_mode` | string | How reports are generated (`"pipeline"`) |

#### Example

**Request**:
```bash
curl http://localhost:8000/reports/status
```

**Response** (200 OK):
```json
{
  "success": true,
  "status": "available",
  "message": "Reports are generated by the analytics pipeline.",
  "generation_mode": "pipeline"
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Reports module status retrieved successfully |

---

### 4.8 Shipment Processing

Provides information about shipment processing. The actual processing is handled through the analytics pipeline.

| Property | Value |
|----------|-------|
| **Endpoint** | `/shipment/run` |
| **Method** | `POST` |
| **Tag** | Shipment |
| **Purpose** | Shipment processing entry point (redirects to analytics pipeline) |

#### Request

**Parameters**: None

**Request Body**: None

#### Response

**Response Model**: `dict[str, object]`

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the request was processed |
| `status` | string | Processing status (`"redirect"`) |
| `message` | string | Explanation of shipment processing |
| `endpoint` | string | Reference to the actual processing endpoint |

#### Example

**Request**:
```bash
curl -X POST http://localhost:8000/shipment/run
```

**Response** (200 OK):
```json
{
  "success": true,
  "status": "redirect",
  "message": "Shipment processing is handled by the analytics pipeline.",
  "endpoint": "/analytics/run"
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Shipment processing information returned |

---

### 4.9 Map Module Status

Returns the current availability and configuration of the shipment map module.

| Property | Value |
|----------|-------|
| **Endpoint** | `/map/status` |
| **Method** | `GET` |
| **Tag** | Map |
| **Purpose** | Check map module availability and data source |

#### Request

**Parameters**: None

**Request Body**: None

#### Response

**Response Model**: `dict[str, object]`

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the status was retrieved successfully |
| `status` | string | Module status (`"available"`) |
| `message` | string | Description of map data source |
| `source` | string | Data source identifier (`"Dashboard Export"`) |
| `tracking_enabled` | boolean | Whether real-time tracking is enabled (`false`) |

#### Example

**Request**:
```bash
curl http://localhost:8000/map/status
```

**Response** (200 OK):
```json
{
  "success": true,
  "status": "available",
  "message": "Map data is currently generated from dashboard export files.",
  "source": "Dashboard Export",
  "tracking_enabled": false
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Map module status retrieved successfully |

---

## 5. Error Codes

### HTTP Status Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| `200 OK` | Request processed successfully | Normal operation |
| `404 Not Found` | Requested resource not found | Dashboard CSV not generated yet |
| `422 Unprocessable Entity` | Validation failed | Invalid query parameter values |
| `500 Internal Server Error` | Unexpected server error | Pipeline execution failure, missing dependencies |

### Error Response Format

All error responses follow this structure:

```json
{
  "detail": "Human-readable error description"
}
```

### Common Error Scenarios

| Scenario | Status Code | Error Message |
|----------|-------------|---------------|
| Dashboard CSV not found | 404 | `"Dashboard dataset not found."` |
| Pipeline execution failure | 500 | `"Failed to execute analytics pipeline."` |
| Risk assessment failure | 500 | `"Failed to execute risk assessment."` |
| Recommendation failure | 500 | `"Failed to execute recommendation pipeline."` |
| Alert retrieval failure | 500 | `"Unable to retrieve alerts."` |
| Dashboard load failure | 500 | `"Unable to load dashboard dataset."` |

---

## 6. Interactive Documentation

AtmoSync AI provides auto-generated API documentation through two interfaces:

### Swagger UI

**URL**: `http://localhost:8000/docs`

- Interactive API playground with "Try it out" functionality
- View request/response schemas
- Test endpoints directly from the browser

### ReDoc

**URL**: `http://localhost:8000/redoc`

- Clean, two-panel API reference documentation
- Full schema browsing
- Searchable endpoint list

---

<p align="center">
  <b>AtmoSync AI</b> — Intelligent Cold Chain Analytics for a Safer Supply Chain.
</p>

