import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { getUserRole } from "../utils/roles";

const ProtectedRoute = ({ children, allowedRoles = [], requireRole = true }) => {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <div className="p-8 text-center">Checking authentication...</div>;
  }

  if (!userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = getUserRole(user);

  if (requireRole && !role) {
    return <Navigate to="/select-role" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-semibold">Access denied</p>
        <p className="text-gray-600 mt-2">Your current role does not have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;