import { Button } from "@heroui/button";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts";
import unauthroziedImg from "@/assets/web-error.png";

export default function Unauthorized() {
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
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>UnAuthorized | SEDP</title>
				<meta
					name="description"
					content="You do not have permission to access this page or resource."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<div className="min-h-dvh w-screen h-screen flex justify-center items-center">
				<div className="flex flex-col space-y-10 max-w-[90%] items-center">
					<div className="text-center space-y-5">
						<img
							alt="unauthorized page"
							src={unauthroziedImg}
							className="h-52 w-64 mx-auto"
						/>
						<h1 className="text-primary text-5xl">403</h1>
						<h1 className="text-2xl">Unauthorized</h1>
						<h3>
							Accessing the page or resource you were trying to reach is
							forbidden.
						</h3>
					</div>

					<Button to={link} as={Link} radius="sm">
						Go to {buttonLabel}
					</Button>
				</div>
			</div>
		</>
	);
}
