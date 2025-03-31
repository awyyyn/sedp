import { Button } from "@heroui/button";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ScrollShadow } from "@heroui/scroll-shadow";

export default function AccountLayout() {
	const { pathname } = useLocation();

	const links = ["/account", "/account/security"];

	return (
		<div className="max-h-screen pt-24 overflow-hidden">
			<div className="flex gap-2 px-5 md:px-0 container mx-auto  max-w-3xl ">
				{links.map((link) => (
					<Button
						key={link}
						as={Link}
						to={link}
						color={pathname === link ? "primary" : "default"}
						radius="sm"
						className="border-none capitalize"
						variant={pathname === link ? "solid" : "ghost"}>
						{link.split("/")[link.split("/").length - 1]}
					</Button>
				))}
			</div>
			<ScrollShadow
				size={100}
				className="h-[calc(100dvh-15dvh)]  px-5 md:px-0 pb-10 overflow-y-auto">
				<Outlet />
			</ScrollShadow>
		</div>
	);
}
