/**
 * Risk service.
 *
 * Provides API methods for risk analysis,
 * risk alerts, high-risk shipments, and risk history.
 */

import api from './api';

// ─── Risk Analysis ─────────────────────────────────────────────────────────

/**
 * Fetch comprehensive risk analysis data.
 *
 * @param {object}        [params]          - Query parameters
 * @param {string}        [params.startDate] - Start date filter
 * @param {string}        [params.endDate]   - End date filter
 * @param {string}        [params.severity]  - Filter by severity level
 * @returns {Promise<object>}
 */
export async function getRiskAnalysis(params = {}) {
  const { data } = await api.get('/risk/analysis', { params });
  return data;
}

// ─── Risk Alerts ───────────────────────────────────────────────────────────

/**
 * Fetch active risk alerts.
 *
 * @returns {Promise<object[]>}
 */
export async function getRiskAlerts() {
  const { data } = await api.get('/risk/alerts');
  return data;
}

// ─── High-Risk Shipments ───────────────────────────────────────────────────

/**
 * Fetch shipments currently flagged as high-risk.
 *
 * @returns {Promise<object[]>}
 */
export async function getHighRiskShipments() {
  const { data } = await api.get('/risk/high-risk');
  return data;
}

// ─── Risk History ──────────────────────────────────────────────────────────

/**
 * Fetch historical risk assessment records.
 *
 * @param {object}        [params]         - Query parameters
 * @param {number}        [params.page]    - Page number
 * @param {number}        [params.limit]   - Items per page
 * @param {string}        [params.sortBy]  - Sort field
 * @param {'asc'|'desc'}  [params.order]   - Sort direction
 * @returns {Promise<object[]>}
 */
export async function getRiskHistory(params = {}) {
  const { data } = await api.get('/risk/history', { params });
  return data;
}

// ─── Run Risk Assessment ───────────────────────────────────────────────────

/**
 * Trigger the risk assessment pipeline.
 *
 * @returns {Promise<{ exit_code: number }>}
 */
export async function runRiskAssessment() {
  const { data } = await api.post('/risk/run');
  return data;
}

