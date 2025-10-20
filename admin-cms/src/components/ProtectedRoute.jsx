import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../store/authStore";
import { hasRole } from "../utils/roleUtils";

export default function ProtectedRoute({ children, roles, anyRole }) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;

  if (user.forceChangePassword && loc.pathname !== "/force-change-password") {
    return <Navigate to="/force-change-password" replace />;
  }

  if (!anyRole && roles && !hasRole(user, roles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
