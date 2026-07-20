import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import { routeConfig, notFoundRoute } from "./routeConfig";

function AppRoutes() {
  const NotFoundPage = notFoundRoute.component;

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          {routeConfig.map((route) => {
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

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;