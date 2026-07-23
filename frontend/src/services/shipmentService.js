/**
 * Shipment service.
 *
 * Provides API methods for shipment pipeline execution.
 * Only includes methods that map to real FastAPI backend endpoints.
 */

import api from './api';
import { SHIPMENTS } from '../config/apiConfig';

/**
 * Trigger the shipment analytics pipeline.
 *
 * Backend: POST /shipment/run
 * Note: Shipment processing is handled by the analytics pipeline.
 * This endpoint redirects to /analytics/run.
 *
 * @returns {Promise<{ success: boolean, status: string, message: string, endpoint: string }>}
 */
export async function runShipment() {
  const { data } = await api.post(SHIPMENTS.RUN);
  return data;
}
