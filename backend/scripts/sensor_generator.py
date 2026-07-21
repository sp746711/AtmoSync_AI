from __future__ import annotations

import logging
import logging.config
import random
import uuid

from datetime import datetime, timedelta
from typing import Final

import numpy as np
import pandas as pd

from backend.config.business_rules import (
    BATTERY_CRITICAL_RANGE_PCT_MAX,
    BATTERY_CRITICAL_RANGE_PCT_MIN,
    BATTERY_LOW_THRESHOLD_PCT,
    BATTERY_SAFE_RANGE_PCT_MAX,
    BATTERY_SAFE_RANGE_PCT_MIN,
    HUMIDITY_CRITICAL_RANGE_PERCENT_MAX,
    HUMIDITY_CRITICAL_RANGE_PERCENT_MIN,
    HUMIDITY_SAFE_RANGE_PERCENT_MAX,
    HUMIDITY_SAFE_RANGE_PERCENT_MIN,
    HUMIDITY_WARNING_RANGE_PERCENT_MAX,
    HUMIDITY_WARNING_RANGE_PERCENT_MIN,
    SHIPMENT_DELAY_CRITICAL_RANGE_H_MAX,
    SHIPMENT_DELAY_CRITICAL_RANGE_H_MIN,
    SHIPMENT_DELAY_SAFE_RANGE_H_MAX,
    SHIPMENT_DELAY_SAFE_RANGE_H_MIN,
    SHIPMENT_DELAY_WARNING_RANGE_H_MAX,
    SHIPMENT_DELAY_WARNING_RANGE_H_MIN,
    TEMP_CRITICAL_RANGE_C_MAX,
    TEMP_CRITICAL_RANGE_C_MIN,
    TEMP_SAFE_RANGE_C_MAX,
    TEMP_SAFE_RANGE_C_MIN,
    TEMP_WARNING_RANGE_C_MAX,
    TEMP_WARNING_RANGE_C_MIN,
)
from backend.config.config import (
    DEFAULT_RECORDS,
    DATE_FORMAT,
    DATETIME_FORMAT,
    INDIAN_CITIES,
    LOGGER_NAME,
    PRODUCT_CATEGORIES,
    PRODUCT_NAMES,
    RANDOM_SEED,
    SENSOR_BATTERY_RANGE,
    SENSOR_DELAY_HOURS_RANGE,
    SENSOR_HUMIDITY_RANGE,
    SENSOR_SHOCK_RANGE,
    SENSOR_TEMPERATURE_RANGE,
    SENSOR_VIBRATION_RANGE,
    SENSOR_DATA_CSV,
    TRANSPORT_MODES,
    VEHICLE_TYPES,
    build_production_logging_config,
)


def setup_logging() -> logging.Logger:
    """Configure logging for the script."""

    logging.config.dictConfig(build_production_logging_config())
    return logging.getLogger(LOGGER_NAME)


def clamp(value: float, min_value: float, max_value: float) -> float:
    """Clamp a float value to [min_value, max_value]."""

    return float(max(min_value, min(max_value, value)))


