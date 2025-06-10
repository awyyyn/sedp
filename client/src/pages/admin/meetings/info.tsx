import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Divider } from "@heroui/divider";
import { useQuery } from "@apollo/client";
import { format, formatDate } from "date-fns";

import { Meeting } from "@/types";
import { READ_MEETING_QUERY } from "@/queries";
import { Gatherings } from "@/lib/constant";
import { useAuth } from "@/contexts";
import { Loader } from "@/components/loader";
import { Helmet } from "react-helmet";

const MeetingInfo = () => {
	const { id } = useParams();
	const { role } = useAuth();
	const { loading, error, data } = useQuery<{ meeting: Meeting }>(
		READ_MEETING_QUERY,
		{
			variables: {
				id,
			},
		}
	);

	if (error) return <h1>Error: {error.message}</h1>;

	if (loading || !data?.meeting) return <Loader />;

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Meeting Info | Admin</title>
				<meta
					name="description"
					content="View detailed information about the meeting, including its schedule, location, and participants. Manage your meetings effectively with our admin tools."
				/>
			</Helmet>
			<div className="space-y-6 pb-10 max-w-screen-lg mx-auto">
				{/* Personal Information */}
				<Card className="py-4">
					<CardHeader className="flex justify-between   ">
						<div className="flex gap-2 ">
							<Button
								as={Link}
								to="/admin/meetings"
								color="success"
								className="text-white"
								isIconOnly
								// startContent={<Icon icon="ep:back" />}>
							>
								<Icon icon="ep:back" />
							</Button>
							<div className="leading-none">
								<h1 className="text-2xl leading-none">Meeting Information</h1>
								<p className="text-sm leading-none text-gray-500 text-muted-foreground">
									Details about the meeting&apos;s schedule and location.
								</p>
							</div>
						</div>
						<Button
							as={Link}
							isDisabled={!Gatherings.includes(role!)}
							to={`/admin/meetings/${data.meeting.id}/edit`}
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
							Meeting Information
						</h1>
					</CardHeader>
					<Divider />
					<CardBody className="p-6 space-y-4">
						<div className="space-y-1">
							<p className="text-sm font-medium text-gray-500 text-muted-foreground">
								Meeting Name
							</p>
							<p className="font-medium">{data.meeting.title}</p>
						</div>

						<div className="space-y-1">
							<p className="text-sm font-medium text-gray-500 text-muted-foreground">
								Description
							</p>
							<p className="font-medium">{data.meeting.description}</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm font-medium text-gray-500 text-muted-foreground">
								Time
							</p>
							<p className="font-medium">
								{format(data.meeting.startTime, "hh:mm a")} -{" "}
								{format(data.meeting.endTime, "hh:mm a")}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm font-medium text-gray-500 text-muted-foreground">
								Date
							</p>
							<p className="font-medium">
								{formatDate(data.meeting.date, "MMMM dd, yyyy")}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm font-medium text-gray-500 text-muted-foreground">
								Location
							</p>
							<p className="font-medium">{data.meeting.location}</p>
						</div>
					</CardBody>
				</Card>
			</div>
		</>
	);
};

export default MeetingInfo;
