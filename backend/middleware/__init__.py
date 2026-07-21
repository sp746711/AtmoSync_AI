"""
AtmoSync AI - Middleware Package

This module provides FastAPI middleware for request processing,
including CORS, logging, error handling, and request timing.
"""

from __future__ import annotations

import logging
import time
from typing import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from backend.config.config import LOGGER_NAME


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Logs incoming requests and their processing time."""

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        start_time = time.perf_counter()
        response = await call_next(request)
        elapsed = time.perf_counter() - start_time

        logger = logging.getLogger(LOGGER_NAME)
        logger.info(
            "%s %s -> %s (%.4fs)",
            request.method,
            request.url.path,
            response.status_code,
            elapsed,
        )
        return response


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Catches unhandled exceptions and returns a JSON error response."""

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        try:
            return await call_next(request)
        except Exception as exc:
            logger = logging.getLogger(LOGGER_NAME)
            logger.exception("Unhandled error processing request: %s %s", request.method, request.url.path)
            return Response(
                content='{"detail": "Internal server error"}',
                status_code=500,
                media_type="application/json",
            )


def register_middleware(app: FastAPI) -> None:
    """Register all middleware on a FastAPI application instance."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(ErrorHandlingMiddleware)


__all__ = [
    "RequestLoggingMiddleware",
    "ErrorHandlingMiddleware",
    "register_middleware",
]

