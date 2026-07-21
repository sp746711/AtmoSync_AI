"""
AtmoSync AI - Recommendation API

Executes the recommendation engine responsible for generating
actionable recommendations based on analytics and risk assessment.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status

from backend.services.recommendation_service import (
    run_recommendation as execute_recommendation,
)

router = APIRouter(
    tags=["Recommendation"],
)

logger = logging.getLogger(__name__)


@router.post(
    "/recommendation/run",
    summary="Run Recommendation Engine",
    description="Executes the recommendation pipeline for AtmoSync AI.",
    status_code=status.HTTP_200_OK,
)
def run_recommendation() -> dict[str, object]:
    """
    Execute the recommendation engine.

    Returns
    -------
    dict
        Recommendation execution result.
    """
    try:
        logger.info("Starting recommendation engine...")

        exit_code = execute_recommendation()

        if exit_code == 0:
            logger.info("Recommendation engine completed successfully.")

            return {
                "success": True,
                "status": "completed",
                "exit_code": exit_code,
                "message": "Recommendation pipeline completed successfully.",
            }

        logger.warning("Recommendation engine completed with errors.")

        return {
            "success": False,
            "status": "failed",
            "exit_code": exit_code,
            "message": "Recommendation pipeline completed with errors.",
        }

    except Exception as exc:
        logger.exception("Recommendation engine failed.")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to execute recommendation pipeline.",
        ) from exc