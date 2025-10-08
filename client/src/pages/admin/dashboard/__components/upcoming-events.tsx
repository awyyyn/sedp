import React from "react";
import { Event } from "@/types";
import { Icon } from "@iconify/react/dist/iconify.js";

interface UpcomingEventsProps {
  events: Event[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex gap-4 border-b border-divider last:border-b-0 pb-4 last:pb-0"
        >
          <div className="flex flex-col items-center justify-center min-w-[50px] h-[50px] bg-primary-50 rounded-md">
            <span className="text-xs font-semibold text-primary">
              {new Date(event.startDate).toLocaleDateString(undefined, {
                month: "short",
              })}
            </span>
            <span className="text-lg font-bold text-primary">
              {new Date(event.startDate).getDate()}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">{event.title}</h4>
            <p className="text-xs text-default-500 mb-1 flex items-center gap-1">
              <Icon icon="lucide:clock" className="text-xs" />
              {new Date(event.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -
              {new Date(event.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-default-500 flex items-center gap-1">
              <Icon icon="lucide:map-pin" className="text-xs" />
              {event.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
