import { Box } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router";

export const AuthLayout = () => {
	const path = useLocation();

	if (path.pathname === "/admin/") {
		return Navigate({ to: "/admin/login" });
	}

	return (
		<Box
			minHeight="100dvh"
			minWidth="100dvw"
			width="100%"
			height="100%"
			display="flex"
			// alignItems="center"
			// justifyContent="center"
		>
			<Outlet />
		</Box>
	);
};
