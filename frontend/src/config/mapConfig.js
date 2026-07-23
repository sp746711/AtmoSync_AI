/**
 * Map Configuration for AtmoSync AI.
 *
 * Provides Leaflet map defaults, tile layer configuration,
 * GPS coordinates, marker styling, and risk visualization
 * settings used by the RiskMap and ShipmentMap components.
 *
 * Backend Features Covered:
 *   - Maps          - Shipment Monitoring
 *   - Risk Assessment - Business Insights
 */

// ─── OpenStreetMap Tile Layer ──────────────────────────────────────────────

export const TILE_LAYER = {
  /** Default tile URL (OpenStreetMap) */
  URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  /** Attribution text (required by OpenStreetMap) */
  ATTRIBUTION: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// ─── Default Map View ──────────────────────────────────────────────────────

export const MAP_DEFAULTS = {
  /** Default center coordinates (India — matches backend GPS defaults) */
  CENTER: [20.5937, 78.9629],
  /** Default zoom level */
  ZOOM: 5,
  /** Maximum zoom */
  MAX_ZOOM: 18,
  /** Minimum zoom */
  MIN_ZOOM: 2,
  /** Default map height in pixels */
  HEIGHT: 400,
  /** Default title for map cards */
  TITLE: 'Risk Map',
};

// ─── GPS Coordinates (matches backend GPS_* config) ────────────────────────

export const GPS = {
  /** Coordinate precision (decimal places) — matches backend GPS_COORDINATE_PRECISION */
  PRECISION: 6,
  /** Fallback latitude (Kolkata, India) — matches backend GPS_DEFAULT_LATITUDE */
  DEFAULT_LATITUDE: 22.5726,
  /** Fallback longitude (Kolkata, India) — matches backend GPS_DEFAULT_LONGITUDE */
  DEFAULT_LONGITUDE: 88.3639,
};

// ─── Marker Defaults ───────────────────────────────────────────────────────

export const MARKER = {
  /** Default marker icon URL (via unpkg Leaflet CDN) */
  ICON_URL: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  /** Default marker retina icon URL */
  ICON_RETINA_URL: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  /** Default marker shadow URL */
  SHADOW_URL: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  /** Circle marker minimum radius in px */
  MIN_RADIUS: 8,
  /** Circle marker radius scaling factor */
  RADIUS_SCALE: 0.3,
};

// ─── Risk Visualization ────────────────────────────────────────────────────

export const RISK_VISUALIZATION = {
  /** Risk circle fill opacity */
  FILL_OPACITY: 0.5,
  /** Risk circle stroke weight */
  STROKE_WEIGHT: 2,
};

