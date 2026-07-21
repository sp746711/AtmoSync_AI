from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from backend.config.config import LOGGER_NAME, LOG_LEVEL, LOGS_DIR


def setup_logging() -> logging.Logger:
    """
    Configure and return the project logger.

    Creates:
    - Console logging
    - Rotating file logging

    Returns
    -------
    logging.Logger
        Configured application logger.
    """

    logger = logging.getLogger(LOGGER_NAME)

    # Prevent duplicate handlers if called multiple times
    if logger.handlers:
        return logger

    logger.setLevel(LOG_LEVEL)

    # Ensure logs directory exists
    log_dir = Path(LOGS_DIR)
    log_dir.mkdir(parents=True, exist_ok=True)

    log_file = log_dir / "atmosync.log"

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(LOG_LEVEL)
    console_handler.setFormatter(formatter)

    # Rotating File Handler (5 MB × 5 backups)
    file_handler = RotatingFileHandler(
        filename=log_file,
        maxBytes=5 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setLevel(LOG_LEVEL)
    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    logger.propagate = False

    logger.info("Logging initialized.")

    return logger