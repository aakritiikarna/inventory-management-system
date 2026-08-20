import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = ({ children, requireRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // User not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Logged in but doesn't have required role
    if (requireRole && !requireRole.includes(user.role)) {
      navigate("/unauthorized");
      return;
    }
  }, [user, navigate, requireRole]);

  if (!user) {
    return null;
  }

  if (requireRole && !requireRole.includes(user.role)) {
    return null;
  }

  return children;
};

export default ProtectedRoutes;