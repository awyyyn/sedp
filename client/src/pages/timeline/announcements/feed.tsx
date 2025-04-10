import { useQuery } from "@apollo/client";
import { Skeleton } from "@heroui/skeleton";

import { READ_ANNOUNCEMENTS_QUERY } from "@/queries";
import { Announcement, PaginationResult } from "@/types";
import { AnnouncementCard } from "@/components";

export default function AnnouncementFeed() {
	const { data, loading } = useQuery<{
		announcements: PaginationResult<Announcement>;
	}>(READ_ANNOUNCEMENTS_QUERY);

	return (
		<div className="container mx-auto px-5 md:px-5">
			<div className="space-y-4">
				{loading
					? Array.from({ length: 2 }).map((_, index) => (
							<SkeletonAnnouncementCard key={index} />
						))
					: (data?.announcements.data || []).map((announcement) => {
							return (
								<AnnouncementCard key={announcement.id} {...announcement} />
							);
						})}
			</div>
		</div>
	);
}

const SkeletonAnnouncementCard = () => (
	<div className="p-4 space-y-5 rounded-3xl shadow-sm border">
		<div className="flex items-center gap-2 ">
			<Skeleton className="rounded-full h-9 w-9" />
			<div className="flex flex-col justify-start gap-1">
				<Skeleton className="rounded-xl w-40 h-4" />
				<Skeleton className="rounded-xl w-36 h-2" />
			</div>
		</div>
		<hr />
		<div className="space-y-2">
			<Skeleton className="rounded-md w-16 h-4" />
			<div className="pl-4 space-y-1.5">
				<Skeleton className="rounded-md w-full h-4" />
				<Skeleton className="rounded-md w-full h-4" />
				<Skeleton className="rounded-md w-3/6 h-4" />
			</div>
		</div>
		<Skeleton className="rounded-md  w-1/6 h-4" />
	</div>
);
