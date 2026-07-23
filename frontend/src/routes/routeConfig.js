/**
 * Route Configuration for AtmoSync AI.
 *
 * SINGLE SOURCE OF TRUTH for all application routes.
 *
 * Every page in frontend/src/pages/ that represents a production feature
 * or planned module MUST be registered here with exactly one route.
 *
 * Rules:
 * - Each page gets exactly one route.
 * - No duplicate route paths.
 * - NotFound handles all unmatched URLs via the catch-all `*` route.
 * - Error handles application errors (used by ErrorBoundary).
 * - Routes map 1:1 to backend FastAPI features.
 */

import Dashboard from "../pages/Dashboard/Dashboard";
import ExecutiveOverview from "../pages/ExecutiveOverview/ExecutiveOverview";
import RiskAnalysis from "../pages/RiskAnalysis/RiskAnalysis";
import Recommendations from "../pages/Recommendations/Recommendations";
import Reports from "../pages/Reports/Reports";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import Error from "../pages/Error/Error";
import NotFound from "../pages/NotFound/NotFound";

/**
 * Application route definitions.
 *
 * @type {Array<{ path: string, component: React.ComponentType, label: string }>}
 */
export const routeConfig = [
  {
    path: "/dashboard",
    component: Dashboard,
    label: "Dashboard",
  },
  {
    path: "/executive-overview",
    component: ExecutiveOverview,
    label: "Executive Overview",
  },
  {
    path: "/risk-analysis",
    component: RiskAnalysis,
    label: "Risk Analysis",
  },
  {
    path: "/recommendations",
    component: Recommendations,
    label: "Recommendations",
  },
  {
    path: "/reports",
    component: Reports,
    label: "Reports",
  },
  {
    path: "/profile",
    component: Profile,
    label: "Profile",
  },
  {
    path: "/settings",
    component: Settings,
    label: "Settings",
  },
  {
    path: "/error",
    component: Error,
    label: "Error",
  },
];

/**
 * NotFound route configuration.
 * Used by AppRoutes for the catch-all `*` route.
 *
 * @type {{ component: React.ComponentType }}
 */
export const notFoundRoute = {
  component: NotFound,
};

