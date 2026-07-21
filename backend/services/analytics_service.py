from __future__ import annotations

import logging

from backend.config.config import LOGGER_NAME
from backend.scripts.pipeline import run_complete_pipeline

logger = logging.getLogger(LOGGER_NAME)


def run_full_pipeline() -> int:
    """
    Execute the complete AtmoSync AI analytics pipeline.

    Returns
    -------
    int
        Exit code returned by the pipeline.
        0 = Success
        Non-zero = Failure
    """
    return run_complete_pipeline(logger)