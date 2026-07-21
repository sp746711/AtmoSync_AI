/**
 * Centralized Axios instance for AtmoSync AI.
 *
 * Provides base URL, timeout, JSON headers,
 * request interceptor (auth token),
 * response interceptor (401 handling, error normalization),
 * and reusable error helpers.
 */

import axios from 'axios';

// ─── Base Configuration ─────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ───────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // 401 Unauthorized → clear session & redirect to login
      if (status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Network error (no response received)
      const networkError = new Error(
        'Network error. Please check your internet connection and try again.',
      );
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    return Promise.reject(normalizeError(error));
  },
);

// ─── Error Normalizer ───────────────────────────────────────────────────────

/**
 * Normalizes Axios errors into a consistent shape.
 *
 * @param {import('axios').AxiosError} error
 * @returns {Error}
 */
function normalizeError(error) {
  if (error.isNetworkError) {
    return error;
  }

  const { response } = error;
  let message = 'An unexpected error occurred. Please try again.';

  if (response?.data) {
    // Common API error response patterns
    message =
      response.data.detail ||
      response.data.message ||
      response.data.error ||
      (Array.isArray(response.data) ? response.data.map((e) => e.msg).join(', ') : null) ||
      message;
  }

  const normalized = new Error(message);
  normalized.status = response?.status;
  normalized.statusText = response?.statusText;
  normalized.originalError = error;
  normalized.isApiError = true;

  return normalized;
}

// ─── Helper: Extract error message ─────────────────────────────────────────

/**
 * Safely extracts a human-readable error message from any caught value.
 *
 * @param {unknown} err - The caught value (Error, string, etc.)
 * @returns {string}
 */
export function getErrorMessage(err) {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'An unexpected error occurred.';
}

/**
 * Checks whether an error is a 401 authentication error.
 *
 * @param {unknown} err
 * @returns {boolean}
 */
export function isAuthError(err) {
  return err?.status === 401 || err?.statusText === 'Unauthorized';
}

export default api;

