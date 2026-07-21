from __future__ import annotations

import logging

from backend.config.config import LOGGER_NAME
from backend.scripts.risk_assessment import main as risk_main

logger = logging.getLogger(LOGGER_NAME)


def run_risk_assessment() -> int:
    """
    Execute the risk assessment pipeline.

    Returns
    -------
    int
        0 if successful, otherwise 1.
    """
    try:
        risk_main()
        return 0
    except Exception:
        logger.exception("Risk assessment failed")
        return 1