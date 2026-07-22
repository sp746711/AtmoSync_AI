from __future__ import annotations

import logging.config

from fastapi import FastAPI

from backend.api import (
    alerts,
    analytics,
    dashboard,
    health,
    map as map_api,
    recommendation,
    risk,
    reports,
    shipment,
)
from backend.config.config import (
    LOGGER_NAME,
    build_production_logging_config,
)
from backend.middleware import register_middleware


def create_app() -> FastAPI:
    app = FastAPI(
        title="AtmoSync AI API",
        version="1.0.0",
        description="Smart Cold Chain Monitoring & Spoilage Risk Analytics System",
    )

    # Initialize structured logging (console + rotating file)
    logging.config.dictConfig(build_production_logging_config())
    logging.getLogger(LOGGER_NAME).info("Logging initialized for FastAPI application.")

    # Register middleware (CORS, logging, error handling)
    register_middleware(app)

    # Health
    app.include_router(health.router)

    # Pipelines / Orchestration
    app.include_router(analytics.router)
    app.include_router(recommendation.router)
    app.include_router(risk.router)
    app.include_router(shipment.router)

    # Read-only exports / status
    app.include_router(dashboard.router)
    app.include_router(reports.router)
    app.include_router(map_api.router)
    app.include_router(alerts.router)

    return app


app = create_app()
