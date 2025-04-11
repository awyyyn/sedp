import { useParams } from "react-router-dom";
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
		<div>
			<MeetingForm edit defaultValues={data.meeting} />
		</div>
	);
}
