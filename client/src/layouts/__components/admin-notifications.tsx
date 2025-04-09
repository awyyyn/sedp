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
import { useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useSubscription } from "@apollo/client";

import { adminNotificationAtom, systemUserAtom } from "@/states";
import { adminNotificationIconMap } from "@/constants";
import {
	READ_ADMIN_NOTIFICATION_MUTATION,
	READ_ADMIN_NOTIFICATIONS_SUBSCRIPTION,
} from "@/queries";

export default function NotificationDropdown() {
	const [notifications, setNotifications] = useAtom(adminNotificationAtom);
	const systemUser = useAtomValue(systemUserAtom);

	const navigate = useNavigate();
	const [readNotification, { loading }] = useMutation(
		READ_ADMIN_NOTIFICATION_MUTATION
	);

	useSubscription(READ_ADMIN_NOTIFICATIONS_SUBSCRIPTION, {
		variables: {
			role: systemUser?.role!,
		},
		onData: ({ data }) => {
			if (!data.data.notification) return;
			setNotifications((prev) => [data.data.notification, ...prev]);
		},
	});

	const unreadNotifications =
		notifications.filter(
			(notification) => !notification.readerIds.includes(systemUser?.id!)
		).length || 0;

	return (
		<Dropdown
			shouldBlockScroll
			placement="bottom"
			backdrop="opaque"
			// isDismissable={!loading}
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
								className={`${!notification.read && "bg-black/5"} p-2  my-1 `}
								startContent={
									<div className="p-1">
										<Icon
											icon={adminNotificationIconMap[notification.type]}
											width="24"
											height="24"
										/>
									</div>
								}
								onPress={async () => {
									if (notification.readerIds.includes(systemUser?.id!)) {
										return navigate(notification.link || "#");
									}
									const { data } = await readNotification({
										variables: {
											notificationId: notification.id,
										},
									});

									if (!data.notification) return;

									// UPDATE NOTIFICATION READ STATUS
									setNotifications((prev) =>
										prev.map((n) =>
											n.id === notification.id
												? { ...n, readerIds: [...n.readerIds, systemUser?.id!] }
												: n
										)
									);
									navigate(notification.link || "#");
								}}
								classNames={{
									title: "whitespace-normal break-words max-w-full ",
									wrapper: "text-wrap truncate",
								}}
								description={
									<div className="">
										<p>{notification.message}</p>
										<span>
											{" "}
											{formatDistanceToNow(
												isNaN(Number(notification.createdAt))
													? new Date(notification.createdAt)
													: Number(notification.createdAt)
											)}{" "}
											ago
										</span>
									</div>
								}>
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
