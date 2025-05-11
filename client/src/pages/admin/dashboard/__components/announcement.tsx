import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";

import logo from "@/assets/sedp.png";
import { Announcement } from "@/types";
import { NoData } from "@/components";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

export function RecentAnnouncements({
	announcements,
}: {
	announcements: Announcement[];
}) {
	return (
		<Card className="p-2">
			<CardHeader>
				<h2 className="text-lg font-medium">Recent Announcements</h2>
			</CardHeader>
			<CardBody className="min-h-[300px]  max-h-[300px]">
				{announcements.length > 0 ? (
					<div className="space-y-4">
						{announcements.map((announcement) => (
							<AnnouncementCard
								key={announcement.id}
								announcement={announcement}
							/>
						))}
					</div>
				) : (
					<div className="flex items-center justify-center ">
						<NoData
							icon={{
								icon: "tabler:box-off",
							}}
							title="No Data Available"
							description="Please check back later for updates."
						/>
					</div>
				)}
			</CardBody>
			{announcements.length > 0 && (
				<CardFooter>
					<Button
						as={Link}
						variant="light"
						to="/admin/announcements"
						className="w-full">
						<Icon
							icon="tabler:align-box-left-middle-filled"
							width="20"
							height="20"
						/>
						View All Announcements
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
	return (
		<div className="flex items-start gap-4 rounded-lg border p-3">
			<Avatar className="mt-1" src={logo} name="AD" />
			{/* <Icon icon="ic:baseline-announcement" width="24" height="24"  style={{color: #000}} /> */}
			<div className="flex-1 space-y-1">
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium leading-none">
						{announcement.title}
					</p>
					<p className="text-xs text-muted-foreground">
						{/* {formatDistanceToNow(announcement.createdAt, {
							addSuffix: true,
						})} */}
					</p>
				</div>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{announcement.content}
				</p>
				<div className="flex items-center pt-1">
					<p className="text-xs text-muted-foreground">
						By {announcement.createdBy.firstName}{" "}
						{announcement.createdBy.lastName}
					</p>
				</div>
			</div>
		</div>
	);
};
