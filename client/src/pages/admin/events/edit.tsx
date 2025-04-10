import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import EventForm from "./__components/form";

import { READ_EVENT_QUERY } from "@/queries";
import { Event } from "@/types";

export default function EditEvent() {
	const { id } = useParams();

	const { data, loading, error } = useQuery<{ event: Event }>(
		READ_EVENT_QUERY,
		{
			variables: {
				id,
			},
		}
	);

	if (error) return <div>Something went wrong!</div>;

	if (!data?.event || loading) return <h1>loading...</h1>;

	return (
		<div>
			<EventForm edit defaultValues={data.event} />
		</div>
	);
}