def choose_product(rng: random.Random) -> tuple[str, str]:
    """Choose a product name and a consistent product category."""

    name_to_category: Final[dict[str, str]] = {
        "COVID-19 Vaccine": "Vaccines",
        "Polio Vaccine": "Vaccines",
        "BCG Vaccine": "Vaccines",
        "Insulin": "Medicines",
        "Paracetamol Syrup": "Medicines",
        "Milk": "Dairy Products",
        "Butter": "Dairy Products",
        "Cheese": "Dairy Products",
        "Curd": "Dairy Products",
        "Paneer": "Dairy Products",
        "Ice Cream": "Ice Cream",
        "Chicken": "Meat",
        "Mutton": "Meat",
        "Fish": "Seafood",
        "Prawns": "Seafood",
        "Salmon": "Seafood",
        "Frozen Meat": "Frozen Foods",
        "Frozen Pizza": "Frozen Foods",
        "Frozen Peas": "Frozen Foods",
        "Frozen French Fries": "Frozen Foods",
        "Apple": "Fresh Fruits",
        "Banana": "Fresh Fruits",
        "Orange": "Fresh Fruits",
        "Grapes": "Fresh Fruits",
        "Tomato": "Fresh Vegetables",
        "Potato": "Fresh Vegetables",
        "Onion": "Fresh Vegetables",
        "Carrot": "Fresh Vegetables",
        "Broccoli": "Fresh Vegetables",
        "Lettuce": "Fresh Vegetables",
        "Chocolate": "Chocolate",
        "Bread": "Bakery Products",
        "Cake": "Bakery Products",
    }

    name = rng.choice(PRODUCT_NAMES)
    category = name_to_category.get(name)
    if category is None:
        category = rng.choice(PRODUCT_CATEGORIES)
    return name, category


def city_coordinates() -> dict[str, tuple[float, float]]:
    """Static city coordinates for realistic lat/lon generation."""

    return {
        "Kolkata": (22.5726, 88.3639),
        "Delhi": (28.6139, 77.209),
        "Mumbai": (19.076, 72.8777),
        "Bengaluru": (12.9716, 77.5946),
        "Chennai": (13.0827, 80.2707),
        "Hyderabad": (17.385, 78.4867),
        "Pune": (18.5204, 73.8567),
        "Ahmedabad": (23.0225, 72.5714),
        "Jaipur": (26.9124, 75.7873),
        "Lucknow": (26.8467, 80.9462),
        "Patna": (25.5941, 85.1376),
        "Bhubaneswar": (20.2961, 85.8245),
        "Ranchi": (23.3441, 85.3096),
        "Guwahati": (26.1445, 91.7362),
        "Siliguri": (26.7271, 88.4132),
        "Durgapur": (23.513, 87.3088),
        "Asansol": (23.685, 86.985),
        "Nagpur": (21.1458, 79.0882),
        "Indore": (22.7196, 75.8577),
        "Bhopal": (23.2599, 77.4126),
        "Visakhapatnam": (17.6868, 83.2185),
        "Kochi": (9.9312, 76.2673),
        "Coimbatore": (11.0168, 76.9558),
        "Surat": (21.1702, 72.8311),
        "Noida": (28.5355, 77.391),
        "Gurugram": (28.4595, 77.0266),
        "Kanpur": (26.4499, 80.3319),
        "Varanasi": (25.3176, 82.9739),
        "Chandigarh": (30.7333, 76.7794),
        "Srinagar": (34.0837, 74.7973),
    }


def generate_lat_long(rng: random.Random, origin_city: str, destination_city: str) -> tuple[float, float]:
    """Generate lat/lon around midpoint of origin and destination."""

    coords = city_coordinates()
    o_lat, o_lon = coords.get(origin_city, (22.5726, 88.3639))
    d_lat, d_lon = coords.get(destination_city, (28.6139, 77.209))

    lat_mid = (o_lat + d_lat) / 2.0
    lon_mid = (o_lon + d_lon) / 2.0

    lat = lat_mid + rng.uniform(-0.8, 0.8)
    lon = lon_mid + rng.uniform(-0.8, 0.8)

    return float(lat), float(lon)


def temperature_band(temp_c: float) -> str:
    """Map temperature to risk band using business thresholds."""

    if TEMP_SAFE_RANGE_C_MIN <= temp_c <= TEMP_SAFE_RANGE_C_MAX:
        return "Safe"
    if TEMP_WARNING_RANGE_C_MIN <= temp_c <= TEMP_WARNING_RANGE_C_MAX:
        return "Warning"
    if TEMP_CRITICAL_RANGE_C_MIN <= temp_c <= TEMP_CRITICAL_RANGE_C_MAX:
        return "Critical"
    return "Critical"


