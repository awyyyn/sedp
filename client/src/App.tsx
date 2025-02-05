import { Route, Routes } from "react-router-dom";

import AuthLayout from "@/layouts/auth-layout";
import Register from "@/pages/auth/admin/register";
import Login from "@/pages/auth/admin/login";
import ForgotPassword from "@/pages/auth/admin/forgot-password";
import ProtectedRoute from "@/components/protected-route";
import Dashboard from "@/pages/admin/dashboard";
import AdminLayout from "@/layouts/admin-layout";
import { ROLE } from "@/contexts";
import Scholars from "@/pages/admin/scholars";
import Scholar from "@/pages/admin/scholar";
import SystemUsers from "@/pages/admin/system-users";
import SystemUser from "@/pages/admin/system-user";
import AdminAccount from "@/pages/admin/account";
import StudentRegister from "@/pages/auth/student/register";
import StudentLogin from "@/pages/auth/student/login";
import StudentForgotPassword from "@/pages/auth/student/forgot-password";
import Unauthorized from "@/pages/unauthorized";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

interface RouteType {
	[key: string]: {
		element: JSX.Element;
		path: string;
		allowed: ROLE[];
	}[];
}

function App() {
	const routes: RouteType = {
		admin: [
			{
				element: <Dashboard />,
				path: "/dashboard",
				allowed: ["SUPER_ADMIN", "ADMIN"],
			},
			{
				element: <Scholars />,
				path: "/scholars",
				allowed: ["SUPER_ADMIN", "ADMIN"],
			},
			{
				element: <Scholar />,
				path: "/scholars:/id",
				allowed: ["SUPER_ADMIN", "ADMIN"],
			},
			{
				element: <SystemUsers />,
				path: "/system-users",
				allowed: ["SUPER_ADMIN"],
			},
			{
				element: <SystemUser />,
				path: "/system-users/:id",
				allowed: ["SUPER_ADMIN"],
			},
			{
				element: <AdminAccount />,
				path: "/admin-account",
				allowed: ["SUPER_ADMIN", "ADMIN"],
			},
		],
	};

	return (
		<Routes>
			<Route element={<AuthLayout />}>
				<Route element={<Login />} path="/admin/login" />
				<Route element={<Register />} path="/admin/register" />
				<Route element={<ForgotPassword />} path="/admin/forgot-password" />
				<Route element={<StudentRegister />} path="/register" />
				<Route element={<StudentLogin />} path="/login" />
				<Route element={<StudentForgotPassword />} path="/forgot-password" />
			</Route>

			<Route element={<AdminLayout />}>
				{routes.admin.map((link) => (
					<Route
						key={link.path}
						element={<ProtectedRoute allowedRoles={link.allowed} />}>
						<Route key={link.path} element={link.element} path={link.path} />
					</Route>
				))}
			</Route>

			<Route path="/" element={<Home />} />

			{/* <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
				{routes.student.map((link) => (
					<Route key={link.path} element={link.element} path={link.path} />
				))}
			</Route> */}

			<Route path="unauthorized" element={<Unauthorized />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
