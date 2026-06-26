import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Wraps a route element. Redirects to /login if not authenticated.
 * Optionally restricts to specific roles via `roles={["ADMIN", ...]}`;
 * if the logged-in user's role isn't in that list, they're redirected
 * to the dashboard instead of seeing the page.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner label="Checking your session..." />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
