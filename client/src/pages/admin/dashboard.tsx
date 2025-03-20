import { Card, CardBody, CardHeader } from "@heroui/card";
import { formatDate } from "date-fns";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

import { WebsiteCard } from "./__components";

import { externalWebsite } from "@/constants";

export default function Dashboard() {
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
							{[1, 16, 22, 26].map((evnt, indx) => (
								<div
									className="flex bg-[#D9D9D9] p-2 items-center gap-2"
									key={indx}>
									<Icon
										icon={`arcticons:calendar-${evnt}`}
										width="30"
										height="30"
									/>
									<p>Event {evnt}</p>
								</div>
							))}
						</div>
					</CardBody>
				</Card>
			</section>
		</div>
	);
}
