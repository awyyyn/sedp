import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	Dispatch,
	SetStateAction,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { toast } from "sonner";
import { useSetAtom } from "jotai";

import { Student, SystemUserRole } from "@/types";
import {
	adminNotificationAtom,
	scholarNotificationAtom,
	systemUserAtom,
} from "@/states";

export type ROLE = "STUDENT" | SystemUserRole;

interface AuthContextProps {
	role: ROLE | null;
	studentUser: Student | null;
	setStudentUser: Dispatch<SetStateAction<Student | null>>;
	loading: boolean;
	login: (token: string, isAuthenticated?: boolean) => void;
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
	const setSystemUser = useSetAtom(systemUserAtom);
	const setAdminNotifications = useSetAtom(adminNotificationAtom);
	const setScholarNotifications = useSetAtom(scholarNotificationAtom);
	const [studentUser, setStudentUser] =
		useState<AuthContextProps["studentUser"]>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const token = localStorage.getItem("accessToken");
			const isLoggedIn = localStorage.getItem("isLoggedIn");

			if (isLoggedIn === "false") {
				setIsAuthenticated(false);
				localStorage.clear();

				return;
			}

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
				const { notifications, ...userData } = data.data.user;

				if (data.data.user.role === "STUDENT") {
					setScholarNotifications(notifications || []);
					setStudentUser(data.data.user);
				} else {
					setSystemUser(userData);
					setAdminNotifications(notifications || []);
				}
				setRole(data.data.user.role as ROLE);
				localStorage.setItem("accessToken", data.data.accessToken);
			} catch (err) {
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

	const login = (token: string, isAuthenticated = true) => {
		localStorage.setItem("accessToken", token);

		const decoded = jwtDecode<{ role: string; exp: number } & JwtPayload>(
			token
		);

		if (decoded.exp * 1000 > Date.now()) {
			setRole(decoded.role as ROLE);
			// createHttpLink(token);
			setIsAuthenticated(isAuthenticated);
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
			value={{
				role,
				loading,
				login,
				logout,
				isAuthenticated,
				setStudentUser,
				studentUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
