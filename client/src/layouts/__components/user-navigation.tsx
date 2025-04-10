import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

interface UserNavigationProps {
	showIcons?: boolean;
	isAdmin?: boolean;
}

export default function UserNavigation({
	showIcons,
	isAdmin = false,
}: UserNavigationProps) {
	return !isAdmin ? (
		<>
			<Button
				variant="ghost"
				as={Link}
				to="/"
				radius="none"
				className="gap-2 flex justify-start md:justify-center border-none">
				{showIcons && (
					<Icon icon="solar:home-angle-2-outline" width="16" height="16" />
				)}
				Home
			</Button>
			<Button
				className="gap-2 flex justify-start md:justify-center border-none"
				variant="ghost"
				as={Link}
				to="/timeline/events"
				radius="none">
				Timeline
			</Button>
			<Button
				className="gap-2 flex justify-start md:justify-center border-none"
				variant="ghost"
				as={Link}
				to="/my-documents"
				radius="none">
				My Documents
			</Button>
			<Button
				className="gap-2 flex justify-start md:justify-center border-none"
				variant="ghost"
				as={Link}
				to="/my-allowance"
				radius="none">
				My Allowance
			</Button>
		</>
	) : (
		<>
			<Button
				className="gap-2 flex justify-start md:justify-center border-none"
				variant="ghost"
				as={Link}
				to="/admin/dashboard"
				radius="none">
				Dashboard
			</Button>
		</>
	);
}
