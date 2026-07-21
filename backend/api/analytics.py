"""
AtmoSync AI - Analytics API

Runs the complete analytics pipeline, including:

- Data Processing
- Risk Analysis
- Recommendation Generation
- Dashboard Dataset Creation
- Report Preparation
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status

from backend.services.analytics_service import run_full_pipeline

router = APIRouter(
    tags=["Analytics"],
)

logger = logging.getLogger(__name__)


@router.post(
    "/analytics/run",
    summary="Run Analytics Pipeline",
    description="Executes the complete AtmoSync AI analytics pipeline.",
    status_code=status.HTTP_200_OK,
)
def run_analytics() -> dict[str, object]:
    """
    Execute the complete analytics pipeline.

    Returns
    -------
    dict
        Pipeline execution result.
    """
    try:
        logger.info("Starting analytics pipeline...")

        exit_code = run_full_pipeline()

        if exit_code == 0:
            logger.info("Analytics pipeline completed successfully.")

            return {
                "success": True,
                "status": "completed",
                "exit_code": exit_code,
                "message": "Analytics pipeline completed successfully.",
            }

        logger.warning("Analytics pipeline completed with errors.")

        return {
            "success": False,
            "status": "failed",
            "exit_code": exit_code,
            "message": "Analytics pipeline finished with errors.",
        }

    except Exception as exc:
        logger.exception("Analytics pipeline failed.")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to execute analytics pipeline.",
        ) from exc