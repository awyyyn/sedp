import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { CustomButtonInput } from "@fullcalendar/core/index.js";
import { isSameMonth } from "date-fns";
import { Card, CardBody, CardHeader } from "@heroui/card";

// Sample events data

export function FCalendar({ events }: { events: Events }) {
	const calendarRef = React.useRef<any>(null);
	const [weekends, setWeekends] = React.useState(true);

	// Custom toolbar component
	const renderToolbar = {
		right: "dayGridMonth,timeGridWeek,listWeek prev,next",
		// start: "prev,title,next",

		// right: "dayGridMonth,timeGridWeek,listWeek",
	};

	// Custom button rendering
	const customButtons = {
		prev: {
			// text: <ChevronLeft className="h-4 w-4" />,
			icon: "chevron-left",
			click: () => {
				if (calendarRef.current) {
					if (isSameMonth(new Date(), calendarRef.current.getApi().getDate())) {
						return;
					}

					calendarRef.current.getApi().prev();
				}
			},
		} as CustomButtonInput,
		next: {
			icon: "chevron-right",
			click: () => {
				if (calendarRef.current) {
					calendarRef.current.getApi().next();
				}
			},
		} as CustomButtonInput,
		today: {
			text: "Today",

			click: () => {
				if (calendarRef.current) {
					calendarRef.current.getApi().today();
				}
			},
		},
	};

	// Handle view change
	// const handleViewChange = (newView: string) => {
	// 	if (calendarRef.current) {
	// 		const calendar = calendarRef.current.getApi();
	// 		calendar.changeView(newView);
	// 		setViewMode(newView);
	// 	}
	// };

	// Custom event rendering
	// const renderEvent = (eventInfo: any) => {
	// 	return (
	// 		<Link
	// 			href={`/events/${eventInfo.event.id}/info`}
	// 			className="relative overflow-hidden p-2"
	// 			suppressHydrationWarning>
	// 			{/* <GripVertical className="h-3 w-3" /> */}
	// 			<h1 className="block  ">{eventInfo.event.title}</h1>

	// 			<p className="block  ">
	// 				{getEventDescription({
	// 					startDate: eventInfo.event.start,
	// 					endDate: eventInfo.event.end,
	// 					location: eventInfo.event.location,
	// 					startTime: new Date(
	// 						new Date().setHours(
	// 							getHours(eventInfo.event.start),
	// 							getMinutes(eventInfo.event.start),
	// 							0,
	// 							0
	// 						)
	// 					),
	// 					endTime: new Date(
	// 						new Date().setHours(
	// 							getHours(eventInfo.event.end),
	// 							getMinutes(eventInfo.event.end),
	// 							0,
	// 							0
	// 						)
	// 					),
	// 					slug: eventInfo.event.id,
	// 					name: eventInfo.event.title,
	// 				} as EventWithPagination)}
	// 			</p>
	// 		</Link>
	// 	);
	// };

	const memoizedEvents = React.useMemo(() => {
		return (
			events.map((event) => ({
				...event,
				id: String(event.id),
				editable: false,
				durationEditable: false,
				interactive: true,
			})) ?? []
		);
	}, [events]);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<h2 className="text-2xl">SEDP Calendar</h2>
						<p>Manage events, announcements, and meetings.</p>
					</div>
					<div className="flex items-center gap-4">
						{/* <DropdownMenu>
							<DropdownMenuTrigger
								asChild
								className="md:flex justify-center hidden">
								<Button variant="outline" size="icon">
									{viewMode.includes("list") ? (
										<List className="h-4 w-4" />
									) : (
										<LayoutGrid className="h-4 w-4" />
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => handleViewChange("dayGridMonth")}>
									Month view
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleViewChange("timeGridWeek")}>
									Week view
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleViewChange("timeGridDay")}>
									Day view
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleViewChange("listWeek")}>
									List view
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu> */}
					</div>
				</div>
			</CardHeader>
			<CardBody>
				<FullCalendar
					ref={calendarRef}
					plugins={[
						dayGridPlugin,
						timeGridPlugin,
						interactionPlugin,
						listPlugin,
					]}
					initialView="dayGridMonth"
					headerToolbar={renderToolbar}
					customButtons={customButtons}
					events={memoizedEvents}
					// eventContent={renderEvent}
					weekends={weekends}
					editable={false}
					selectable={false}
					selectMirror={true}
					dayMaxEvents={true}
					weekNumbers={true}
					// nowIndicator={true}
					height={"80vh"}
					stickyHeaderDates={true}
					views={{
						dayGridMonth: {
							titleFormat: { year: "numeric", month: "long" },
						},
						timeGridWeek: {
							titleFormat: { year: "numeric", month: "long", day: "numeric" },
						},
						timeGridDay: {
							titleFormat: { year: "numeric", month: "long", day: "numeric" },
						},
						listWeek: {
							titleFormat: { year: "numeric", month: "long" },
						},
					}}
				/>
			</CardBody>
		</Card>
	);
}

export default FCalendar;
