/**
 * Report service.
 *
 * Provides API methods for report status.
 * Only includes methods that map to real FastAPI backend endpoints.
 */

import api from './api';
import { REPORTS } from '../config/apiConfig';

/**
 * Fetch the current status of the report generation system.
 *
 * Backend: GET /reports/status
 *
 * @returns {Promise<{ success: boolean, status: string, message: string, generation_mode: string }>}
 */
export async function getReportStatus() {
  const { data } = await api.get(REPORTS.STATUS);
  return data;
}
