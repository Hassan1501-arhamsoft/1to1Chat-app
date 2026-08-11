
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../features/auth/hooks/useAuth";

function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

export default PublicRoute;