import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
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

import logo from "@/assets/sedp-mfi.e31049f.webp";
import { useAuth } from "@/contexts";

export function AppSidebar() {
	const { role, logout } = useAuth();

	return (
		<aside>
			<Sidebar
				className="h-full "
				collapsedWidth="0"
				toggled={!false}
				// onBackdropClick={() => alert("asd")}
				backgroundColor="white"
				breakPoint="md">
				{/* <h1 className="p-5">SEDP</h1> */}
				<div className="mt-5">
					<img src={logo} alt="logo" className="rounded-lg mx-auto" />
				</div>
				<Menu className="mt-2">
					{/* <SubMenu label="Charts">
						<MenuItem> Pie charts </MenuItem>
						<MenuItem> Line charts </MenuItem>
					</SubMenu> */}
					<MenuItem
						icon={<Icon icon="duo-icons:dashboard" />}
						component={<Link />}
						href="/dashboard"
						active>
						Dashboard
					</MenuItem>
					<SubMenu
						label="Scholars"
						icon={<Icon icon="academicons:semantic-scholar" />}>
						<MenuItem
							icon={<Icon icon="lets-icons:add-duotone" />}
							component={<Link />}
							href="/scholars/add"
							className="  py-0">
							Add
						</MenuItem>
						<MenuItem
							component={<Link />}
							href="/scholars"
							icon={<Icon icon="majesticons:list-box" />}>
							List
						</MenuItem>
					</SubMenu>
					{role === "SUPER_ADMIN" && (
						<MenuItem
							component={<Link />}
							href="/system-users"
							icon={<Icon icon="fa-solid:users-cog" />}>
							System Users
						</MenuItem>
					)}
				</Menu>
				<div className="p-5 bottom-0 absolute  w-full">
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
										<p>Admin</p>
										<p className="text-xs text-gray-500 text-start">Role</p>
									</div>
								</div>
								<Icon icon="mynaui:chevron-up-solid" fontSize={40} />
							</Button>
						</DropdownTrigger>
						<DropdownMenu aria-label="Static Actions">
							<DropdownItem
								href="/admin-account"
								key="account"
								startContent={
									<Icon icon="ix:user-profile-filled" fontSize={20} />
								}>
								Account
							</DropdownItem>
							<DropdownItem
								onPress={logout}
								startContent={<Icon icon="solar:logout-3-bold" fontSize={20} />}
								key="delete"
								className="text-danger "
								color="danger">
								<p>Logout</p>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</Sidebar>
		</aside>
	);
}
