import { Helmet } from "react-helmet";

import { FCalendar } from "@/components";

export default function TimelinePage() {
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Timeline Calendar | SEDP</title>
				<meta
					name="description"
					content="View the timeline of events and activities related to SEDP scholarship programs."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<div className="container mx-auto">
				<FCalendar events={[]} type="EVENT" handlePress={() => {}} />
			</div>
		</>
	);
}
