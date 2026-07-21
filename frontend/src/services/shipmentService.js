/**
 * Shipment service.
 *
 * Provides API methods for shipment listing, details,
 * history, tracking, temperature history, and live status.
 */

import api from './api';

// ─── Get Shipments ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated, filterable list of shipments.
 *
 * @param {object}        [params]        - Query parameters
 * @param {number}        [params.page]   - Page number
 * @param {number}        [params.limit]  - Items per page
 * @param {string}        [params.status] - Filter by status
 * @param {string}        [params.search] - Search query
 * @param {string}        [params.sortBy] - Sort field
 * @param {'asc'|'desc'}  [params.order]  - Sort direction
 * @returns {Promise<{ shipments: object[], total: number, page: number, limit: number }>}
 */
export async function getShipments(params = {}) {
  const { data } = await api.get('/shipments', { params });
  return data;
}

// ─── Shipment Details ──────────────────────────────────────────────────────

/**
 * Fetch detailed information for a specific shipment.
 *
 * @param {string} id - Shipment ID
 * @returns {Promise<object>}
 */
export async function getShipmentDetails(id) {
  const { data } = await api.get(`/shipments/${id}`);
  return data;
}

// ─── Shipment History ──────────────────────────────────────────────────────

/**
 * Fetch the history trail for a shipment.
 *
 * @param {string} id - Shipment ID
 * @returns {Promise<object[]>}
 */
export async function getShipmentHistory(id) {
  const { data } = await api.get(`/shipments/${id}/history`);
  return data;
}

// ─── Shipment Tracking ─────────────────────────────────────────────────────

/**
 * Fetch real-time tracking data for a shipment.
 *
 * @param {string} id - Shipment ID
 * @returns {Promise<object>}
 */
export async function getShipmentTracking(id) {
  const { data } = await api.get(`/shipments/${id}/tracking`);
  return data;
}

// ─── Temperature History ───────────────────────────────────────────────────

/**
 * Fetch temperature history data for a shipment.
 *
 * @param {string} id - Shipment ID
 * @returns {Promise<object[]>}
 */
export async function getTemperatureHistory(id) {
  const { data } = await api.get(`/shipments/${id}/temperature`);
  return data;
}

// ─── Live Shipment Status ──────────────────────────────────────────────────

/**
 * Fetch the live status of all active shipments.
 *
 * @returns {Promise<object[]>}
 */
export async function getLiveShipmentStatus() {
  const { data } = await api.get('/shipments/live');
  return data;
}

// ─── Run Shipment Pipeline ─────────────────────────────────────────────────

/**
 * Trigger the shipment analytics pipeline.
 *
 * @returns {Promise<{ status: string }>}
 */
export async function runShipment() {
  const { data } = await api.post('/shipment/run');
  return data;
}

