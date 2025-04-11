import { Button } from "@heroui/button";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts";
import unauthroziedImg from "@/assets/404-error.png";

export default function NotFound() {
	const { isAuthenticated, role } = useAuth();

	const buttonLabel = isAuthenticated
		? role === "STUDENT"
			? "Home"
			: "Dashboard"
		: "Login";

	const link = isAuthenticated
		? role === "STUDENT"
			? "/"
			: "/admin/dashboard"
		: "/login";

	return (
		<div className="min-h-dvh w-screen h-screen flex justify-center items-center">
			<div className="flex flex-col space-y-10 max-w-[90%] items-center">
				<div className="text-center space-y-5">
					<img
						alt="unauthorized page"
						src={unauthroziedImg}
						className="h-52 w-64 mx-auto"
					/>
					<h1 className="text-primary text-5xl">404</h1>
					<h1 className="text-2xl">Something went wrong</h1>
					<h3>Sorry we were unable to find that page</h3>
				</div>

				<Button href={link} as={Link} radius="sm">
					Go to {buttonLabel}
				</Button>
			</div>
		</div>
	);
}
