/**
 * Recommendation service.
 *
 * Provides API methods for AI-powered recommendations,
 * recommendation history, and recommendation details.
 */

import api from './api';

// ─── Get Recommendations ───────────────────────────────────────────────────

/**
 * Fetch AI-generated recommendations.
 *
 * @param {object}        [params]          - Query parameters
 * @param {string}        [params.category] - Filter by category
 * @param {string}        [params.priority] - Filter by priority level
 * @param {number}        [params.limit]    - Number of recommendations
 * @returns {Promise<object[]>}
 */
export async function getRecommendations(params = {}) {
  const { data } = await api.get('/recommendations', { params });
  return data;
}

// ─── Recommendation History ────────────────────────────────────────────────

/**
 * Fetch historical recommendation records.
 *
 * @param {object}        [params]        - Query parameters
 * @param {number}        [params.page]   - Page number
 * @param {number}        [params.limit]  - Items per page
 * @param {string}        [params.sortBy] - Sort field
 * @param {'asc'|'desc'}  [params.order]  - Sort direction
 * @returns {Promise<object[]>}
 */
export async function getRecommendationHistory(params = {}) {
  const { data } = await api.get('/recommendations/history', { params });
  return data;
}

// ─── Recommendation Details ────────────────────────────────────────────────

/**
 * Fetch detailed information for a specific recommendation.
 *
 * @param {string} id - Recommendation ID
 * @returns {Promise<object>}
 */
export async function getRecommendationDetails(id) {
  const { data } = await api.get(`/recommendations/${id}`);
  return data;
}

// ─── Run Recommendation Engine ─────────────────────────────────────────────

/**
 * Trigger the recommendation engine pipeline.
 *
 * @returns {Promise<{ exit_code: number }>}
 */
export async function runRecommendation() {
  const { data } = await api.post('/recommendation/run');
  return data;
}

