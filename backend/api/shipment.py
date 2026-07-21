from __future__ import annotations

from fastapi import APIRouter, status

router = APIRouter(
    tags=["Shipment"],
)


@router.post(
    "/shipment/run",
    summary="Shipment Processing",
    description="Shipment processing is managed through the analytics pipeline.",
    status_code=status.HTTP_200_OK,
)
def shipment_run() -> dict[str, object]:
    return {
        "success": True,
        "status": "redirect",
        "message": "Shipment processing is handled by the analytics pipeline.",
        "endpoint": "/analytics/run",
    }