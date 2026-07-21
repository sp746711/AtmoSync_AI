"""
AtmoSync AI - Dashboard API

Provides access to the processed dashboard dataset used by
the frontend and Power BI dashboard.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status

from backend.services.dashboard_service import read_final_dashboard_data_csv

router = APIRouter(
    tags=["Dashboard"],
)

logger = logging.getLogger(__name__)


@router.get(
    "/dashboard/final-data",
    summary="Get Dashboard Dataset",
    description="Returns the processed dashboard CSV used by AtmoSync AI.",
    status_code=status.HTTP_200_OK,
)
def final_dashboard_data_csv() -> dict[str, object]:
    """
    Return the processed dashboard dataset.

    Returns
    -------
    dict
        Dashboard dataset information.
    """
    try:
        logger.info("Loading dashboard dataset...")

        csv_data = read_final_dashboard_data_csv()

        return {
            "success": True,
            "message": "Dashboard dataset loaded successfully.",
            "csv": csv_data,
        }

    except FileNotFoundError as exc:
        logger.error("Dashboard CSV file not found.")

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dashboard dataset not found.",
        ) from exc

    except Exception as exc:
        logger.exception("Failed to load dashboard dataset.")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load dashboard dataset.",
        ) from exc