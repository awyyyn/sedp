import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/contexts";

export default function AuthLayout() {
	const { isAuthenticated, role, loading } = useAuth();

	if (loading) return;

	if (isAuthenticated)
		return <Navigate to={role === "STUDENT" ? "/" : "/admin/dashboard"} />;

	return (
		<div className="md:min-h-[100dvh min-h-[100dvh] landscape:min-h-[600px] md:landscape:min-h-[100dvh] md:min-w-[100dvw] flex justify-center items-center">
			<Outlet />
		</div>
	);
}
