import { Card, CardBody, CardHeader } from "@heroui/card";

import AnnouncementForm from "./__components/form";

export default function AddAnnounceMent() {
	return (
		<Card className="rounded-md shadow-md mb-10 ">
			<CardHeader className="flex rounded-none bg-[#A6F3B2] flex-col items-start">
				<h1 className="text-2xl">Create Announcement</h1>
				<p>
					Create a new announcement to inform scholars about important updates.
				</p>
			</CardHeader>
			<CardBody className="bg-[#A6F3B235]">
				<div className="lg:max-w-[80%] w-full mx-auto my-5">
					<AnnouncementForm />
				</div>
			</CardBody>
		</Card>
	);
}

// "note": "This list is not exhaustive. Philippine universities and colleges regularly update their program offerings based on industry demands and educational trends."
