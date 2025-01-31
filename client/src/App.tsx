import { Routes, Route, useNavigate } from "react-router";

// Pages
// const TechStack = Loadable(lazy(() => import("./pages/tech-stack/tech-stack")));

// Auth Pages
import Login from "./pages/auth/login/login";
import Register from "./pages/auth/register/register";
import { AuthLayout } from "./layouts";
import ForgotPassword from "./pages/auth/forgot-password/forgot-password";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAtom } from "jotai";

export type ROLE = "SUPER_ADMIN" | "ADMIN" | "STUDENT";

export default function App() {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [role, setRole] = useState<ROLE | null>();

	useEffect(() => {
		(async () => {
			const token = localStorage.getItem("accessToken");

			if (!token) {
				setLoading(false);
				localStorage.clear();
				setRole(null);
				// navigate("/login");
				return;
			}

			type DecodeToken = {
				email: string;
				role: string;
				id: string;
			} & JwtPayload;

			const decoded = jwtDecode<DecodeToken>(token!);

			setRole(decoded.role as ROLE);

			// if (decoded.role === "STUDENT") {
			// 	setLoading(false);
			// 	navigate("/");

			// 	return;
			// }
			// // try {
			// 	// navigate(localStorage.getItem("lastPath") || "/dashboard");
			// } catch {
			// 	navigate("/login");
			// } finally {
			// 	setLoading(false);
			// }
		})();
	}, []);

	if (loading) return <h1>loading...</h1>;

	return (
		<Routes>
			{/* ADMIN AUTHENTICATIOn */}
			<Route path="admin">
				<Route element={<AuthLayout />}>
					<Route element={<Login />} index path="login" />
					<Route element={<ForgotPassword />} path="forgot-password" />
					<Route element={<Register />} path="register" />
				</Route>
			</Route>

			<Route>
				<Route element={<h1>log in </h1>} path="login" />
			</Route>

			{role === "STUDENT" ? (
				<>
					{/* STUDENT PAGES */}
					<Route element={<h1>home</h1>} path="/" />
				</>
			) : role !== null ? (
				<>
					{/* ADMIN / SUB_ADMIN PAGES */}
					<Route element={<h1>Home admin</h1>} path="/" />
				</>
			) : null}
			<Route path="*" element={<h1>404</h1>} />
		</Routes>
	);
}
