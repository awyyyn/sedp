import { Skeleton } from "@heroui/skeleton";

export const SkeletonAnnouncementCard = () => (
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
