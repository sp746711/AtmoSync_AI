import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import { routeConfig, notFoundRoute } from "./routeConfig";
import PageLayout from "../components/layout/PageLayout";
import Error from "../pages/Error/Error";

/**
 * AppRoutes
 *
 * Application routing shell for AtmoSync AI.
 *
 * Structure:
 * - Root redirect (/) → /dashboard
 * - Public routes (Error, NotFound) — outside ProtectedRoute
 * - Protected application routes — wrapped in ProtectedRoute + PageLayout
 * - Catch-all (*) → NotFound (public)
 */
function AppRoutes() {
  const NotFoundPage = notFoundRoute.component;

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public: Error page — accessible without authentication */}
        <Route
          path="/error"
          element={
            <PageLayout showSidebar={false} showFooter={false}>
              <Error />
            </PageLayout>
          }
        />

        {/* Protected Application Routes (with full layout) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PageLayout />}>
            {routeConfig
              .filter((route) => route.path !== "/error")
              .map((route) => {
                const PageComponent = route.component;

                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<PageComponent />}
                  />
                );
              })}
          </Route>
        </Route>

        {/* 404 Not Found — publicly accessible */}
        <Route
          path="*"
          element={
            <PageLayout showSidebar={false} showFooter={false}>
              <NotFoundPage />
            </PageLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
