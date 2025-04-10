import { Card, CardBody, CardHeader } from "@heroui/card";
import { useQuery } from "@apollo/client";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

import AnnouncementForm from "./__components/form";

import { READ_ANNOUNCEMENT_QUERY } from "@/queries";
import { Announcement } from "@/types";

export default function EditAnnouncement() {
	const { id } = useParams();

	const { data, loading, error } = useQuery<{ announcement: Announcement }>(
		READ_ANNOUNCEMENT_QUERY,
		{
			variables: {
				id,
			},
		}
	);

	if (!id) return <Navigate to="/announcements" />;

	if (loading) return <h1>Loading...</h1>;

	if (error) return <h1>Error fetching announcement: {error.message}</h1>;

	if (!data?.announcement) return <h1>No announcement found.</h1>;

	return (
		<Card className="rounded-md shadow-md mb-10 ">
			<CardHeader className="flex rounded-none bg-[#A6F3B2] flex-col items-start">
				<Button
					startContent={<Icon icon="ep:back" />}
					size="sm"
					as={Link}
					to="/admin/announcements"
					className="bg-transparent hover:bg-[#6d796f35]">
					Back to list
				</Button>
				<h1 className="text-2xl">Update Announcement</h1>
				<p>
					Modify an existing announcement to inform scholars about important
					updates.
				</p>
			</CardHeader>
			<CardBody className="bg-[#A6F3B235]">
				<div className="lg:max-w-[80%] w-full mx-auto my-5">
					<AnnouncementForm edit announcement={data.announcement} />
				</div>
			</CardBody>
		</Card>
	);
}

// "note": "This list is not exhaustive. Philippine universities and colleges regularly update their program offerings based on industry demands and educational trends."
