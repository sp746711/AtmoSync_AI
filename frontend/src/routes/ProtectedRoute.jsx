import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const auth = useAuth();

  // Show nothing while authentication is loading
  if (auth?.loading) {
    return <div>Loading...</div>;
  }

  // Allow access if authenticated
  if (auth?.isAuthenticated) {
    return <Outlet />;
  }

  // Redirect unauthenticated users
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;