import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@heroui/dropdown";
import { Link } from "@heroui/link";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom";

import logo from "@/assets/sedp-mfi.e31049f.webp";
import { useAuth } from "@/contexts";

export function AppSidebar() {
	const { role, logout } = useAuth();
	const { pathname } = useLocation();

	return (
		<aside>
			<Sidebar
				className="h-full  border-none outline-none ring-0 "
				collapsedWidth="0"
				toggled={false}
				// onBackdropClick={() => alert("asd")}
				backgroundColor="#A6F3B235"
				breakPoint="md">
				{/* <h1 className="p-5">SEDP</h1> */}
				<div className="flex flex-col h-full  justify-between">
					<div className="mt-5 items-center gap-2 flex px-5 ">
						<img src={logo} alt="logo" className="rounded-lg h-12 w-12  " />
						<div>
							<h2 className="leading-5">SEDP-Simbag sa</h2>
							<h2 className="leading-5">Pag-asenso, Inc.</h2>
						</div>
					</div>
					<Menu className="mt-2  ">
						{/* <SubMenu label="Charts">
						<MenuItem> Pie charts </MenuItem>
						<MenuItem> Line charts </MenuItem>
					</SubMenu> */}
						<MenuItem
							icon={<Icon icon="duo-icons:dashboard" />}
							component={<Link />}
							className={`${pathname.includes("dashboard") ? "bg-[#A6F3B2]   " : "bg-[#A6F3B240] hover:bg-[#A6F3B2]"} max-w-[95%] mx-auto rounded-xl my-1`}
							href="/admin/dashboard">
							Dashboard
						</MenuItem>
						<MenuItem
							component={<Link />}
							className={`${pathname.includes("scholars") ? "bg-[#A6F3B2]  " : "bg-[#A6F3B240] hover:bg-[#A6F3B2]"} max-w-[95%] mx-auto rounded-xl my-1`}
							href="/admin/scholars"
							icon={<Icon icon="academicons:semantic-scholar" />}>
							Scholars
						</MenuItem>
						<MenuItem
							component={<Link />}
							className={`${pathname.includes("monthly-submissions") ? "bg-[#A6F3B2]  " : "bg-[#A6F3B240] hover:bg-[#A6F3B2]"} max-w-[95%] mx-auto rounded-xl my-1`}
							href="/admin/monthly-submissions"
							icon={<Icon icon="et:documents" />}>
							Monthly Submission
						</MenuItem>
						<MenuItem
							component={<Link />}
							className={`${pathname.includes("events") ? "bg-[#A6F3B2]  " : "bg-[#A6F3B240] hover:bg-[#A6F3B2]"} max-w-[95%] mx-auto rounded-xl my-1`}
							href="/admin/events"
							icon={<Icon icon="mdi:events" />}>
							Calendar of Events
						</MenuItem>
						<MenuItem
							component={<Link />}
							className={`${pathname.includes("meetings") ? "bg-[#A6F3B2]  " : "bg-[#A6F3B240] hover:bg-[#A6F3B2]"} max-w-[95%] mx-auto rounded-xl my-1`}
							href="/admin/meetings"
							icon={<Icon icon="healthicons:group-discussion-meetingx3" />}>
							Meetings
						</MenuItem>
						<MenuItem
							component={<Link />}
							className={`${pathname.includes("announcements") ? "bg-[#A6F3B2]  " : "bg-[#A6F3B240] hover:bg-[#A6F3B2]"} max-w-[95%] mx-auto rounded-xl my-1`}
							href="/admin/announcements"
							icon={<Icon icon="mingcute:announcement-line" />}>
							Announcements
						</MenuItem>
						{role === "SUPER_ADMIN" && (
							<MenuItem
								component={<Link />}
								href="/admin/system-users"
								className={`${pathname.includes("system-users") ? "bg-[#A6F3B2]  " : "bg-[#A6F3B240] hover:bg-[#A6F3B2]"} max-w-[95%] mx-auto rounded-xl my-1`}
								icon={<Icon icon="fa-solid:users-cog" />}>
								System Users
							</MenuItem>
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
									<div className="flex items-center gap-2">
										<Avatar size="sm" />
										<div className="">
											<p>Admin name</p>
											<p className="text-xs text-gray-500 text-start">Role</p>
										</div>
									</div>
									<Icon icon="mynaui:chevron-up-solid" fontSize={40} />
								</Button>
							</DropdownTrigger>
							<DropdownMenu aria-label="Static Actions">
								<DropdownItem
									href="/admin/admin-account"
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
