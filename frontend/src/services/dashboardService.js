/**
 * Dashboard service.
 *
 * Provides API methods for the Executive Dashboard:
 * summary cards, KPIs, charts, and statistics.
 */

import api from './api';

// ─── Summary Cards ─────────────────────────────────────────────────────────

/**
 * Fetch executive summary cards data.
 *
 * @returns {Promise<object>} Summary card metrics
 */
export async function getSummaryCards() {
  const { data } = await api.get('/dashboard/summary');
  return data;
}

// ─── KPIs ──────────────────────────────────────────────────────────────────

/**
 * Fetch dashboard KPIs.
 *
 * @returns {Promise<object>} Key performance indicators
 */
export async function getKPIs() {
  const { data } = await api.get('/dashboard/kpis');
  return data;
}

// ─── Charts ────────────────────────────────────────────────────────────────

/**
 * Fetch chart data for the dashboard.
 *
 * @returns {Promise<object>} Chart datasets
 */
export async function getCharts() {
  const { data } = await api.get('/dashboard/charts');
  return data;
}

// ─── Dashboard Statistics ──────────────────────────────────────────────────

/**
 * Fetch comprehensive dashboard statistics.
 *
 * @returns {Promise<object>} Dashboard stats
 */
export async function getDashboardStats() {
  const { data } = await api.get('/dashboard/stats');
  return data;
}

// ─── Final Dashboard CSV Data ──────────────────────────────────────────────

/**
 * Fetch the final dashboard data CSV content (raw string).
 *
 * @returns {Promise<{ csv: string }>}
 */
export async function getFinalDashboardData() {
  const { data } = await api.get('/dashboard/final-data');
  return data;
}

