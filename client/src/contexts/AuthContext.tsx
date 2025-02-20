import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { toast } from "sonner";

export type ROLE = "SUPER_ADMIN" | "ADMIN" | "STUDENT";

interface AuthContextProps {
	role: ROLE | null;
	loading: boolean;
	login: (token: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [role, setRole] = useState<ROLE | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const token = localStorage.getItem("accessToken");

			if (!token) {
				setIsAuthenticated(false);
				setLoading(false);
				setRole(null);

				return;
			}

			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/auth/me`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
						method: "POST",
					}
				);

				if (response.status !== 200) {
					throw new Error("Session expired");
				}

				const data = await response.json();

				setIsAuthenticated(true);
				setRole(data.data.user.role as ROLE);
				localStorage.setItem("accessToken", data.data.accessToken);
			} catch (err) {
				localStorage.clear();
				toast.error((err as Error).message, {
					position: "top-center",
					richColors: true,
				});
				setIsAuthenticated(false);
				setRole(null);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const login = (token: string) => {
		localStorage.setItem("accessToken", token);
		setIsAuthenticated(true);
		const decoded = jwtDecode<{ role: string; exp: number } & JwtPayload>(
			token
		);

		if (decoded.exp * 1000 > Date.now()) {
			setRole(decoded.role as ROLE);
			// createHttpLink(token);
		} else {
			localStorage.removeItem("accessToken");
			setRole(null);
			setIsAuthenticated(false);
		}
	};

	const logout = () => {
		localStorage.clear();
		setRole(null);
		setIsAuthenticated(false);
		setLoading(false);
	};

	return (
		<AuthContext.Provider
			value={{ role, loading, login, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};
