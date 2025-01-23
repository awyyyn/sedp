import { Routes, Route } from "react-router";

// Pages
// const TechStack = Loadable(lazy(() => import("./pages/tech-stack/tech-stack")));

// Auth Pages
import Login from "./pages/auth/login/login";
import Register from "./pages/auth/register/register";

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
			<Route element={<Login />} path="auth/login" />
			<Route element={<Register />} path="auth/register" />
			<Route path="*" element={<h1>404</h1>} />
		</Routes>
	);
}
