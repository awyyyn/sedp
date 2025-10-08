import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@apollo/client";

import MeetingForm from "./__components/form";

import { READ_MEETING_QUERY } from "@/queries";
import { Meeting } from "@/types";
import { Loader } from "@/components/loader";

export default function EditMeeting() {
	const { id } = useParams();

	const { data, loading, error } = useQuery<{ meeting: Meeting }>(
		READ_MEETING_QUERY,
		{
			variables: {
				id,
			},
		}
	);

	if (error) return <div>Something went wrong!</div>;

	if (!data?.meeting || loading) return <Loader />;

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Edit Meeting | Admin</title>
				<meta
					name="description"
					content="Edit your meeting details on our admin page. Update schedules, manage participants, and securely change meeting information with our comprehensive editing tool."
				/>
			</Helmet>
			<div>
				<MeetingForm edit defaultValues={data.meeting} />
			</div>
		</>
	);
}
