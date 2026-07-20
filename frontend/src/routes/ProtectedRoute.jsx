import { Outlet } from 'react-router-dom';

/**
 * ProtectedRoute
 * ---------------
 * Reusable wrapper for protected routes.
 *
 * Future-ready: authentication/authorization checks can be added later
 * without changing the route structure.
 */
function ProtectedRoute({ isProtected = false }) {
  // Future authentication/authorization implementation:
  //
  // const { isAuthenticated } = useAuth();
  // if (isProtected && !isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  //
  // For now, authentication is not implemented, so all routes are accessible.
  return <Outlet />;
}

export default ProtectedRoute;


