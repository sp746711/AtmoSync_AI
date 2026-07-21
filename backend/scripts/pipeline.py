from __future__ import annotations

import logging
import logging.config
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Optional

from backend.config.config import (
    DESCRIPTION,
    LOGGER_NAME,
    PROJECT_NAME,
    VERSION,
    build_production_logging_config,
)
from backend.scripts import (
    business_insights,
    data_cleaning,
    export_data,
    feature_engineering,
    financial_loss,
    recommendation_engine,
    risk_assessment,
    sensor_generator,
)

PROJECT_ROOT: Path = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class PipelineStepResult:
    """Represents the execution outcome of a single pipeline step."""

    step_name: str
    status: str  # "Completed" | "Failed"
    start_time: datetime
    end_time: datetime
    execution_time_seconds: float
    error_message: Optional[str] = None


def setup_logging() -> logging.Logger:
    """Initialize production logging for the pipeline controller."""
    logging.config.dictConfig(build_production_logging_config())
    return logging.getLogger(LOGGER_NAME)


def _utc_now() -> datetime:
    """Get current UTC time."""
    return datetime.now(timezone.utc)


def run_pipeline_step(
    logger: logging.Logger,
    step_name: str,
    main_callable: Callable[[], object],
) -> PipelineStepResult:
    """Run one pipeline module step and measure execution time.

    Args:
        logger: Pipeline logger.
        step_name: Human-readable pipeline step name.
        main_callable: Callable that triggers the module's `main()`.

    Returns:
        PipelineStepResult capturing timing and status.
    """
    start_dt = _utc_now()
    start_perf = time.perf_counter()
    try:
        logger.info("Running step: %s", step_name)
        main_callable()
        end_perf = time.perf_counter()
        end_dt = _utc_now()

        elapsed_seconds = float(end_perf - start_perf)
        logger.info("Completed step: %s in %.4f seconds", step_name, elapsed_seconds)

        return PipelineStepResult(
            step_name=step_name,
            status="Completed",
            start_time=start_dt,
            end_time=end_dt,
            execution_time_seconds=elapsed_seconds,
        )
    except Exception as exc:  # pylint: disable=broad-exception-caught
        end_perf = time.perf_counter()
        end_dt = _utc_now()

        elapsed_seconds = float(end_perf - start_perf)
        logger.exception("Failed step: %s (elapsed %.4f seconds)", step_name, elapsed_seconds)

        return PipelineStepResult(
            step_name=step_name,
            status="Failed",
            start_time=start_dt,
            end_time=end_dt,
            execution_time_seconds=elapsed_seconds,
            error_message=str(exc),
        )


def generate_pipeline_summary(
    step_results: list[PipelineStepResult],
    overall_success: bool,
    pipeline_start: datetime,
    pipeline_end: datetime,
    total_execution_seconds: float,
) -> dict[str, object]:
    """Generate a structured pipeline summary payload."""
    completed_steps = [r.step_name for r in step_results if r.status == "Completed"]
    failed_steps = [r.step_name for r in step_results if r.status == "Failed"]

    return {
        "project": PROJECT_NAME,
        "version": VERSION,
        "description": DESCRIPTION,
        "pipeline_start_time_utc": pipeline_start.strftime("%Y-%m-%d %H:%M:%S %Z"),
        "pipeline_end_time_utc": pipeline_end.strftime("%Y-%m-%d %H:%M:%S %Z"),
        "total_execution_time_seconds": total_execution_seconds,
        "overall_success": overall_success,
        "completed_steps": completed_steps,
        "failed_steps": failed_steps,
        "steps": [
            {
                "step_name": r.step_name,
                "status": r.status,
                "start_time_utc": r.start_time.strftime("%Y-%m-%d %H:%M:%S %Z"),
                "end_time_utc": r.end_time.strftime("%Y-%m-%d %H:%M:%S %Z"),
                "execution_time_seconds": r.execution_time_seconds,
                "error_message": r.error_message,
            }
            for r in step_results
        ],
    }


def print_pipeline_summary(logger: logging.Logger, summary: dict[str, object]) -> None:
    """Print pipeline summary in a readable form to logs."""
    logger.info("========== Pipeline Execution Summary ==========")
    logger.info("Overall Success: %s", summary.get("overall_success"))
    logger.info("Pipeline Start (UTC): %s", summary.get("pipeline_start_time_utc"))
    logger.info("Pipeline End (UTC): %s", summary.get("pipeline_end_time_utc"))
    logger.info(
        "Total Execution Time (seconds): %.4f",
        float(summary.get("total_execution_time_seconds", 0.0)),
    )

    step_rows = summary.get("steps", [])
    for row in step_rows:  # type: ignore[assignment]
        logger.info(
            "Step=%s | Status=%s | ExecTime=%.4f sec | Start=%s | End=%s | Error=%s",
            row.get("step_name"),
            row.get("status"),
            float(row.get("execution_time_seconds", 0.0)),
            row.get("start_time_utc"),
            row.get("end_time_utc"),
            row.get("error_message"),
        )


def run_complete_pipeline(logger: logging.Logger) -> int:
    """Run all pipeline steps in the required order.

    Stops the pipeline if a critical stage fails.
    """
    pipeline_start = _utc_now()
    start_perf = time.perf_counter()

    logger.info("========== AtmoSync AI Pipeline ==========")
    logger.info("Project: %s (v%s)", PROJECT_NAME, VERSION)
    logger.info("Description: %s", DESCRIPTION)
    logger.info("Pipeline start time (UTC): %s", pipeline_start.strftime("%Y-%m-%d %H:%M:%S %Z"))

    steps: list[tuple[str, Callable[[], object]]] = [
        ("sensor_generator", sensor_generator.main),
        ("data_cleaning", data_cleaning.main),
        ("feature_engineering", feature_engineering.main),
        ("risk_assessment", risk_assessment.main),
        ("financial_loss", financial_loss.main),
        ("recommendation_engine", recommendation_engine.main),
        ("business_insights", business_insights.main),
        ("export_data", export_data.main),
    ]

    step_results: list[PipelineStepResult] = []
    overall_success = True

    # All listed stages are treated as critical in this orchestration.
    for step_name, main_callable in steps:
        result = run_pipeline_step(logger, step_name, main_callable)
        step_results.append(result)

        if result.status == "Failed":
            overall_success = False
            logger.error("Critical stage failed: %s. Stopping pipeline.", step_name)
            break

    pipeline_end = _utc_now()
    end_perf = time.perf_counter()
    total_execution_seconds = float(end_perf - start_perf)

    logger.info("Pipeline end time (UTC): %s", pipeline_end.strftime("%Y-%m-%d %H:%M:%S %Z"))

    summary = generate_pipeline_summary(
        step_results=step_results,
        overall_success=overall_success,
        pipeline_start=pipeline_start,
        pipeline_end=pipeline_end,
        total_execution_seconds=total_execution_seconds,
    )

    print_pipeline_summary(logger, summary)

    if overall_success:
        logger.info("Pipeline Status: Completed")
        return 0

    logger.error("Pipeline Status: Failed")
    return 1


def main() -> None:
    """Main entry point for the pipeline controller."""
    logger = setup_logging()
    try:
        exit_code = run_complete_pipeline(logger)
        sys.exit(exit_code)
    except Exception:  # pylint: disable=broad-exception-caught
        logger.exception("Pipeline controller crashed unexpectedly")
        sys.exit(1)


if __name__ == "__main__":
    main()

