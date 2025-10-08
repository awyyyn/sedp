import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Documents() {
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Documents | SEDP</title>
				<meta
					name="description"
					content="Access your monthly and semester documents for the SEDP scholarship program."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<div className="container mx-auto px-5 md:px-0.5 min-h-[calc(100dvh-16dvh)] flex-col md:flex-row flex gap-2 md:gap-10">
				<Button
					as={Link}
					to={`monthly`}
					className="min-h-[35dvh] gap-2 flex flex-col md:min-h-[50dvh] w-full"
					radius="sm"
					isIconOnly>
					<Icon
						icon="fluent-color:calendar-clock-24"
						width="128"
						height="128"
					/>

					<span className="text-xl">Monthly Documents</span>
				</Button>
				<Button
					as={Link}
					to={`semester`}
					className="min-h-[35dvh] gap-2  flex-col md:min-h-[50dvh] w-full"
					radius="sm"
					isIconOnly>
					<Icon icon="noto-v1:books" width="128" height="128" />
					<span className="text-xl">Semester Documents</span>
				</Button>
			</div>
		</>
	);
}
