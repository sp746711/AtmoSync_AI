from __future__ import annotations

import sqlite3
from pathlib import Path

from backend.config.config import BASE_DIR

# Database file location
DATABASE_DIR = BASE_DIR / "database"
DATABASE_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_PATH = DATABASE_DIR / "atmosync.db"


def get_connection() -> sqlite3.Connection:
    """
    Create and return a SQLite database connection.

    Returns
    -------
    sqlite3.Connection
        SQLite connection with Row factory enabled.
    """
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def close_connection(connection: sqlite3.Connection) -> None:
    """
    Safely close a database connection.

    Parameters
    ----------
    connection : sqlite3.Connection
        Active SQLite connection.
    """
    if connection:
        connection.close()