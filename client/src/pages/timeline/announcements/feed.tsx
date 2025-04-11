import { useQuery } from "@apollo/client";

import { READ_ANNOUNCEMENTS_QUERY } from "@/queries";
import { Announcement, PaginationResult } from "@/types";
import { AnnouncementCard, SkeletonAnnouncementCard } from "@/components";

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
