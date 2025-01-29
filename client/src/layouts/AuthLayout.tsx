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
			alignItems="center"
			justifyContent="center">
			<Box
				p={{ xs: 3, md: 5 }}
				pt={{ xs: 4 }}
				borderRadius={1}
				boxShadow={2}
				minWidth={{ xs: "90%", sm: "70%", md: "380px" }}
				maxWidth={{ xs: "90%", sm: "70%", md: "380px" }}>
				<Outlet />
			</Box>
		</Box>
	);
};
