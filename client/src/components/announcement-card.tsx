import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react/dist/iconify.js";

import { formatDate } from "@/lib/utils";
import { Announcement } from "@/types";

export function AnnouncementCard(announcement: Announcement) {
	return (
		<Card className="w-full" shadow="sm">
			<CardHeader className="flex justify-between">
				<div className="flex items-center gap-3">
					<Avatar
						src={`https://i.pravatar.cc/150`}
						name={`${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`}
						size="sm"
					/>
					<div className="flex flex-col">
						<p className="text-small font-semibold">
							{`${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`}
						</p>
						<p className="text-tiny text-default-500">
							{announcement.createdBy.email}
						</p>
					</div>
				</div>
				{/* <Button
					variant="flat"
					color="success"
					startContent={<Icon icon="lucide:edit" />}
					onPress={() =>
						navigate(`/admin/announcements/${announcement.id}/edit`)
					}
                >
					Edit
				</Button> */}
			</CardHeader>
			<CardBody className="gap-6">
				{/* 	<Button
                    variant="flat"
                    color="danger"
                    startContent={<Icon icon="lucide:trash" />}
                    onPress={() => {}}>
                    Delete
                </Button> */}

				<Divider />

				<div className="space-y-4">
					<p className="text-gray-500 text-xs">Content</p>
					<p className="px-5 text-default-500 whitespace-pre-wrap">
						{announcement.content}
					</p>
				</div>
			</CardBody>
			<CardFooter>
				<p className="text-small text-default-400">
					<Icon icon="lucide:clock" className="inline-block mr-1" />
					Posted on {formatDate(announcement.createdAt)}
				</p>
			</CardFooter>
		</Card>
	);
}
