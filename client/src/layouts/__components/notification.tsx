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

export default function NotificationDropdown() {
	return (
		<Dropdown
			shouldBlockScroll
			showArrow
			placement="bottom-end"
			backdrop="blur"
			radius="sm">
			<DropdownTrigger>
				<Button isIconOnly variant="light" className="rounded-full">
					<Badge
						color="danger"
						content={3}
						size="sm"
						shape="circle"
						placement="bottom-right">
						<Icon icon="hugeicons:notification-02" width="22" height="22" />
					</Badge>
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Static Actions"
				className="md:min-w-[300px] min-w-[275px] md:max-w-[300px] max-w-[275px]">
				<DropdownSection title="Notifications">
					<DropdownItem
						key="new"
						className="bg-black/5 p-2  "
						startContent={
							<div className="p-1">
								<Icon
									icon="heroicons:document-text-20-solid"
									width="24"
									height="24"
								/>
							</div>
						}
						classNames={{
							wrapper: "truncate",
						}}
						description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.">
						New file uploaded
					</DropdownItem>
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
}
