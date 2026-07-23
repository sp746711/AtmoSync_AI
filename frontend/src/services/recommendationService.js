/**
 * Recommendation service.
 *
 * Provides API methods for the recommendation engine.
 * Only includes methods that map to real FastAPI backend endpoints.
 */

import api from './api';
import { RECOMMENDATIONS } from '../config/apiConfig';

/**
 * Trigger the recommendation engine pipeline.
 *
 * Backend: POST /recommendation/run
 *
 * @returns {Promise<{ success: boolean, status: string, exit_code: number, message: string }>}
 */
export async function runRecommendation() {
  const { data } = await api.post(RECOMMENDATIONS.RUN);
  return data;
}
