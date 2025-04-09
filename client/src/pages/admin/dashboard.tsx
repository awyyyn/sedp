import { Card, CardBody, CardHeader } from "@heroui/card";
import { formatDate, getDay } from "date-fns";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@apollo/client";

import { WebsiteCard } from "./__components";

import { externalWebsite } from "@/constants";
import { READ_MONTHLY_EVENTS } from "@/queries";
import { Event } from "@/types";
import { Skeleton } from "@heroui/skeleton";
import { Link } from "react-router-dom";

export default function Dashboard() {
	const { data, loading, error, refetch } = useQuery<{ events: Event[] }>(
		READ_MONTHLY_EVENTS
	);

	return (
		<div className=" container space-y-5">
			<section>
				<div className="grid grid-cols-1  lg:grid-cols-2 gap-5  ">
					{externalWebsite.map(({ icon, title, url }, indx) => (
						<WebsiteCard key={indx} icon={icon} title={title} url={url} />
					))}
				</div>
			</section>

			<section>
				<Card className="max-w-full group shadow-md rounded-md">
					<CardHeader className="flex justify-between rounded-md rounded-b-none bg-[#A6F3B2]">
						<h1 className="text-2xl">
							{formatDate(new Date(), "MMMM")} Events
						</h1>

						<Button isIconOnly variant="light">
							<Icon
								icon="qlementine-icons:menu-dots-16"
								width="16"
								height="16"
							/>
						</Button>
					</CardHeader>
					{/* <CardHeader className="justify-between"></CardHeader> */}
					<CardBody className="px-3 md:px-5  bg-[#A6F3B235]  ">
						<div className="space-y-4">
							{error && (
								<div className="min-h-[250px] gap-2 w-full flex flex-col justify-center items-center">
									<h3>Error Fetching Monthly Events</h3>
									<Button
										color="success"
										isLoading={loading}
										className="text-white"
										variant="shadow"
										onPress={async () => await refetch()}>
										Refresh
									</Button>
								</div>
							)}
							{loading ? (
								[1, 2, 3].map((sklton) => (
									<div
										key={sklton}
										className="bg-[#D9D9D9] items-center flex gap-2 bg-opacity-30 p-2">
										<Skeleton className="h-7 w-7" />
										<Skeleton className="h-6 w-3/5" />
									</div>
								))
							) : data?.events && data?.events.length > 0 ? (
								data.events.map((evnt, indx) => (
									<Link
										to={`/admin/events/${evnt.id}`}
										className="flex bg-[#D9D9D9] p-2 items-center gap-2"
										key={evnt.id}>
										<Icon
											icon={`arcticons:calendar-${new Date(evnt.startDate).getDate()}`}
											width="30"
											height="30"
										/>
										<p>{evnt.title}</p>
									</Link>
								))
							) : (
								<div className="min-h-[250px] gap-2 w-full flex flex-col justify-center items-center">
									<Icon icon="solar:calendar-linear" width="50" height="50" />

									<h2 className="text-2xl font-bold text-gray-800 mb-3">
										No Events This Month
									</h2>

									<p className="text-gray-600 text-center mb-6 max-w-md">
										Your calendar is clear for this month. Take a moment to add
										new events or enjoy the free time.
									</p>
								</div>
							)}
						</div>
					</CardBody>
				</Card>
			</section>
		</div>
	);
}
