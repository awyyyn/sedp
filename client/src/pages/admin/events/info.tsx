import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Divider } from "@heroui/divider";
import { useQuery } from "@apollo/client";

import { Event } from "@/types";
import { READ_EVENT_QUERY } from "@/queries";
import { format } from "date-fns";
import { formatEventDate } from "@/lib/utils";

const EventInfo = () => {
	const { id } = useParams();
	const { loading, error, data } = useQuery<{ event: Event }>(
		READ_EVENT_QUERY,
		{
			variables: {
				id,
			},
		}
	);

	if (error) return <h1>Error: {error.message}</h1>;

	if (loading || !data?.event) return <h1>loading...</h1>;

	return (
		<div className="space-y-6 pb-10 max-w-screen-lg mx-auto">
			{/* Personal Information */}
			<Card className="py-4">
				<CardHeader className="flex justify-between flex-wrap ">
					<div className="flex gap-2 ">
						<Button
							as={Link}
							to="/admin/events"
							color="success"
							className="text-white"
							isIconOnly
							// startContent={<Icon icon="ep:back" />}>
						>
							<Icon icon="ep:back" />
						</Button>
						<div className="leading-none">
							<h1 className="text-2xl leading-none">Event Information</h1>
							<p className="text-sm leading-none text-gray-500 text-muted-foreground">
								Details about the event&apos;s schedule and location.
							</p>
						</div>
					</div>
					<Button
						as={Link}
						to={`/admin/events/${data.event.id}/edit`}
						className="text-white"
						color="success">
						Edit
					</Button>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader className="px-6 pt-4">
					<h1 className="flex items-center gap-2">
						<Icon icon="solar:info-square-broken" width="24" height="24" />
						Event Information
					</h1>
				</CardHeader>
				<Divider />
				<CardBody className="p-6 space-y-4">
					<div className="space-y-1">
						<p className="text-sm font-medium text-gray-500 text-muted-foreground">
							Event Name
						</p>
						<p className="font-medium">{data.event.title}</p>
					</div>

					<div className="space-y-1">
						<p className="text-sm font-medium text-gray-500 text-muted-foreground">
							Description
						</p>
						<p className="font-medium">{data.event.description}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium text-gray-500 text-muted-foreground">
							Time
						</p>
						<p className="font-medium">
							{format(data.event.startTime, "hh:mm a")} -{" "}
							{format(data.event.endTime, "hh:mm a")}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium text-gray-500 text-muted-foreground">
							Date
						</p>
						<p className="font-medium">
							{formatEventDate(data.event.startDate, data.event.endDate)}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium text-gray-500 text-muted-foreground">
							Location
						</p>
						<p className="font-medium">{data.event.location}</p>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default EventInfo;
