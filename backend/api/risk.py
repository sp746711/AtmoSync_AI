from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status

from backend.services.risk_service import run_risk_assessment

router = APIRouter(
    tags=["Risk"],
)

logger = logging.getLogger(__name__)


@router.post(
    "/risk/run",
    summary="Run Risk Assessment",
    description="Executes the AtmoSync AI risk assessment pipeline.",
    status_code=status.HTTP_200_OK,
)
def run_risk() -> dict[str, object]:
    try:
        logger.info("Starting risk assessment...")

        exit_code = run_risk_assessment()

        if exit_code == 0:
            logger.info("Risk assessment completed successfully.")

            return {
                "success": True,
                "status": "completed",
                "exit_code": exit_code,
                "message": "Risk assessment completed successfully.",
            }

        logger.warning("Risk assessment completed with errors.")

        return {
            "success": False,
            "status": "failed",
            "exit_code": exit_code,
            "message": "Risk assessment completed with errors.",
        }

    except Exception as exc:
        logger.exception("Risk assessment failed.")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to execute risk assessment.",
        ) from exc