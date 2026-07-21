/**
 * Authentication service.
 *
 * Handles login, logout, registration, token refresh,
 * password management, and current user retrieval.
 */

import api from './api';

// ─── Login ─────────────────────────────────────────────────────────────────

/**
 * Authenticate user with email and password.
 *
 * @param {string} email    - User email address
 * @param {string} password - User password
 * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
 */
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

// ─── Logout ────────────────────────────────────────────────────────────────

/**
 * Logout the current user (invalidate tokens on server).
 *
 * @returns {Promise<void>}
 */
export async function logout() {
  await api.post('/auth/logout');
}

// ─── Register ──────────────────────────────────────────────────────────────

/**
 * Register a new user account.
 *
 * @param {{ name: string, email: string, password: string, confirmPassword?: string }} userData
 * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
 */
export async function register(userData) {
  const { data } = await api.post('/auth/register', userData);
  return data;
}

// ─── Refresh Token ─────────────────────────────────────────────────────────

/**
 * Refresh the access token using the stored refresh token.
 *
 * @param {string} refreshToken - The refresh token
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
export async function refreshToken(refreshToken) {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data;
}

// ─── Get Current User ──────────────────────────────────────────────────────

/**
 * Fetch the currently authenticated user's profile.
 *
 * @returns {Promise<object>}
 */
export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

// ─── Forgot Password ───────────────────────────────────────────────────────

/**
 * Request a password reset email.
 *
 * @param {string} email - Registered email address
 * @returns {Promise<{ message: string }>}
 */
export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
}

// ─── Reset Password ────────────────────────────────────────────────────────

/**
 * Reset password using the token received via email.
 *
 * @param {string} token    - Password reset token
 * @param {string} password - New password
 * @returns {Promise<{ message: string }>}
 */
export async function resetPassword(token, password) {
  const { data } = await api.post('/auth/reset-password', { token, password });
  return data;
}

// ─── Change Password ───────────────────────────────────────────────────────

/**
 * Change password for authenticated user.
 *
 * @param {string} currentPassword - Current password
 * @param {string} newPassword     - New password
 * @returns {Promise<{ message: string }>}
 */
export async function changePassword(currentPassword, newPassword) {
  const { data } = await api.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return data;
}

