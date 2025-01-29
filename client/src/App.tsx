import { Routes, Route } from "react-router";

// Pages
// const TechStack = Loadable(lazy(() => import("./pages/tech-stack/tech-stack")));

// Auth Pages
import Login from "./pages/auth/login/login";
import Register from "./pages/auth/register/register";
import { AuthLayout } from "./layouts";
import ForgotPassword from "./pages/auth/forgot-password/forgot-password";
import ResetPassword from "./pages/auth/reset-password/reset-password";

export default function App() {
	// const [loading, setLoading] = useState(true);
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	(async () => {
	// 		const token = localStorage.getItem("access_token");
	// 		if (!token) {
	// 			setLoading(false);
	// 			navigate("/auth");
	// 			return;
	// 		}

	// 		try {
	// 			// navigate(localStorage.getItem("lastPath") || "/dashboard");
	// 		} catch {
	// 			navigate("/login");
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	})();
	// }, []);

	// if (loading) return <Loader />;

	return (
		<Routes>
			<Route element={<AuthLayout />} path="admin">
				<Route element={<Login />} index path="login" />
				<Route element={<Register />} path="register" />
				<Route element={<ForgotPassword />} path="forgot-password" />
				<Route element={<ResetPassword />} path="reset-password" />
			</Route>
			<Route path="*" element={<h1>404</h1>} />
		</Routes>
	);
}
