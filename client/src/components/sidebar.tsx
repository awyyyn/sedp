import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@heroui/dropdown";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { useMediaQuery } from "usehooks-ts";

import logo from "@/assets/sedp-mfi.e31049f.webp";
import { useAuth } from "@/contexts";
import { roles } from "@/lib/constant";
import { sidebarAtom, systemUserAtom } from "@/states";

const defaultLinks = [
	{
		path: "/dashboard",
		icon: "duo-icons:dashboard",
	},
	{
		path: "/scholars",
		icon: "academicons:semantic-scholar",
	},
	{
		path: "/allowances",
		icon: "solar:hand-money-outline",
	},
	// {
	// 	path: "/monthly-submissions",
	// 	icon: "et:documents",
	// },
	// {
	// 	path: "/semester-submissions",
	// 	icon: "wpf:books",
	// },
	{
		path: "/events",
		icon: "mdi:events",
	},
	{
		path: "/meetings",
		icon: "healthicons:group-discussion-meetingx3",
	},
	{
		path: "/announcements",
		icon: "mingcute:announcement-line",
	},
];

const adminManageGatheringRoutes = [
	"/dashboard",
	"/meetings",
	"/events",
	"/announcements",
];
const adminManageScholarRoutes = ["/dashboard", "/scholars"];
const adminManageDocsRoutes = [
	"/dashboard",
	"/scholars",
	"/monthly-submissions",
	"/semester-submissions",
	"/allowances",
];

export function AppSidebar() {
	const { role, logout } = useAuth();
	const { pathname } = useLocation();
	const systemUser = useAtomValue(systemUserAtom);
	const [isSidebarOpen, setIsSidebarOpen] = useAtom(sidebarAtom);
	const navigate = useNavigate();
	const width = useMediaQuery("(max-width: 770px)");

	function renderLinks() {
		let links = [];

		switch (role) {
			case "ADMIN_MANAGE_DOCUMENTS":
				links = defaultLinks.filter((link) =>
					adminManageDocsRoutes.includes(link.path)
				);
				break;
			case "ADMIN_MANAGE_GATHERINGS":
				links = defaultLinks.filter((link) =>
					adminManageGatheringRoutes.includes(link.path)
				);
				break;
			case "ADMIN_MANAGE_SCHOLAR":
				links = defaultLinks.filter((link) =>
					adminManageScholarRoutes.includes(link.path)
				);
				break;
			default:
				links = defaultLinks;
				break;
		}

		return links.map((link) => (
			<RouterLink key={`${link.path}-link`} to={`/admin${link.path}`}>
				<MenuItem
					key={link.path}
					className={`${
						pathname.includes(link.path)
							? "bg-[#A6F3B2]  "
							: "bg-[#A6F3B240] hover:bg-[#A6F3B2]"
					}   mx-auto rounded-xl my-1 capitalize`}
					icon={<Icon icon={link.icon} />}>
					{link.path.split("/")[1].replace("-", " ")}
				</MenuItem>
			</RouterLink>
		));
	}

	return (
		<aside>
			<Sidebar
				className="h-full  border-none bg-white  outline-none ring-0 "
				collapsedWidth="0"
				onBackdropClick={() => {
					if (width) {
						setIsSidebarOpen(false);
					}
				}}
				toggled={width ? isSidebarOpen : true}
				// onBackdropClick={() => alert("asd")}
				backgroundColor={width ? "white" : "#A6F3B235"}
				breakPoint="md">
				{/* <h1 className="p-5">SEDP</h1> */}
				<div className="flex flex-col h-full  justify-between">
					<div className="mt-5 items-center gap-2 bg-[#edfdef] flex flex-col px-5 ">
						<img
							src={logo}
							alt="logo"
							className="rounded-full mix-blend-multiply h-42 w-42 bg-blend-multiply  "
						/>
						<div>
							<h2 className="leading-5">SEDP-Simbag sa</h2>
							<h2 className="leading-5">Pag-asenso, Inc.</h2>
						</div>
					</div>
					<Menu className="mt-2  ">
						{renderLinks()}

						{role === "SUPER_ADMIN" && (
							<RouterLink to="/admin/system-users">
								<MenuItem
									className={`${pathname.includes("system-users") ? "bg-[#A6F3B2]  " : "bg-[#A6F3B240] hover:bg-[#A6F3B2]"} max-w-[95%] mx-auto rounded-xl my-1`}
									icon={<Icon icon="fa-solid:users-cog" />}>
									System Users
								</MenuItem>
							</RouterLink>
						)}
					</Menu>

					<div className="p-5 bottom-0 mt-auto sabsolute  w-full  ">
						<Dropdown className="w-full  ">
							<DropdownTrigger className=" ">
								<Button
									fullWidth
									variant="flat"
									className="flex gap-0 py-7  justify-between"
									radius="sm">
									<div className="flex   items-center gap-2">
										<Avatar
											fallback={`${systemUser?.firstName[0]}${systemUser?.lastName[0]}`}
											size="sm"
										/>
										<div className="flex  items-start flex-col">
											<p>
												{systemUser?.firstName} {systemUser?.lastName}
											</p>
											<p className="text-xs text-gray-500 text-start">
												{roles[role as keyof typeof roles]}
											</p>
										</div>
									</div>
									<Icon icon="mynaui:chevron-up-solid" fontSize={40} />
								</Button>
							</DropdownTrigger>
							<DropdownMenu aria-label="Static Actions">
								<DropdownItem
									onPress={() => navigate("/admin/account")}
									key="account"
									startContent={
										<Icon icon="ix:user-profile-filled" fontSize={20} />
									}>
									Account
								</DropdownItem>
								<DropdownItem
									onPress={logout}
									startContent={
										<Icon icon="solar:logout-3-bold" fontSize={20} />
									}
									key="delete"
									className="text-danger "
									color="danger">
									<p>Logout</p>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</Sidebar>
		</aside>
	);
}
