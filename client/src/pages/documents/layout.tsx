import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function DocumentsLayout() {
	const links = ["/my-documents/monthly", "/my-documents/semester"];
	const { pathname } = useLocation();

	return (
		<div className="max-h-screen pt-24 overflow-hidden">
			{pathname !== "/my-documents" && (
				<div className="flex gap-2 pb-2 px-5 md:px-0 container mx-auto    ">
					{links.map((link, index) => (
						<Button
							key={link}
							as={Link}
							to={link}
							color={pathname.includes(link) ? "primary" : "default"}
							radius="sm"
							className="border-none capitalize"
							variant={pathname.includes(link) ? "solid" : "ghost"}>
							{index ? (
								<Icon icon="noto-v1:books" width="20" height="20" />
							) : (
								<Icon
									icon="fluent-color:calendar-clock-24"
									width="20"
									height="20"
								/>
							)}
							{link.split("/")[link.split("/").length - 1].split("-").join(" ")}
						</Button>
					))}
				</div>
			)}
			<div className="overflow-y-auto pt-5 pb-10 h-[calc(100dvh-16dvh)]  ">
				<Outlet />
			</div>
		</div>
	);
}
