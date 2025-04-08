import { Button } from "@heroui/button";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@heroui/badge";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import { scholarNotificationAtom } from "@/states";
import { notificationIconMap } from "@/constants";

export default function ScholarNotificationDropdown() {
	const [notifications, setNotifications] = useAtom(scholarNotificationAtom);
	const navigate = useNavigate();
	// const [] = useMutation()

	const unreadNotifications =
		notifications.filter((notification) => !notification.read).length || 0;

	return (
		<Dropdown
			shouldBlockScroll
			placement="bottom"
			backdrop="opaque"
			radius="sm">
			<Badge
				color="danger"
				content={unreadNotifications || null}
				size="sm"
				shape="circle"
				showOutline={false}
				placement="bottom-right">
				<DropdownTrigger>
					<Button isIconOnly variant="light" className="rounded-full">
						<Icon icon="hugeicons:notification-02" width="22" height="22" />
					</Button>
				</DropdownTrigger>
			</Badge>
			<DropdownMenu
				aria-label="Static Actions"
				className="md:min-w-[300px] min-w-[275px] md:max-w-[300px] max-w-[275px]">
				<DropdownSection title="Notifications">
					{notifications.length > 0 ? (
						notifications.map((notification) => (
							<DropdownItem
								key="new"
								className="bg-black/5 p-2  "
								startContent={
									<div className="p-1">
										<Icon
											icon={notificationIconMap[notification.type]}
											width="24"
											height="24"
										/>
									</div>
								}
								onPress={() => {
									navigate(notification.link || "#");
								}}
								classNames={{
									title: "whitespace-normal break-words max-w-full ",
									wrapper: "text-wrap truncate",
								}}
								description={notification.message}>
								{notification.title}
							</DropdownItem>
						))
					) : (
						<DropdownItem
							key="no-data"
							startContent={
								<Icon
									icon="fluent-emoji-high-contrast:zzz"
									width="32"
									height="32"
								/>
							}
							isReadOnly
							variant="light"
							classNames={{
								title: "whitespace-normal break-words max-w-full ",
								wrapper: "p-5",
								base: "p-5",
							}}
							description="No new notifications available.">
							No Notifications
						</DropdownItem>
					)}
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
}
