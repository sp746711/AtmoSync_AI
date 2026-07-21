/**
 * Report service.
 *
 * Provides API methods for generating, downloading,
 * and listing reports.
 */

import api from './api';

// ─── Get Reports ───────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of generated reports.
 *
 * @param {object}        [params]        - Query parameters
 * @param {number}        [params.page]   - Page number
 * @param {number}        [params.limit]  - Items per page
 * @param {string}        [params.type]   - Filter by report type
 * @param {string}        [params.sortBy] - Sort field
 * @param {'asc'|'desc'}  [params.order]  - Sort direction
 * @returns {Promise<{ reports: object[], total: number, page: number, limit: number }>}
 */
export async function getReports(params = {}) {
  const { data } = await api.get('/reports', { params });
  return data;
}

// ─── Generate Report ───────────────────────────────────────────────────────

/**
 * Generate a new report based on the provided configuration.
 *
 * @param {object}   config           - Report generation configuration
 * @param {string}   config.type      - Report type (e.g., 'executive', 'analytics')
 * @param {string}   config.format    - Output format (e.g., 'pdf', 'excel', 'csv')
 * @param {string}   [config.startDate] - Start date filter
 * @param {string}   [config.endDate]   - End date filter
 * @param {string[]} [config.metrics]   - Metrics to include
 * @returns {Promise<{ reportId: string, status: string }>}
 */
export async function generateReport(config) {
  const { data } = await api.post('/reports/generate', config);
  return data;
}

// ─── Download Report ───────────────────────────────────────────────────────

/**
 * Download a report file as a Blob.
 *
 * @param {string} id     - Report ID
 * @param {string} format - File format ('pdf', 'excel', 'csv')
 * @returns {Promise<Blob>}
 */
export async function downloadReport(id, format = 'pdf') {
  const { data } = await api.get(`/reports/${id}/download`, {
    params: { format },
    responseType: 'blob',
  });
  return data;
}

// ─── Report History ────────────────────────────────────────────────────────

/**
 * Fetch the complete history of report generation activities.
 *
 * @param {object}        [params]        - Query parameters
 * @param {number}        [params.page]   - Page number
 * @param {number}        [params.limit]  - Items per page
 * @returns {Promise<object[]>}
 */
export async function getReportHistory(params = {}) {
  const { data } = await api.get('/reports/history', { params });
  return data;
}

// ─── Report Status ─────────────────────────────────────────────────────────

/**
 * Fetch the current status of the report generation system.
 *
 * @returns {Promise<{ status: string }>}
 */
export async function getReportStatus() {
  const { data } = await api.get('/reports/status');
  return data;
}

