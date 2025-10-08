import { Helmet } from "react-helmet";

import EventForm from "./__components/form";

export default function AddEvent() {
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Add Event | Admin</title>
				<meta
					name="description"
					content="Create a new event to engage scholars and provide them with opportunities for learning and growth."
				/>
			</Helmet>
			<div>
				<EventForm />
			</div>
		</>
	);
}
