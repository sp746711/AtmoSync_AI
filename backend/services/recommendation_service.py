from __future__ import annotations

import logging

from backend.config.config import LOGGER_NAME
from backend.scripts.recommendation_engine import main as recommendation_main

logger = logging.getLogger(LOGGER_NAME)


def run_recommendation() -> int:
    """
    Execute the recommendation engine.

    Returns
    -------
    int
        0 if successful, otherwise 1.
    """
    try:
        recommendation_main()
        return 0
    except Exception:
        logger.exception("Recommendation engine failed")
        return 1