/**
 * Application Configuration for AtmoSync AI.
 *
 * Mirrors backend/config/config.py constants required by the frontend.
 * Provides pagination, date/time, currency, sensor ranges, product
 * categories, risk thresholds, and financial defaults — all aligned
 * with the backend data pipeline.
 *
 * Backend Features Covered:
 *   - Dashboard               - Risk Assessment
 *   - Shipment Monitoring     - Financial Loss
 *   - Temperature Monitoring  - Recommendation Engine
 *   - Humidity Monitoring     - Reports
 *   - Battery Monitoring      - Alerts
 *   - Delay Prediction        - Business Insights
 */

// ─── Project Information ───────────────────────────────────────────────────

export const PROJECT = {
  NAME: 'AtmoSync AI',
  VERSION: '1.0.0',
  DESCRIPTION: 'Smart Cold Chain Monitoring & Spoilage Risk Analytics System',
};

// ─── Date & Time Formats ───────────────────────────────────────────────────

export const DATE_FORMATS = {
  /** Standard date format (matches backend: %Y-%m-%d) */
  DATE: 'YYYY-MM-DD',
  /** Date-time format (matches backend: %Y-%m-%d %H:%M:%S) */
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  /** Timezone (matches backend: Asia/Kolkata) */
  TIMEZONE: 'Asia/Kolkata',
  /** Display-friendly date format */
  DISPLAY_DATE: 'MMM D, YYYY',
  /** Display-friendly date-time format */
  DISPLAY_DATETIME: 'MMM D, YYYY h:mm A',
};

// ─── Pagination Defaults ───────────────────────────────────────────────────

