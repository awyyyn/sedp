import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useWindowSize } from "usehooks-ts";

export function FCalendar({ events }: { events: any[] }) {
	const calendarRef = React.useRef<any>(null);
	const [currentView, setCurrentView] = React.useState("dayGridMonth");

	// Custom buttons with Tailwind styling
	const customButtons = {
		prev: {
			text: (
				<Icon
					icon="mynaui:chevron-left-solid"
					className="w-5 h-5 text-gray-600 hover:text-[#17c964]"
				/>
			),
			click: () => {
				if (calendarRef.current) {
					calendarRef.current.getApi().prev();
				}
			},
		},
		next: {
			text: (
				<Icon
					icon="mynaui:chevron-right-solid"
					className="w-5 h-5 text-gray-600 hover:text-[#17c964]"
				/>
			),
			click: () => {
				if (calendarRef.current) {
					calendarRef.current.getApi().next();
				}
			},
		},
		today: {
			text: "Today",
			click: () => {
				if (calendarRef.current) {
					calendarRef.current.getApi().today();
				}
			},
		},
	};

	// Customized toolbar configuration
	const headerToolbar = {
		left: "title",
		center: "",
		right: "prev,next",
	};

	// Memoized events to prevent unnecessary re-renders
	const memoizedEvents = React.useMemo(
		() =>
			events.map((event) => ({
				...event,
				id: String(event.id),
				editable: false,
				durationEditable: false,
			})) ?? [],
		[events]
	);

	// Custom button rendering for view switcher
	const buttonClassNames = (view: string) =>
		`px-3 py-1 text-sm transition-colors duration-200 ${
			currentView === view
				? "bg-[#17c964] text-white"
				: "text-gray-600 hover:bg-[#17c964]/10"
		}`;

	const Switcher = () => (
		<div className="space-x-2 bg-gray-100 rounded-md p-1">
			{["dayGridMonth", "timeGridWeek", "listWeek"].map((view) => (
				<button
					key={view}
					onClick={() => {
						if (calendarRef.current) {
							calendarRef.current.getApi().changeView(view);
							setCurrentView(view);
						}
					}}
					className={buttonClassNames(view)}>
					{view === "dayGridMonth"
						? "Month"
						: view === "timeGridWeek"
							? "Week"
							: "List"}
				</button>
			))}
		</div>
	);

	return (
		<div className="w-full max-w-full bg-white shadow-md rounded-lg overflow-hidden">
			{/* Header */}
			<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-semibold text-gray-800 flex items-center">
						<Icon
							icon="fluent-color:calendar-28"
							className="mr-2 w-6 h-6 text-[#17c964]"
						/>
						SEDP Calendar
					</h2>
					<p className="text-sm text-gray-500 mt-1">
						Manage events, announcements, and meetings
					</p>
				</div>

				{/* View Switcher */}
				<div className="hidden md:flex ">
					<Switcher />
				</div>
			</div>

			{/* Calendar */}
			<div className="p-4">
				<FullCalendar
					ref={calendarRef}
					plugins={[
						dayGridPlugin,
						timeGridPlugin,
						interactionPlugin,
						listPlugin,
					]}
					initialView="dayGridMonth"
					headerToolbar={headerToolbar}
					customButtons={customButtons as any}
					events={memoizedEvents}
					// Styling and Interaction
					editable={false}
					selectable={true}
					selectMirror={true}
					dayMaxEvents={true}
					weekNumbers={true}
					height="auto"
					// Color Customization
					eventColor="#17c964"
					eventTextColor="white"
					// View-specific formatting
					views={{
						dayGridMonth: {
							titleFormat: { year: "numeric", month: "long" },
						},
						timeGridWeek: {
							titleFormat: { year: "numeric", month: "long", day: "numeric" },
						},
						listWeek: {
							titleFormat: { year: "numeric", month: "long" },
						},
					}}
					// Buttons appearance customization
					buttonText={{
						today: "Today",
						month: "Month",
						week: "Week",
						list: "List",
					}}
				/>
			</div>

			{/* Mobile View Switcher */}
			<div className="md:hidden flex justify-center pb-4 px-4">
				<div className="inline-flex rounded-md shadow-sm">
					{["dayGridMonth", "timeGridWeek", "listWeek"].map((view) => (
						<button
							key={view}
							onClick={() => {
								if (calendarRef.current) {
									calendarRef.current.getApi().changeView(view);
									setCurrentView(view);
								}
							}}
							className={`
                                px-4 py-2 text-sm border border-gray-200 
                                first:rounded-l-lg last:rounded-r-lg
                                ${
																	currentView === view
																		? "bg-[#17c964] text-white"
																		: "text-gray-600 bg-white hover:bg-gray-50"
																}
                            `}>
							{view === "dayGridMonth"
								? "Month"
								: view === "timeGridWeek"
									? "Week"
									: "List"}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

export default FCalendar;
