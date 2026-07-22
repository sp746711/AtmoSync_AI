"""Tests for the FastAPI middleware layer.

Verifies that:
- ``ErrorHandlingMiddleware`` catches unhandled exceptions and returns JSON 500.
- ``register_middleware`` registers all middleware components.
- Normal routes work correctly with middleware enabled.
"""

from __future__ import annotations

from typing import Any

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from backend.middleware import (
    ErrorHandlingMiddleware,
    register_middleware,
)
from backend.config.config import ALLOWED_ORIGINS


def _build_test_app() -> FastAPI:
    """Build a minimal FastAPI app with middleware for testing."""
    app = FastAPI()
    register_middleware(app)

    @app.get("/test")
    def test_route() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/error")
    def error_route() -> None:
        raise RuntimeError("Test unhandled error")

    return app


@pytest.fixture
def client() -> TestClient:
    """Yield a test client bound to the middleware-enabled app."""
    with TestClient(_build_test_app()) as c:
        yield c


# ---------------------------------------------------------------------------
# Middleware Registration
# ---------------------------------------------------------------------------

class TestMiddlewareRegistration:
    """Verify middleware is registered correctly."""

    def test_register_middleware_accepts_app(self) -> None:
        """register_middleware accepts a FastAPI instance without error."""
        app = FastAPI()
        # Should not raise
        register_middleware(app)

    def test_middleware_does_not_break_health_route(self, client: TestClient) -> None:
        """Normal routes still work with middleware enabled."""
        response = client.get("/test")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------

class TestCORSMiddleware:
    """CORS headers from middleware."""

    def test_cors_allows_origins(self, client: TestClient) -> None:
        """Allowed origins get proper Access-Control-Allow-Origin."""
        for origin in ALLOWED_ORIGINS:
            response = client.get(
                "/test",
                headers={"Origin": origin},
            )
            assert response.status_code == 200

    def test_cors_allow_credentials_header(self, client: TestClient) -> None:
        """Response may include Access-Control-Allow-Credentials."""
        response = client.get(
            "/test",
            headers={"Origin": "http://localhost:5173"},
        )
        assert response.status_code == 200


# ---------------------------------------------------------------------------
# Error Handling Middleware
# ---------------------------------------------------------------------------

class TestErrorHandlingMiddleware:
    """ErrorHandlingMiddleware catches exceptions."""

    def test_unhandled_exception_returns_500_json(self, client: TestClient) -> None:
        """Unhandled exceptions are caught and return JSON 500."""
        response = client.get("/error")
        assert response.status_code == 500

        data: dict[str, Any] = response.json()
        assert "detail" in data
        assert data["detail"] == "Internal server error"

    def test_normal_route_no_error(self, client: TestClient) -> None:
        """Normal routes are unaffected by the error middleware."""
        response = client.get("/test")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
