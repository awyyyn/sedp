import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@heroui/button";

export function FCalendar<T>({
  events,
  handlePress,
}: {
  events: T[];
  type?: "MEETING" | "EVENT";
  handlePress: (id: string) => void;
}) {
  const calendarRef = React.useRef<any>(null);
  const [currentView, setCurrentView] = React.useState("dayGridMonth");

  // Custom CSS for FullCalendar
  const customStyles = `
    .fc {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    /* Toolbar Styling */
    .fc .fc-toolbar-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    /* Custom Button Styling */
    .fc .fc-button {
      background: transparent;
      border: none;
      padding: 0.5rem;
      transition: all 0.2s;
      box-shadow: none;
    }

    .fc .fc-button:hover {
      background: #f3f4f6;
      transform: scale(1.05);
    }

    .fc .fc-button:focus {
      box-shadow: none;
      outline: none;
    }

    .fc .fc-button-active {
      background: #17c964 !important;
      color: white !important;
      border-radius: 0.5rem;
    }

    /* Day Headers */
    .fc .fc-col-header-cell {
      padding: 0.75rem 0.5rem;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      background: #f9fafb;
      border: none;
    }

    /* Day Cells */
    .fc .fc-daygrid-day {
      border-color: #e5e7eb;
      transition: background 0.2s;
    }

    .fc .fc-daygrid-day:hover {
      background: #f9fafb;
    }

    .fc .fc-daygrid-day-number {
      padding: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    /* Today Highlight */
    .fc .fc-day-today {
      background: rgba(23, 201, 100, 0.05) !important;
    }

    .fc .fc-day-today .fc-daygrid-day-number {
      background: #17c964;
      color: white;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.25rem;
    }

    /* Other Month Days */
    .fc .fc-day-other .fc-daygrid-day-number {
      color: #d1d5db;
    }

    /* Weekend Styling */
    .fc .fc-day-sat,
    .fc .fc-day-sun {
      background: #fafafa;
    }

    /* Event Cells */
    .fc .fc-daygrid-day-frame {
      min-height: 5rem;
    }

    .fc .fc-daygrid-event {
      margin: 2px 4px;
      border: none;
      border-radius: 0.375rem;
    }

    .fc .fc-daygrid-event-harness {
      margin-bottom: 2px;
    }

    /* More Link */
    .fc .fc-daygrid-more-link {
      color: #17c964;
      font-weight: 600;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      background: rgba(23, 201, 100, 0.1);
      margin: 2px 4px;
    }

    .fc .fc-daygrid-more-link:hover {
      background: rgba(23, 201, 100, 0.2);
      text-decoration: none;
    }

    /* Week View Time Grid */
    .fc .fc-timegrid-slot {
      height: 3rem;
      border-color: #f3f4f6;
    }

    .fc .fc-timegrid-slot-label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
    }

    .fc .fc-timegrid-event {
      border: none;
      border-radius: 0.375rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* List View */
    .fc .fc-list-event {
      cursor: pointer;
      transition: background 0.2s;
    }

    .fc .fc-list-event:hover {
      background: #f9fafb;
    }

    .fc .fc-list-event-dot {
      background: #17c964;
      border-color: #17c964;
    }

    .fc .fc-list-day-cushion {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }

    /* Scrollbar Styling */
    .fc-scroller::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .fc-scroller::-webkit-scrollbar-track {
      background: #f3f4f6;
      border-radius: 4px;
    }

    .fc-scroller::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }

    .fc-scroller::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }

    /* Remove default borders */
    .fc .fc-scrollgrid {
      border-color: #e5e7eb;
    }

    .fc .fc-scrollgrid-section > * {
      border-color: #e5e7eb;
    }

    /* Popover */
    .fc .fc-popover {
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .fc .fc-popover-header {
      background: #f9fafb;
      color: #374151;
      font-weight: 600;
      border-radius: 0.75rem 0.75rem 0 0;
    }
  `;

  React.useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = customStyles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const customButtons = {
    prev: {
      text: (
        <Icon
          icon="mynaui:chevron-left-solid"
          className="w-4 h-4 text-gray-500 hover:text-[#17c964]"
        />
      ),
      click: () => calendarRef.current?.getApi().prev(),
    },
    next: {
      text: (
        <Icon
          icon="mynaui:chevron-right-solid"
          className="w-4 h-4 text-gray-500 hover:text-[#17c964]"
        />
      ),
      click: () => calendarRef.current?.getApi().next(),
    },
    today: {
      text: "Today",
      click: () => calendarRef.current?.getApi().today(),
    },
  };

  const headerToolbar = {
    left: "title",
    center: "",
    right: "prev,next",
  };

  const memoizedEvents = React.useMemo(
    () =>
      events.map((event: any) => ({
        ...event,
        id: String(event.id),
        editable: false,
        durationEditable: false,
      })) ?? [],
    [events],
  );

  const buttonClassNames = (view: string) =>
    `px-3 py-1 text-sm rounded-md transition-all duration-200 ${
      currentView === view
        ? "bg-[#17c964] text-white"
        : "text-gray-500 hover:bg-gray-100"
    }`;

  const Switcher = () => (
    <div className="space-x-2 flex bg-gray-50 p-1 rounded-lg">
      {["dayGridMonth", "timeGridWeek", "listWeek"].map((view) => (
        <button
          key={view}
          onClick={() => {
            calendarRef.current?.getApi().changeView(view);
            setCurrentView(view);
          }}
          className={buttonClassNames(view)}
        >
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
    <div className="w-full max-w-full bg-white rounded-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-white/60 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">SEDP Calendar</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Events, announcements & schedules
          </p>
        </div>

        <div className="hidden md:flex">
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
          weekNumberClassNames="hidden"
          events={memoizedEvents}
          height="auto"
          selectable
          dayMaxEvents
          eventContent={(eventInfo) => (
            <Button
              onPress={() => handlePress(eventInfo.event.id)}
              as={"div"}
              radius="sm"
              className="border-none bg-[#17c964]/10 text-[#17c964] hover:bg-[#17c964]/20
              w-full text-left p-2 flex flex-col rounded-lg"
            >
              <span className="font-medium">{eventInfo.event.title}</span>
              <span className="text-xs text-gray-500">
                @{eventInfo.event.extendedProps.location}
              </span>
            </Button>
          )}
          eventTextColor="#17c964"
          eventBackgroundColor="transparent"
          viewClassNames="overflow-x-auto"
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
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            list: "List",
          }}
        />
      </div>

      {/* Mobile Switcher */}
      <div className="md:hidden flex justify-center pb-4 px-4">
        <Switcher />
      </div>
    </div>
  );
}

export default FCalendar;
