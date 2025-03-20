import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react/dist/iconify.js";

export function WebsiteCard({
	icon,
	title,
	url,
}: {
	title: string;
	url: string;
	icon: string;
}) {
	return (
		<Card className="max-w-full group shadow-md rounded-md">
			{/* <CardHeader className="justify-between"></CardHeader> */}
			<CardBody className="px-3 md:px-5    ">
				<div className="flex justify-between items-center">
					<div className="max-w-[60%] w-full flex h-full justify-center flex-col">
						<p>{title}</p>
						<a className="text-gray-500" href={url} target="_black">
							{url}
						</a>
					</div>
					<div className="max-w-[35%]">
						<Icon icon={icon} width="132" height="132" />
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
