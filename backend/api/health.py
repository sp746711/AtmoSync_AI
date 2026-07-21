"""
AtmoSync AI - Health API

Provides a simple endpoint to verify that the backend service
is running and available.
"""

from __future__ import annotations

from fastapi import APIRouter, status

from backend.config.config import PROJECT_NAME, VERSION

router = APIRouter(
    tags=["Health"],
)


@router.get(
    "/health",
    summary="Health Check",
    description="Returns the current health status of the AtmoSync AI backend.",
    status_code=status.HTTP_200_OK,
)
def health() -> dict[str, str]:
    """
    Check whether the backend service is running.

    Returns
    -------
    dict
        Health status information.
    """
    return {
        "status": "healthy",
        "project": PROJECT_NAME,
        "version": VERSION,
    }