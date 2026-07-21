"""
AtmoSync AI - Map API

Provides information about the map module used for shipment
tracking and dashboard visualization.
"""

from __future__ import annotations

from fastapi import APIRouter, status

router = APIRouter(
    tags=["Map"],
)


@router.get(
    "/map/status",
    summary="Map Module Status",
    description="Returns the current availability of the shipment map module.",
    status_code=status.HTTP_200_OK,
)
def map_status() -> dict[str, object]:
    """
    Check the current status of the map module.

    Returns
    -------
    dict
        Map service status information.
    """
    return {
        "success": True,
        "status": "available",
        "message": "Map data is currently generated from dashboard export files.",
        "source": "Dashboard Export",
        "tracking_enabled": False,
    }