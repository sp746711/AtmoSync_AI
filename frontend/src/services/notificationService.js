/**
 * Notification service.
 *
 * Provides API methods for managing notifications,
 * including fetching, marking as read, deleting,
 * and managing notification preferences.
 */

import api from './api';

// ─── Get Notifications ─────────────────────────────────────────────────────

/**
 * Fetch a paginated list of notifications for the current user.
 *
 * @param {object}         [params]            - Query parameters
 * @param {number}         [params.page]       - Page number
 * @param {number}         [params.limit]      - Items per page
 * @param {boolean|string} [params.unreadOnly] - Filter unread only
 * @param {string}         [params.type]       - Filter by notification type
 * @returns {Promise<{ notifications: object[], total: number, unreadCount: number }>}
 */
export async function getNotifications(params = {}) {
  const { data } = await api.get('/notifications', { params });
  return data;
}

// ─── Mark as Read ──────────────────────────────────────────────────────────

/**
 * Mark a single notification as read.
 *
 * @param {string} id - Notification ID
 * @returns {Promise<object>}
 */
export async function markAsRead(id) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
}

// ─── Mark All as Read ──────────────────────────────────────────────────────

/**
 * Mark all notifications as read for the current user.
 *
 * @returns {Promise<{ message: string }>}
 */
export async function markAllAsRead() {
  const { data } = await api.patch('/notifications/read-all');
  return data;
}

// ─── Delete Notification ───────────────────────────────────────────────────

/**
 * Delete a specific notification.
 *
 * @param {string} id - Notification ID
 * @returns {Promise<void>}
 */
export async function deleteNotification(id) {
  await api.delete(`/notifications/${id}`);
}

// ─── Get Notification Preferences ──────────────────────────────────────────

/**
 * Fetch the current user's notification preferences.
 *
 * @returns {Promise<object>}
 */
export async function getNotificationPreferences() {
  const { data } = await api.get('/notifications/preferences');
  return data;
}

// ─── Update Notification Preferences ───────────────────────────────────────

/**
 * Update the current user's notification preferences.
 *
 * @param {object} preferences - Notification preference settings
 * @returns {Promise<object>}
 */
export async function updateNotificationPreferences(preferences) {
  const { data } = await api.put('/notifications/preferences', preferences);
  return data;
}

