import { Navigate, Outlet } from "react-router-dom";

import { ROLE, useAuth } from "@/contexts";

interface ProtectedRouteProps {
	allowedRoles: ROLE[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
	const { isAuthenticated, role, loading } = useAuth();

	if (loading) return <div>Loading...</div>;

	if (!isAuthenticated) return <Navigate to="/login" />;

	if (role !== null && !allowedRoles.includes(role)) {
		return <Navigate to="/unauthorized" />;
	}

	return <Outlet />;
}
