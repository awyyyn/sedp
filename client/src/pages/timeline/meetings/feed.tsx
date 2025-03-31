import { useQuery } from "@apollo/client";

import { GET_CALENDAR_MEETINGS_QUERY } from "@/queries";
import { CalendarEvent } from "@/types";
import { FCalendar } from "@/components";

export default function MeetingFeed() {
	const { data } = useQuery<{ calendarMeetings: CalendarEvent[] }>(
		GET_CALENDAR_MEETINGS_QUERY
	);

	return (
		<div className="container mx-auto px-5 md:px-5">
			<FCalendar type="MEETING" events={data?.calendarMeetings || []} />
		</div>
	);
}