def humidity_band(humidity_percent: float) -> str:
    """Map humidity to risk band using business thresholds."""

    if HUMIDITY_SAFE_RANGE_PERCENT_MIN <= humidity_percent <= HUMIDITY_SAFE_RANGE_PERCENT_MAX:
        return "Safe"
    if HUMIDITY_WARNING_RANGE_PERCENT_MIN <= humidity_percent <= HUMIDITY_WARNING_RANGE_PERCENT_MAX:
        return "Warning"
    if HUMIDITY_CRITICAL_RANGE_PERCENT_MIN <= humidity_percent <= HUMIDITY_CRITICAL_RANGE_PERCENT_MAX:
        return "Critical"
    return "Critical"


def delay_band(delay_hours: float) -> str:
    """Map delay to risk band using business thresholds."""

    if SHIPMENT_DELAY_SAFE_RANGE_H_MIN <= delay_hours <= SHIPMENT_DELAY_SAFE_RANGE_H_MAX:
        return "Safe"
    if SHIPMENT_DELAY_WARNING_RANGE_H_MIN <= delay_hours <= SHIPMENT_DELAY_WARNING_RANGE_H_MAX:
        return "Warning"
    if SHIPMENT_DELAY_CRITICAL_RANGE_H_MIN <= delay_hours <= SHIPMENT_DELAY_CRITICAL_RANGE_H_MAX:
        return "Critical"
    return "Critical"


def battery_band(battery_percent: float) -> str:
    """Map battery to a simplified health band using business thresholds."""

    if BATTERY_SAFE_RANGE_PCT_MIN <= battery_percent <= BATTERY_SAFE_RANGE_PCT_MAX:
        return "Healthy"
    if BATTERY_CRITICAL_RANGE_PCT_MIN <= battery_percent <= BATTERY_CRITICAL_RANGE_PCT_MAX:
        return "Critical"
    if battery_percent <= BATTERY_LOW_THRESHOLD_PCT:
        return "Critical"
    return "Warning"


