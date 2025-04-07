import { Button } from "@heroui/button";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ScrollShadow } from "@heroui/scroll-shadow";

import { useAuth } from "@/contexts";

export default function AdminAccountLayout() {
	const { pathname } = useLocation();
	const { logout } = useAuth();

	const links = ["/account", "/account/security"];

	return (
		<div className="max-h-screen  pt-2 overflow-hidden">
			<div className="flex items-center justify-between px-5 md:px-0 container mx-auto  max-w-3xl">
				<div className="flex gap-x-2  ">
					{links.map((link) => (
						<Button
							key={link}
							as={Link}
							to={`/admin${link}`}
							color={pathname === `/admin${link}` ? "primary" : "default"}
							radius="sm"
							className="border-none capitalize"
							variant={pathname === `/admin${link}` ? "solid" : "ghost"}>
							{link.split("/")[link.split("/").length - 1]}
						</Button>
					))}
				</div>
			</div>
			<ScrollShadow
				size={100}
				className="h-[calc(100dvh-15dvh)]  px-5 md:px-0 pb-10 overflow-y-auto">
				<Outlet />
			</ScrollShadow>
		</div>
	);
}
