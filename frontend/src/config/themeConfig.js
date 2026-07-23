/**
 * Theme Configuration for AtmoSync AI.
 *
 * Defines brand colors, semantic color tokens, dark mode overrides,
 * and component-level theme variables consumed by Tailwind CSS
 * via CSS custom properties and React context.
 *
 * Backend Features Covered:
 *   - Dashboard               - Alerts
 *   - Risk Assessment         - Reports
 *   - Recommendation Engine   - Business Insights
 */

// ─── Brand Colors ──────────────────────────────────────────────────────────

export const BRAND = {
  /** Primary brand color (indigo) */
  PRIMARY: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  /** Neutral/gray scale */
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// ─── Semantic Color Tokens ─────────────────────────────────────────────────

export const SEMANTIC = {
  SUCCESS: {
    LIGHT: '#16a34a',
    DARK: '#22c55e',
    LIGHT_BG: '#dcfce7',
    DARK_BG: '#052e16',
  },
  WARNING: {
    LIGHT: '#d97706',
    DARK: '#fbbf24',
    LIGHT_BG: '#fef3c7',
    DARK_BG: '#451a03',
  },
  DANGER: {
    LIGHT: '#dc2626',
    DARK: '#ef4444',
    LIGHT_BG: '#fee2e2',
    DARK_BG: '#450a0a',
  },
  INFO: {
    LIGHT: '#2563eb',
    DARK: '#3b82f6',
    LIGHT_BG: '#dbeafe',
    DARK_BG: '#172554',
  },
};

// ─── Severity Colors (matches backend DASHBOARD_KPI_COLORS) ────────────────

export const SEVERITY = {
  LOW: { COLOR: '#16A34A', BG: '#dcfce7', LABEL: 'Low' },
  MEDIUM: { COLOR: '#F59E0B', BG: '#fef9c3', LABEL: 'Medium' },
  HIGH: { COLOR: '#F97316', BG: '#ffedd5', LABEL: 'High' },
  CRITICAL: { COLOR: '#DC2626', BG: '#fee2e2', LABEL: 'Critical' },
};

// ─── Status Colors ─────────────────────────────────────────────────────────

export const STATUS = {
  ACTIVE: { COLOR: '#22c55e', BG: '#dcfce7' },
  PENDING: { COLOR: '#eab308', BG: '#fef9c3' },
  INACTIVE: { COLOR: '#9ca3af', BG: '#f3f4f6' },
  ERROR: { COLOR: '#ef4444', BG: '#fee2e2' },
  WARNING: { COLOR: '#f97316', BG: '#ffedd5' },
};

// ─── Dark Mode Overrides ───────────────────────────────────────────────────

export const DARK_MODE = {
  /** CSS class applied to root when dark mode is active */
  ROOT_CLASS: 'dark',
  /** Background colors for dark mode */
  BG: {
    PRIMARY: '#111827',
    SECONDARY: '#1f2937',
    TERTIARY: '#374151',
  },
  /** Text colors for dark mode */
  TEXT: {
    PRIMARY: '#f9fafb',
    SECONDARY: '#d1d5db',
    MUTED: '#9ca3af',
  },
  /** Border colors for dark mode */
  BORDER: '#374151',
};

