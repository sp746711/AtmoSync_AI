from __future__ import annotations

from pathlib import Path

from backend.config.config import FINAL_DASHBOARD_DATA_CSV


def read_final_dashboard_data_csv() -> str:
    """
    Read and return the generated dashboard CSV as UTF-8 text.

    Returns
    -------
    str
        Raw CSV contents.

    Raises
    ------
    FileNotFoundError
        If the dashboard CSV does not exist.
    """
    path = Path(FINAL_DASHBOARD_DATA_CSV)

    if not path.exists():
        raise FileNotFoundError(f"Dashboard CSV not found: {path}")

    return path.read_text(encoding="utf-8")