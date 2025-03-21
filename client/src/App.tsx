import { useRoutes } from "react-router-dom";

import AuthLayout from "@/layouts/auth-layout";
import Login from "@/pages/auth/admin/login";
import ForgotPassword from "@/pages/auth/admin/forgot-password";
import ProtectedRoute from "@/components/protected-route";
import Dashboard from "@/pages/admin/dashboard";
import AdminLayout from "@/layouts/admin-layout";
import Scholars from "@/pages/admin/scholars/scholars";
import SystemUsers from "@/pages/admin/system-users/system-users";
import SystemUser from "@/pages/admin/system-users/system-user";
import StudentLogin from "@/pages/auth/student/login";
import StudentForgotPassword from "@/pages/auth/student/forgot-password";
import Unauthorized from "@/pages/unauthorized";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AddScholar from "@/pages/admin/scholars/add-scholar";
import AddSystemUser from "@/pages/admin/system-users/add-system-user";
import Announcements from "./pages/admin/announcements/list";
import AddAnnouncements from "./pages/admin/announcements/add-announcements";

function App() {
	const adminRoutes = {
		element: <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />,
		path: "admin",
		children: [
			{
				element: <AdminLayout />,
				children: [
					{
						path: "dashboard",
						element: <Dashboard />,
					},
					{
						path: "scholars",
						children: [
							{
								element: <Scholars />,
								index: true,
							},
							{
								element: <AddScholar />,
								path: "add",
							},
						],
					},

					{
						path: "announcements",
						children: [
							{
								element: <Announcements />,
								index: true,
							},
							{
								element: <AddAnnouncements />,
								path: "add",
							},
						],
					},
				],
			},
		],
	};
	const superAdminRoutes = {
		element: <ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />,
		path: "admin",
		children: [
			{
				element: <AdminLayout />,
				children: [
					{
						path: "system-users",
						children: [
							{
								element: <SystemUsers />,
								index: true,
							},
							{
								path: "add",
								element: <AddSystemUser />,
							},
							{
								element: <SystemUser />,
								path: ":id",
							},
						],
					},
				],
			},
		],
	};
	const publicRoutes = [
		{
			path: "/",
			element: <Home />,
		},
		{
			element: <Unauthorized />,
			path: "unauthorized",
		},
		{
			element: <NotFound />,
			path: "*",
		},
	];

	const authRoutes = {
		element: <AuthLayout />,
		children: [
			{
				path: "admin/login",
				children: [
					{ index: true, element: <Login /> },
					{
						path: "forgot-password",
						element: <ForgotPassword />,
					},
				],
			},
			{
				path: "login",
				element: <StudentLogin />,
			},
			{
				path: "forgot-password",
				element: <StudentForgotPassword />,
			},
			{
				path: "forgot-password",
				element: <StudentForgotPassword />,
			},
		],
	};

	return useRoutes([
		adminRoutes,
		superAdminRoutes,
		authRoutes,
		...publicRoutes,
	]);
}

export default App;