def generate_sensor_data(records: int, rng_seed: int) -> pd.DataFrame:
    """Generate realistic IoT cold-chain sensor data."""

    if records <= 0:
        raise ValueError("records must be > 0")

    rng = random.Random(rng_seed)
    np_rng = np.random.default_rng(rng_seed)

    now = datetime.now()
    start_date = now - timedelta(days=60)

    shipment_ids = [f"SHP-{uuid.uuid4().hex[:12].upper()}" for _ in range(records)]
    container_ids = [f"CTR-{uuid.uuid4().hex[:10].upper()}" for _ in range(records)]

    minutes_offsets = np_rng.integers(0, int(60 * 24 * 60), size=records)
    timestamps = [start_date + timedelta(minutes=int(m)) for m in minutes_offsets]

    dates = [ts.strftime(DATE_FORMAT) for ts in timestamps]
    times = [ts.strftime("%H:%M:%S") for ts in timestamps]
    timestamp_strs = [ts.strftime(DATETIME_FORMAT) for ts in timestamps]

    product_names: list[str] = []
    product_categories: list[str] = []
    for _ in range(records):
        name, category = choose_product(rng)
        product_names.append(name)
        product_categories.append(category)

    vehicle_types = [rng.choice(VEHICLE_TYPES) for _ in range(records)]
    transport_modes = [rng.choice(TRANSPORT_MODES) for _ in range(records)]

    origins = [rng.choice(INDIAN_CITIES) for _ in range(records)]
    destinations = [rng.choice(INDIAN_CITIES) for _ in range(records)]
    for i in range(records):
        if destinations[i] == origins[i]:
            destinations[i] = rng.choice([c for c in INDIAN_CITIES if c != origins[i]])

    lats_lons = [generate_lat_long(rng, origins[i], destinations[i]) for i in range(records)]
    latitudes = [x[0] for x in lats_lons]
    longitudes = [x[1] for x in lats_lons]

    t_min, t_max = SENSOR_TEMPERATURE_RANGE["min_c"], SENSOR_TEMPERATURE_RANGE["max_c"]
    temperatures: list[float] = []
    for _ in range(records):
        if rng.random() < 0.82:
            t = float(np_rng.normal(loc=(TEMP_SAFE_RANGE_C_MIN + TEMP_SAFE_RANGE_C_MAX) / 2.0, scale=2.4))
        else:
            t = float(np_rng.normal(loc=(TEMP_WARNING_RANGE_C_MIN + TEMP_CRITICAL_RANGE_C_MAX) / 2.0, scale=7.0))
        temperatures.append(clamp(t, t_min, t_max))

    h_min, h_max = SENSOR_HUMIDITY_RANGE["min_percent"], SENSOR_HUMIDITY_RANGE["max_percent"]
    humidities: list[float] = []
    for _ in range(records):
        if rng.random() < 0.78:
            h = float(
                np_rng.normal(
                    loc=(HUMIDITY_SAFE_RANGE_PERCENT_MIN + HUMIDITY_SAFE_RANGE_PERCENT_MAX) / 2.0,
                    scale=7.2,
                )
            )
        else:
            h = float(
                np_rng.normal(
                    loc=(HUMIDITY_WARNING_RANGE_PERCENT_MIN + HUMIDITY_CRITICAL_RANGE_PERCENT_MAX) / 2.0,
                    scale=16.0,
                )
            )
        humidities.append(clamp(h, h_min, h_max))

    b_min, b_max = SENSOR_BATTERY_RANGE["min_percent"], SENSOR_BATTERY_RANGE["max_percent"]
    batteries: list[float] = []
    for _ in range(records):
        if rng.random() < 0.86:
            b = float(np_rng.normal(loc=(BATTERY_SAFE_RANGE_PCT_MIN + BATTERY_SAFE_RANGE_PCT_MAX) / 2.0, scale=11.5))
        else:
            b = float(np_rng.normal(loc=(BATTERY_LOW_THRESHOLD_PCT + BATTERY_CRITICAL_RANGE_PCT_MAX) / 2.0, scale=18.0))
        batteries.append(clamp(b, b_min, b_max))

    v_min, v_max = SENSOR_VIBRATION_RANGE["min_m_s2"], SENSOR_VIBRATION_RANGE["max_m_s2"]
    vibrations = np_rng.gamma(shape=2.0, scale=3.0, size=records)
    vibrations = np.clip(vibrations, v_min, v_max)

    s_min, s_max = SENSOR_SHOCK_RANGE["min_g"], SENSOR_SHOCK_RANGE["max_g"]
    shocks: list[float] = []
    for _ in range(records):
        if rng.random() < 0.72:
            val = float(rng.uniform(0.0, 120.0))
        else:
            val = float(rng.uniform(120.0, 320.0))
        shocks.append(clamp(val, s_min, s_max))

    delay_min, delay_max = SENSOR_DELAY_HOURS_RANGE["min_hours"], SENSOR_DELAY_HOURS_RANGE["max_hours"]
    delays: list[float] = []
    for _ in range(records):
        if rng.random() < 0.7:
            d = float(np_rng.normal(loc=2.6, scale=1.6))
        else:
            d = float(np_rng.normal(loc=18.0, scale=10.0))
        delays.append(clamp(d, delay_min, delay_max))

    weather_options = ["Clear", "Cloudy", "Rain", "Storm", "Fog", "Heatwave", "Cold Wave"]

    sensor_status: list[str] = []
    weathers: list[str] = []
    driver_ids: list[str] = []
    route_ids: list[str] = []
    trip_distances: list[float] = []
    trip_durations: list[float] = []
    fuel_consumptions: list[float] = []

    for i in range(records):
        temp = float(temperatures[i])
        hum = float(humidities[i])
        bat = float(batteries[i])
        delay = float(delays[i])
        vib = float(vibrations[i])
        shock = float(shocks[i])

        risk_count = sum(
            1
            for band in (
                temperature_band(temp),
                humidity_band(hum),
                delay_band(delay),
            )
            if band in {"Warning", "Critical"}
        )

        status = "Active"
        if battery_band(bat) == "Critical" and rng.random() < 0.7:
            status = "Inactive"
        elif risk_count >= 2 and (vib > 12.0 or shock > 220.0):
            status = "Critical"
        elif risk_count >= 1:
            status = "Warning"

        weather = rng.choice(weather_options)
        if weather in {"Rain", "Storm"} and rng.random() < 0.4:
            humidities[i] = clamp(hum + rng.uniform(5.0, 15.0), h_min, h_max)

        sensor_status.append(status)
        weathers.append(weather)

        driver_ids.append(f"DRV-{uuid.uuid4().hex[:8].upper()}")
        route_ids.append(f"RTE-{uuid.uuid4().hex[:8].upper()}")

        mode = str(transport_modes[i])
        base_distance = {"Road": 850.0, "Rail": 1100.0, "Air": 1500.0, "Sea": 2200.0}.get(mode, 1000.0)
        dist = float(np_rng.normal(loc=base_distance, scale=250.0))
        dist = clamp(dist, 50.0, 4000.0)
        trip_distances.append(round(dist, 2))

        base_duration = {"Road": 36.0, "Rail": 48.0, "Air": 10.0, "Sea": 72.0}.get(mode, 30.0)
        dur = float(np_rng.normal(loc=base_duration, scale=10.0))
        dur = clamp(dur, 1.0, 200.0)
        trip_durations.append(round(dur, 2))

        vehicle = str(vehicle_types[i])
        vehicle_mult = {
            "Refrigerated Truck": 1.0,
            "Refrigerated Van": 0.8,
            "Cold Storage Container": 1.2,
            "Reefer Trailer": 1.1,
            "Mini Reefer Truck": 0.7,
            "Insulated Container": 0.9,
        }.get(vehicle, 1.0)

        fuel = (dist / 100.0) * (18.0 * vehicle_mult)
        fuel *= 1.0 + min(0.18, (vib / 20.0) * 0.1 + (shock / 500.0) * 0.08)
        fuel = clamp(float(fuel) + rng.uniform(-20.0, 20.0), 5.0, 2000.0)
        fuel_consumptions.append(round(fuel, 2))

    df = pd.DataFrame(
        {
            "Shipment ID": shipment_ids,
            "Container ID": container_ids,
            "Timestamp": timestamp_strs,
            "Date": dates,
            "Time": times,
            "Product Category": product_categories,
            "Product Name": product_names,
            "Vehicle Type": vehicle_types,
            "Origin City": origins,
            "Destination City": destinations,
            "Transport Mode": transport_modes,
            "Latitude": np.round(latitudes, 6),
            "Longitude": np.round(longitudes, 6),
            "Temperature": np.round(temperatures, 2),
            "Humidity": np.round(humidities, 2),
            "Battery": np.round(batteries, 2),
            "Shock": np.round(shocks, 2),
            "Vibration": np.round(vibrations, 3),
            "Delay Hours": np.round(delays, 2),
            "Sensor Status": sensor_status,
            "Weather": weathers,
            "Driver ID": driver_ids,
            "Route ID": route_ids,
            "Trip Distance": trip_distances,
            "Trip Duration": trip_durations,
            "Fuel Consumption": fuel_consumptions,
        }
    )

    return df


def main(records: int = DEFAULT_RECORDS) -> pd.DataFrame:
    """Generate sensor dataset and persist it to raw CSV."""

    logger = setup_logging()

    try:
        df = generate_sensor_data(records=int(records), rng_seed=RANDOM_SEED)

        SENSOR_DATA_CSV.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(SENSOR_DATA_CSV, index=False)

        logger.info("Generated %s sensor records -> %s", len(df), str(SENSOR_DATA_CSV))
        return df
    except Exception:
        logger.exception("Sensor data generation failed")
        raise


if __name__ == "__main__":
    main()

