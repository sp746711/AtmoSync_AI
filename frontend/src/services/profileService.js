/**
 * Profile service.
 *
 * Provides API methods for user profile management:
 * retrieving, updating, avatar upload, and password change.
 */

import api from './api';

// ─── Get Profile ───────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's profile.
 *
 * @returns {Promise<object>}
 */
export async function getProfile() {
  const { data } = await api.get('/profile');
  return data;
}

// ─── Update Profile ────────────────────────────────────────────────────────

/**
 * Update the authenticated user's profile information.
 *
 * @param {object} profileData          - Profile fields to update
 * @param {string} [profileData.name]   - Display name
 * @param {string} [profileData.email]  - Email address
 * @param {string} [profileData.phone]  - Phone number
 * @param {string} [profileData.bio]    - Short biography
 * @returns {Promise<object>}
 */
export async function updateProfile(profileData) {
  const { data } = await api.put('/profile', profileData);
  return data;
}

// ─── Upload Avatar ─────────────────────────────────────────────────────────

/**
 * Upload a new avatar image for the user.
 *
 * @param {File}   file             - Image file (JPEG, PNG, GIF)
 * @param {object} [options]
 * @param {Function} [options.onUploadProgress] - Upload progress callback
 * @returns {Promise<{ avatarUrl: string }>}
 */
export async function uploadAvatar(file, { onUploadProgress } = {}) {
  const formData = new FormData();
  formData.append('avatar', file);

  const { data } = await api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return data;
}

// ─── Change Password ───────────────────────────────────────────────────────

/**
 * Change the authenticated user's password.
 *
 * @param {string} currentPassword - Current password
 * @param {string} newPassword     - New password
 * @returns {Promise<{ message: string }>}
 */
export async function changePassword(currentPassword, newPassword) {
  const { data } = await api.post('/profile/change-password', {
    currentPassword,
    newPassword,
  });
  return data;
}

