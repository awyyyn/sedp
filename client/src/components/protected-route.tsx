import { Navigate, Outlet } from "react-router-dom";

import { Loader } from "./loader";

import { ROLE, useAuth } from "@/contexts";

interface ProtectedRouteProps {
  allowedRoles: ROLE[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated)
    return <Navigate to={role === "STUDENT" ? "/login" : "/admin/login"} />;

  if (role !== null && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}
