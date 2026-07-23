/**
 * Risk service.
 *
 * Provides API methods for risk assessment.
 * Only includes methods that map to real FastAPI backend endpoints.
 */

import api from './api';
import { RISK } from '../config/apiConfig';

/**
 * Trigger the risk assessment pipeline.
 *
 * Backend: POST /risk/run
 *
 * @returns {Promise<{ success: boolean, status: string, exit_code: number, message: string }>}
 */
export async function runRiskAssessment() {
  const { data } = await api.post(RISK.RUN);
  return data;
}
