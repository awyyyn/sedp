import { Outlet } from "react-router-dom";
import { useState } from "react";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
} from "@heroui/drawer";
import { Button } from "@heroui/button";

import UserHeader from "./__components/user-header";
import UserNavigation from "./__components/user-navigation";

export default function UserLayout() {
	const [isOpen, onOpenChange] = useState(false);

	return (
		<div>
			<UserHeader onOpenChange={onOpenChange} />
			<Drawer
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				backdrop="blur"
				size="sm">
				<DrawerContent>
					{(onClose) => (
						<>
							<DrawerHeader className="flex flex-col gap-1">
								SEDP - Simbag sa Pag-asenso, Inc.
							</DrawerHeader>
							<DrawerBody className="space-y-2">
								<UserNavigation showIcons />
							</DrawerBody>
							<DrawerFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose}>
									Action
								</Button>
							</DrawerFooter>
						</>
					)}
				</DrawerContent>
			</Drawer>
			<main className=" ">
				<Outlet />
			</main>
		</div>
	);
}
