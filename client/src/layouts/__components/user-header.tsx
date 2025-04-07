import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
} from "@heroui/drawer";
import { useState } from "react";

import UserNavigation from "./user-navigation";

import sedpLogo from "@/assets/sedp.png";
import { useAuth } from "@/contexts";
export default function UserHeader() {
	const { isAuthenticated, role } = useAuth();
	const [isOpen, onOpenChange] = useState(false);

	return (
		<>
			<header className="fixed top-0 z-[45]	 py-2  left-0 w-screen bg-[#D5D6D7] bg-opacity-85  ">
				<div className="px-5 md:px-0 container mx-auto flex justify-between">
					<div className="flex gap-4 items-center">
						<img className="rounded-full" alt="SEDP LOGO" src={sedpLogo} />
						<h2 className="text-lg  md:text-2xl flex">
							SEDP
							<span className="hidden md:block">
								&nbsp;- Simbag sa Pag-asenso, Inc.
							</span>
						</h2>
					</div>
					<div className="flex gap-2 items-center">
						{!isAuthenticated ? (
							<Button as={Link} to={"/login"} color="primary">
								<Icon icon="line-md:login" width="24" height="24" /> Log in
							</Button>
						) : (
							<>
								<div className="hidden md:flex gap-2">
									<UserNavigation isAdmin={role !== "STUDENT"} />
								</div>
								<Button
									className="flex md:hidden"
									isIconOnly
									onPress={() => onOpenChange && onOpenChange(true)}
									color="primary"
									size="sm">
									<Icon icon="line-md:menu" width="24" height="24" />
								</Button>
							</>
						)}
					</div>
				</div>
			</header>

			<Drawer
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				backdrop="blur"
				size="sm">
				<DrawerContent>
					{() => (
						<>
							<DrawerHeader className="flex flex-col gap-1">
								SEDP - Simbag sa Pag-asenso, Inc.
							</DrawerHeader>
							<DrawerBody className="space-y-2">
								<UserNavigation showIcons />
							</DrawerBody>
						</>
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}
