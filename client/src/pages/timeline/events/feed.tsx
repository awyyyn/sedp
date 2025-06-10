import { useLazyQuery, useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet";

import { GET_CALENDAR_EVENTS_QUERY, READ_EVENT_QUERY } from "@/queries";
import { CalendarEvent, Event } from "@/types";
import { FCalendar } from "@/components";
import DrawerTimeline from "@/components/drawer-timeline";
import { formatEventDate, formatEventTime } from "@/lib/utils";

export default function EventFeed() {
	const { data } = useQuery<{ events: CalendarEvent[] }>(
		GET_CALENDAR_EVENTS_QUERY
	);
	const [onOpen, onOpenChange] = useState(false);
	const [fetchEvent, { loading: fetchingEvent, data: event }] = useLazyQuery<{
		event: Event;
	}>(READ_EVENT_QUERY);

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Timeline Events | SEDP</title>
				<meta
					name="description"
					content="Forgot your password? No worries, we'll send you an email to reset your password."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<div className="container mx-auto px-5 md:px-5">
				<FCalendar
					handlePress={(id) => {
						onOpenChange(true);
						fetchEvent({
							variables: {
								id,
							},
						});
					}}
					type="EVENT"
					events={data?.events || []}
				/>

				{event?.event && (
					<DrawerTimeline
						loading={fetchingEvent}
						isOpen={onOpen}
						content={{
							content: event?.event.description || "",
							date: event?.event.startDate || "",
							formattedDate: formatEventDate(
								event?.event.startDate,
								event?.event.endDate
							),
							id: event?.event.id,
							link: `${window.location.origin}/events/${event?.event.id}`,
							location: event?.event.location || "",
							time: formatEventTime(
								event?.event.startTime,
								event?.event.endTime
							),
							title: event?.event.title || "",
						}}
						onOpenChange={onOpenChange}
					/>
				)}
			</div>
		</>
	);
}
