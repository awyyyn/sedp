import { Skeleton } from "@heroui/skeleton";

export default function DocumentLoader() {
	return (
		<div>
			<div className="bg-primary/5 p-2 gap-2 md:p-4 flex justify-between">
				<Skeleton className="h-20 md:h-10 w-4/6 rounded-2xl" />
				<div className="flex flex-col md:items-center md:flex-row gap-2">
					<Skeleton className="h-7 w-7 rounded-full" />
					<Skeleton className="h-10 w-[9.3rem]  rounded-2xl" />
				</div>
			</div>

			<div className="bg-gray-100 mt-2 rounded-lg">
				<div className="flex items-center justify-start p-2">
					<div className="w-full">
						<Skeleton className="h-6 w-4/5 " />
					</div>
					<div className="w-full">
						<Skeleton className="h-6 w-4/5 " />
					</div>
					<div className="w-full">
						<Skeleton className="h-6 w-4/5 " />
					</div>
				</div>
			</div>

			<div>
				{[1, 2, 3].map((item) => (
					<div key={item} className="flex items-center justify-start p-2">
						<div className="w-full">
							<Skeleton className="h-6 w-4/5 " />
						</div>
						<div className="w-full">
							<Skeleton className="h-6 w-4/5 " />
						</div>
						<div className="w-full">
							<Skeleton className="h-6 w-4/5 " />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
