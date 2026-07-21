"""
AtmoSync AI - Alerts API

Provides shipment alert information generated from the analytics
pipeline output. Alerts are derived from excursion flags and risk
categories present in the final dashboard dataset.

Integration points:
- Risk Analysis (excursion flags, risk categories)
- Feature Engineering (shock/vibration flags)
- Business Rules (severity & threshold mappings)
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Query, status

from backend.services.alert_service import count_active_alerts, get_active_alerts

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"],
)

logger = logging.getLogger(__name__)


@router.get(
    "",
    summary="Get Shipment Alerts",
    description=(
        "Returns active shipment alerts derived from the analytics pipeline "
        "output. Alerts include temperature excursions, humidity excursions, "
        "low battery, shipment delays, high shock/vibration events, and "
        "critical-risk classifications."
    ),
    status_code=status.HTTP_200_OK,
)
def get_alerts(
    limit: int = Query(
        default=100,
        ge=1,
        le=1000,
        description="Maximum number of alerts to return (sorted by severity, then timestamp).",
    ),
) -> dict[str, object]:
    """
    Retrieve active shipment alerts.

    Parameters
    ----------
    limit : int, optional
        Maximum number of alerts to return (default 100, max 1000).

    Returns
    -------
    dict
        Response containing alert status, count, and alert list.
    """
    try:
        alerts = get_active_alerts(limit=limit)

        if not alerts:
            return {
                "success": True,
                "message": "No active alerts found.",
                "count": 0,
                "alerts": [],
            }

        total = count_active_alerts()

        return {
            "success": True,
            "message": f"Found {len(alerts)} active alert(s).",
            "count": len(alerts),
            "total_active": total,
            "alerts": alerts,
        }

    except Exception as exc:
        logger.exception("Failed to retrieve alerts.")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve alerts.",
        ) from exc
