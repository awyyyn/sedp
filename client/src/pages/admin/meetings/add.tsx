import { Helmet } from "react-helmet";

import MeetingForm from "./__components/form";

export default function AddMeeting() {
	return (
		<div className="max-w-screen-lg mx-auto mt-10">
			<Helmet>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Add Meeting | Admin</title>
				<meta name="description" content="Add a new meeting to the system." />
			</Helmet>
			<MeetingForm />
		</div>
	);
}
