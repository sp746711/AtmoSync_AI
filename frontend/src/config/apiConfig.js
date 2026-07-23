/**
 * API Endpoint Configuration for AtmoSync AI.
 *
 * SINGLE SOURCE OF TRUTH for all frontend API endpoint paths.
 * Every exported path exactly matches a registered FastAPI route
 * in backend/main.py and its corresponding router file.
 *
 * Backend Base URL is configured via VITE_API_BASE_URL env variable
 * (default: http://localhost:8000) in frontend/src/services/api.js.
 *
 * @module apiConfig
 */

// ─── Health ────────────────────────────────────────────────────────────────

/** GET /health — Backend health check */
export const HEALTH = {
  BASE: '/health',
};

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const DASHBOARD = {
  /** GET /dashboard/final-data — Processed CSV dataset for Power BI */
  FINAL_DATA: '/dashboard/final-data',
};

// ─── Analytics ─────────────────────────────────────────────────────────────

export const ANALYTICS = {
  /** POST /analytics/run — Execute full analytics pipeline */
  RUN: '/analytics/run',
};

// ─── Risk Assessment ───────────────────────────────────────────────────────

export const RISK = {
  /** POST /risk/run — Execute risk assessment pipeline */
  RUN: '/risk/run',
};

// ─── Recommendation Engine ─────────────────────────────────────────────────

export const RECOMMENDATIONS = {
  /** POST /recommendation/run — Execute recommendation engine pipeline */
  RUN: '/recommendation/run',
};

// ─── Shipment ──────────────────────────────────────────────────────────────

export const SHIPMENTS = {
  /** POST /shipment/run — Execute shipment analytics pipeline */
  RUN: '/shipment/run',
};

// ─── Alerts ────────────────────────────────────────────────────────────────

export const ALERTS = {
  /** GET /alerts — Active shipment alerts */
  BASE: '/alerts',
};

// ─── Reports ───────────────────────────────────────────────────────────────

export const REPORTS = {
  /** GET /reports/status — Reports module status */
  STATUS: '/reports/status',
};

// ─── Map ───────────────────────────────────────────────────────────────────

export const MAP = {
  /** GET /map/status — Map module availability */
  STATUS: '/map/status',
};