export const PAGINATION = {
  /** Default items per page */
  DEFAULT_LIMIT: 20,
  /** Maximum items per page */
  MAX_LIMIT: 100,
  /** Default page number */
  DEFAULT_PAGE: 1,
  /** Default sort direction */
  DEFAULT_ORDER: 'desc',
  /** Page size options for selectors */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// ─── Currency & Financial ──────────────────────────────────────────────────

export const FINANCIAL = {
  /** Currency code (matches backend CURRENCY) */
  CURRENCY: 'INR',
  /** Currency symbol */
  CURRENCY_SYMBOL: '₹',
  /** Default delay cost per hour (matches backend DELAY_COST_PER_HOUR) */
  DELAY_COST_PER_HOUR: 500,
  /** Spoilage cost percentage fallback (matches backend SPOILAGE_COST_PERCENTAGE) */
  SPOILAGE_COST_PERCENTAGE: 0.15,
  /** Insurance premium percentage (matches backend INSURANCE_COST_PERCENTAGE) */
  INSURANCE_COST_PERCENTAGE: 0.02,
  /** Fuel cost per liter (matches backend FUEL_COST_PER_LITER) */
  FUEL_COST_PER_LITER: 90,
};

// ─── Product Categories (matches backend PRODUCT_CATEGORIES) ───────────────

export const PRODUCT_CATEGORIES = [
  'Vaccines',
  'Medicines',
  'Dairy Products',
  'Frozen Foods',
  'Seafood',
  'Fresh Fruits',
  'Fresh Vegetables',
  'Meat',
  'Poultry',
  'Ice Cream',
  'Chocolate',
  'Bakery Products',
];

// ─── Product Names (matches backend PRODUCT_NAMES) ─────────────────────────

export const PRODUCT_NAMES = [
  'COVID-19 Vaccine',
  'Polio Vaccine',
  'BCG Vaccine',
  'Insulin',
  'Paracetamol Syrup',
  'Milk',
  'Butter',
  'Cheese',
  'Curd',
  'Paneer',
  'Ice Cream',
  'Chicken',
  'Mutton',
  'Fish',
  'Prawns',
  'Salmon',
  'Frozen Meat',
  'Frozen Pizza',
  'Frozen Peas',
  'Frozen French Fries',
  'Apple',
  'Banana',
  'Orange',
  'Grapes',
  'Tomato',
  'Potato',
  'Onion',
  'Carrot',
  'Broccoli',
  'Lettuce',
  'Chocolate',
  'Bread',
  'Cake',
];

// ─── Vehicle Types (matches backend VEHICLE_TYPES) ─────────────────────────

export const VEHICLE_TYPES = [
  'Refrigerated Truck',
  'Refrigerated Van',
  'Cold Storage Container',
  'Reefer Trailer',
  'Mini Reefer Truck',
  'Insulated Container',
];

// ─── Indian Cities (matches backend INDIAN_CITIES) ─────────────────────────

export const INDIAN_CITIES = [
  'Kolkata',
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Patna',
  'Bhubaneswar',
  'Ranchi',
  'Guwahati',
  'Siliguri',
  'Durgapur',
  'Asansol',
  'Nagpur',
  'Indore',
  'Bhopal',
  'Visakhapatnam',
  'Kochi',
  'Coimbatore',
  'Surat',
  'Noida',
  'Gurugram',
  'Kanpur',
  'Varanasi',
  'Chandigarh',
  'Srinagar',
];

// ─── Transport Modes (matches backend TRANSPORT_MODES) ─────────────────────

export const TRANSPORT_MODES = ['Road', 'Rail', 'Air', 'Sea'];

// ─── Sensor Ranges (matches backend SENSOR_*_RANGE) ────────────────────────

export const SENSOR_RANGES = {
  TEMPERATURE: { MIN_C: -25.0, MAX_C: 15.0 },
  HUMIDITY: { MIN_PERCENT: 20.0, MAX_PERCENT: 100.0 },
  BATTERY: { MIN_PERCENT: 0.0, MAX_PERCENT: 100.0 },
  VIBRATION: { MIN_M_S2: 0.0, MAX_M_S2: 20.0 },
  SHOCK: { MIN_G: 0.0, MAX_G: 500.0 },
  DELAY_HOURS: { MIN_HOURS: 0.0, MAX_HOURS: 72.0 },
};

// ─── Product Storage Temperatures (matches backend PRODUCT_STORAGE_TEMPERATURES) ──

export const PRODUCT_STORAGE_TEMPERATURES = {
  Vaccines: { MIN_C: -25.0, MAX_C: -15.0, OPTIMAL_C: -20.0 },
  Medicines: { MIN_C: 2.0, MAX_C: 8.0, OPTIMAL_C: 5.0 },
  'Dairy Products': { MIN_C: 2.0, MAX_C: 6.0, OPTIMAL_C: 4.0 },
  'Frozen Foods': { MIN_C: -25.0, MAX_C: -15.0, OPTIMAL_C: -18.0 },
  Seafood: { MIN_C: -5.0, MAX_C: 2.0, OPTIMAL_C: 0.0 },
  'Fresh Fruits': { MIN_C: 2.0, MAX_C: 10.0, OPTIMAL_C: 5.0 },
  'Fresh Vegetables': { MIN_C: 2.0, MAX_C: 8.0, OPTIMAL_C: 4.0 },
  Meat: { MIN_C: -5.0, MAX_C: 2.0, OPTIMAL_C: 0.0 },
  Poultry: { MIN_C: -5.0, MAX_C: 2.0, OPTIMAL_C: 0.0 },
  'Ice Cream': { MIN_C: -30.0, MAX_C: -18.0, OPTIMAL_C: -22.0 },
  Chocolate: { MIN_C: 12.0, MAX_C: 20.0, OPTIMAL_C: 16.0 },
  'Bakery Products': { MIN_C: 2.0, MAX_C: 8.0, OPTIMAL_C: 5.0 },
};

// ─── Alert Thresholds (matches backend ALERT_* thresholds) ─────────────────

export const ALERT_THRESHOLDS = {
  TEMPERATURE_HIGH_C: 12.0,
  TEMPERATURE_LOW_C: -15.0,
  HUMIDITY_HIGH_PERCENT: 90.0,
  HUMIDITY_LOW_PERCENT: 10.0,
  BATTERY_LOW_PERCENT: 20.0,
  DELAY_HIGH_HOURS: 12.0,
};

// ─── Risk Score Ranges (matches backend business_rules.py) ─────────────────

export const RISK_SCORE_RANGES = {
  LOW: { MIN: 0.0, MAX: 24.9, LABEL: 'Low Risk' },
  MEDIUM: { MIN: 25.0, MAX: 49.9, LABEL: 'Medium Risk' },
  HIGH: { MIN: 50.0, MAX: 74.9, LABEL: 'High Risk' },
  CRITICAL: { MIN: 75.0, MAX: 100.0, LABEL: 'Critical Risk' },
};

// ─── Product Financial Values (matches backend business_rules.py) ──────────

export const PRODUCT_VALUES = {
  'COVID-19 Vaccine': 1200.0,
  'Polio Vaccine': 950.0,
  'BCG Vaccine': 800.0,
  Insulin: 600.0,
  'Paracetamol Syrup': 90.0,
  Milk: 12.0,
  Butter: 220.0,
  Cheese: 350.0,
  Curd: 16.0,
  Paneer: 180.0,
  'Ice Cream': 140.0,
  'Frozen Meat': 280.0,
  'Frozen Pizza': 240.0,
  'Frozen Peas': 95.0,
  'Frozen French Fries': 110.0,
  Chicken: 260.0,
  Mutton: 420.0,
  Fish: 320.0,
  Prawns: 520.0,
  Salmon: 450.0,
  Apple: 18.0,
  Banana: 14.0,
  Orange: 20.0,
  Grapes: 35.0,
  Tomato: 22.0,
  Potato: 12.0,
  Onion: 10.0,
  Carrot: 14.0,
  Broccoli: 28.0,
  Lettuce: 26.0,
  Chocolate: 85.0,
  Bread: 25.0,
  Cake: 120.0,
};

// ─── Spoilage Percentages (matches backend business_rules.py) ──────────────

export const SPOILAGE_PERCENTAGE_BY_RISK = {
  'Low Risk': 0.02,
  'Medium Risk': 0.06,
  'High Risk': 0.14,
  'Critical Risk': 0.28,
};

// ─── Estimated Loss Percentages (matches backend business_rules.py) ────────

export const ESTIMATED_LOSS_PERCENTAGE_BY_RISK = {
  'Low Risk': 0.03,
  'Medium Risk': 0.10,
  'High Risk': 0.22,
  'Critical Risk': 0.40,
};

// ─── KPI Tier Rules (matches backend business_rules.py) ────────────────────

export const KPI_TIERS = {
  EXCELLENT: { MIN: 95.0, MAX: 100.0, LABEL: 'Excellent', SEVERITY: 'low' },
  GOOD: { MIN: 80.0, MAX: 94.9, LABEL: 'Good', SEVERITY: 'low' },
  AVERAGE: { MIN: 60.0, MAX: 79.9, LABEL: 'Average', SEVERITY: 'medium' },
  POOR: { MIN: 40.0, MAX: 59.9, LABEL: 'Poor', SEVERITY: 'high' },
  CRITICAL: { MIN: 0.0, MAX: 39.9, LABEL: 'Critical', SEVERITY: 'critical' },
};

// ─── Safety Business Rules (matches backend business_rules.py) ─────────────

export const SAFETY_RULES = {
  TEMPERATURE: {
    SAFE: { MIN_C: -5.0, MAX_C: 5.0 },
    WARNING: { MIN_C: -10.0, MAX_C: 8.0 },
    CRITICAL: { MIN_C: -15.0, MAX_C: 12.0 },
  },
  HUMIDITY: {
    SAFE: { MIN_PERCENT: 30.0, MAX_PERCENT: 70.0 },
    WARNING: { MIN_PERCENT: 20.0, MAX_PERCENT: 80.0 },
    CRITICAL: { MIN_PERCENT: 10.0, MAX_PERCENT: 90.0 },
  },
  BATTERY: {
    SAFE: { MIN_PERCENT: 40.0, MAX_PERCENT: 100.0 },
    WARNING: { MIN_PERCENT: 20.0, MAX_PERCENT: 39.0 },
    CRITICAL: { MIN_PERCENT: 0.0, MAX_PERCENT: 19.0 },
  },
  DELAY: {
    SAFE: { MIN_HOURS: 0.0, MAX_HOURS: 4.0 },
    WARNING: { MIN_HOURS: 4.1, MAX_HOURS: 12.0 },
    CRITICAL: { MIN_HOURS: 12.1, MAX_HOURS: 9999.0 },
  },
};

