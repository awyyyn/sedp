import { useLazyQuery, useQuery } from "@apollo/client";
import { useState } from "react";

import { formatEventDate, formatEventTime } from "@/lib/utils";
import { GET_CALENDAR_MEETINGS_QUERY, READ_MEETING_QUERY } from "@/queries";
import { CalendarEvent, Meeting } from "@/types";
import { FCalendar } from "@/components";
import DrawerTimeline from "@/components/drawer-timeline";

export default function MeetingFeed() {
	const { data } = useQuery<{ calendarMeetings: CalendarEvent[] }>(
		GET_CALENDAR_MEETINGS_QUERY
	);
	const [onOpen, onOpenChange] = useState(false);
	const [fetchMeeting, { loading: fetchingEvent, data: meeting }] =
		useLazyQuery<{
			meeting: Meeting;
		}>(READ_MEETING_QUERY);

	return (
		<>
			<div className="container mx-auto px-5 md:px-5">
				<FCalendar
					handlePress={(id) => {
						onOpenChange(true);
						fetchMeeting({
							variables: {
								id,
							},
						});
					}}
					type="MEETING"
					events={data?.calendarMeetings || []}
				/>
			</div>
			{meeting?.meeting && (
				<DrawerTimeline
					loading={fetchingEvent}
					isOpen={onOpen}
					content={{
						content: meeting?.meeting.description || "",
						date: meeting?.meeting.date || "",
						formattedDate: formatEventDate(
							meeting?.meeting.date,
							meeting?.meeting.date
						),
						id: meeting?.meeting.id,
						link: `${window.location.origin}/events/${meeting?.meeting.id}`,
						location: meeting?.meeting.location || "",
						time: formatEventTime(
							meeting?.meeting.startTime,
							meeting?.meeting.endTime
						),
						title: meeting?.meeting.title || "",
					}}
					onOpenChange={onOpenChange}
				/>
			)}
		</>
	);
}
