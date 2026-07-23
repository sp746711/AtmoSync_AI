/**
 * Analytics service.
 *
 * Provides API methods for the analytics pipeline.
 * Only includes methods that map to real FastAPI backend endpoints.
 */

import api from './api';
import { ANALYTICS } from '../config/apiConfig';

/**
 * Trigger the full analytics pipeline execution.
 *
 * Backend: POST /analytics/run
 *
 * @returns {Promise<{ success: boolean, status: string, exit_code: number, message: string }>}
 */
export async function runAnalytics() {
  const { data } = await api.post(ANALYTICS.RUN);
  return data;
}
