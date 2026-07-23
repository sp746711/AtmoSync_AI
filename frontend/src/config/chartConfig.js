/**
 * Chart & Visualization Configuration for AtmoSync AI.
 *
 * Provides chart defaults, color palettes, KPI severity colors,
 * risk gradient colors, and Recharts library configuration used
 * by dashboard, analytics, and risk components.
 *
 * Backend Features Covered:
 *   - Dashboard          - Risk Assessment
 *   - Analytics          - Alerts
 *   - Recommendation     - Business Insights
 */

// ─── Default Chart Dimensions ──────────────────────────────────────────────

export const CHART_DEFAULTS = {
  /** Default chart height in pixels */
  HEIGHT: 300,
  /** Default chart width (responsive via Recharts) */
  WIDTH: undefined,
  /** Default margin */
  MARGIN: { TOP: 5, RIGHT: 20, LEFT: 0, BOTTOM: 5 },
  /** Animation duration in ms */
  ANIMATION_DURATION: 300,
  /** Bar corner radius */
  BAR_RADIUS: [4, 4, 0, 0],
};

// ─── Color Palettes ────────────────────────────────────────────────────────

export const CHART_COLORS = {
  /** Primary palette — used in bar/line/pie charts */
  PRIMARY: [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#06b6d4', // Cyan
  ],
  /** Sequential greens — used for on-time/compliance metrics */
  SEQUENTIAL_GREEN: ['#dcfce7', '#86efac', '#22c55e', '#16a34a', '#14532d'],
  /** Sequential reds — used for risk/excursion metrics */
  SEQUENTIAL_RED: ['#fee2e2', '#fca5a5', '#ef4444', '#dc2626', '#7f1d1d'],
  /** Gradient from green to red — used for risk heatmaps */
  RISK_GRADIENT: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
};

// ─── KPI Severity Colors (matches backend DASHBOARD_KPI_COLORS) ────────────

export const KPI_COLORS = {
  EXCELLENT: '#16A34A',
  GOOD: '#22C55E',
  AVERAGE: '#F59E0B',
  POOR: '#F97316',
  CRITICAL: '#DC2626',
};

// ─── Risk Badge Colors ─────────────────────────────────────────────────────

export const RISK_COLORS = {
  /** Risk score thresholds and corresponding colors */
  THRESHOLDS: [
    { MAX: 25, COLOR: '#22c55e', BG: '#dcfce7', LABEL: 'Low' },
    { MAX: 50, COLOR: '#eab308', BG: '#fef9c3', LABEL: 'Medium' },
    { MAX: 75, COLOR: '#f97316', BG: '#ffedd5', LABEL: 'High' },
    { MAX: 100, COLOR: '#ef4444', BG: '#fee2e2', LABEL: 'Critical' },
  ],
};

// ─── Tooltip Style ─────────────────────────────────────────────────────────

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
};

// ─── Axis Styles ───────────────────────────────────────────────────────────

export const CHART_AXIS_STYLE = {
  TICK: { fontSize: 12, fill: '#9ca3af' },
  AXIS_LINE: { stroke: '#e5e7eb' },
  TICK_LINE: false,
  GRID_STROKE_DASHARRAY: '3 3',
  GRID_STROKE: '#e5e7eb',
};

// ─── Empty/Loading States ──────────────────────────────────────────────────

export const CHART_STATES = {
  EMPTY_TITLE: 'No chart data',
  EMPTY_MESSAGE: 'There is no data available to display the chart.',
  SKELETON_VARIANT: 'chart',
};

