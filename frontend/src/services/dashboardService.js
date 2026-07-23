/**
 * Dashboard service.
 *
 * Provides API methods for the dashboard.
 * Only includes methods that map to real FastAPI backend endpoints.
 */

import api from './api';
import { DASHBOARD } from '../config/apiConfig';

/**
 * Fetch the final dashboard data CSV content (raw string).
 *
 * Backend: GET /dashboard/final-data
 *
 * @returns {Promise<{ success: boolean, message: string, csv: string }>}
 */
export async function getFinalDashboardData() {
  const { data } = await api.get(DASHBOARD.FINAL_DATA);
  return data;
}
