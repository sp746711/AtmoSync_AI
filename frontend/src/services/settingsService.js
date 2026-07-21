/**
 * Settings service.
 *
 * Provides API methods for application settings:
 * retrieving and updating settings, theme, language, and preferences.
 */

import api from './api';

// ─── Get Settings ──────────────────────────────────────────────────────────

/**
 * Fetch all application settings for the current user.
 *
 * @returns {Promise<object>}
 */
export async function getSettings() {
  const { data } = await api.get('/settings');
  return data;
}

// ─── Update Settings ───────────────────────────────────────────────────────

/**
 * Update multiple application settings at once.
 *
 * @param {object} settings - Settings key-value pairs to update
 * @returns {Promise<object>}
 */
export async function updateSettings(settings) {
  const { data } = await api.put('/settings', settings);
  return data;
}

// ─── Update Theme ──────────────────────────────────────────────────────────

/**
 * Update the application theme.
 *
 * @param {'light'|'dark'|'system'} theme - Theme preference
 * @returns {Promise<{ theme: string }>}
 */
export async function updateTheme(theme) {
  const { data } = await api.patch('/settings/theme', { theme });
  return data;
}

// ─── Update Language ───────────────────────────────────────────────────────

/**
 * Update the application language.
 *
 * @param {string} language - Language code (e.g., 'en', 'hi', 'bn')
 * @returns {Promise<{ language: string }>}
 */
export async function updateLanguage(language) {
  const { data } = await api.patch('/settings/language', { language });
  return data;
}

// ─── Update Preferences ────────────────────────────────────────────────────

/**
 * Update granular user preferences.
 *
 * @param {object} preferences - Preference key-value pairs
 * @returns {Promise<object>}
 */
export async function updatePreferences(preferences) {
  const { data } = await api.patch('/settings/preferences', preferences);
  return data;
}

