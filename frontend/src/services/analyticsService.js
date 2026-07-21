/**
 * Analytics service.
 *
 * Provides API methods for the analytics dashboard,
 * temperature analytics, performance metrics,
 * monthly statistics, and AI-powered insights.
 */

import api from './api';

// ─── Analytics Dashboard ───────────────────────────────────────────────────

/**
 * Fetch the main analytics dashboard data.
 *
 * @param {object}        [params]          - Query parameters
 * @param {string}        [params.startDate] - Start date filter
 * @param {string}        [params.endDate]   - End date filter
 * @param {string}        [params.product]   - Product category filter
 * @returns {Promise<object>}
 */
export async function getAnalyticsDashboard(params = {}) {
  const { data } = await api.get('/analytics/dashboard', { params });
  return data;
}

// ─── Temperature Analytics ─────────────────────────────────────────────────

/**
 * Fetch temperature analytics data (trends, anomalies, thresholds).
 *
 * @param {object} [params] - Query parameters
 * @returns {Promise<object>}
 */
export async function getTemperatureAnalytics(params = {}) {
  const { data } = await api.get('/analytics/temperature', { params });
  return data;
}

// ─── Performance Analytics ─────────────────────────────────────────────────

/**
 * Fetch shipment performance analytics (on-time, delays, spoilage).
 *
 * @param {object} [params] - Query parameters
 * @returns {Promise<object>}
 */
export async function getPerformanceAnalytics(params = {}) {
  const { data } = await api.get('/analytics/performance', { params });
  return data;
}

// ─── Monthly Statistics ────────────────────────────────────────────────────

/**
 * Fetch monthly aggregated statistics.
 *
 * @param {object} [params] - Query parameters
 * @returns {Promise<object[]>}
 */
export async function getMonthlyStatistics(params = {}) {
  const { data } = await api.get('/analytics/monthly', { params });
  return data;
}

// ─── AI Insights ───────────────────────────────────────────────────────────

/**
 * Fetch AI-generated insights from the analytics engine.
 *
 * @param {object} [params] - Query parameters
 * @returns {Promise<object[]>}
 */
export async function getAIInsights(params = {}) {
  const { data } = await api.get('/analytics/insights', { params });
  return data;
}

// ─── Run Analytics Pipeline ────────────────────────────────────────────────

/**
 * Trigger the full analytics pipeline execution.
 *
 * @returns {Promise<{ exit_code: number, status: string }>}
 */
export async function runAnalytics() {
  const { data } = await api.post('/analytics/run');
  return data;
}

