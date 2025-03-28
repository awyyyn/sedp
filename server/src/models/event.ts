import { prisma } from "../services/prisma.js";
import { Events, Prisma } from "@prisma/client";
import { PaginationArgs } from "../types/system-user.js";
import { CalendarEvent, PaginationResult } from "../types/index.js";
import { format } from "date-fns";

export const upsertEvent = async (
	{
		description,
		endDate,
		endTime,
		location,
		startDate,
		startTime,
		title,
	}: Omit<Events, "id" | "createdAt">,
	toUpdateId?: string
) => {
	return await prisma.events.upsert({
		create: {
			description,
			endDate,
			endTime,
			location,
			startDate,
			startTime,
			title,
		},
		update: {
			description,
			endDate,
			endTime,
			location,
			startDate,
			startTime,
			title,
		},
		where: {
			id: toUpdateId,
		},
	});
};

export async function readAllEvents({
	filter,
	pagination,
}: PaginationArgs = {}): Promise<PaginationResult<Events>> {
	let where: Prisma.EventsWhereInput = {};

	if (filter) {
		where = { title: { contains: filter } };
	}

	const events = await prisma.events.findMany({
		where,
		take: pagination ? pagination.take : undefined,
		skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
	});

	const count = await prisma.events.count({
		where,
	});

	const hasMore = pagination
		? pagination.page * pagination.take < count
		: false;

	return {
		data: events,
		count: count,
		hasMore: hasMore,
	};
}

export async function readEvent(id: string) {
	return await prisma.events.findUnique({
		where: {
			id,
		},
	});
}

export const deleteEvent = async (id: string) => {
	return await prisma.events.delete({
		where: { id },
	});
};

export const readEventAsCalendar = async (): Promise<CalendarEvent[]> => {
	const allEvents = await prisma.events.findMany({});

	// const futureEvents = allEvents.data.filter((event) =>
	// 	isFuture(event.startDate)
	// );

	const setTimeOnDate = (date: Date, timeString: string) => {
		// Split the timeString into hours and minutes
		const [hours, minutes] = timeString.split(":").map(Number);

		// Set the hours and minutes on the provided date
		date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
		return date;
	};

	return allEvents.map((event) => {
		// Start Date & Time
		const start = setTimeOnDate(
			new Date(event.startDate),
			format(event.startTime, "HH:mm")
		);

		// End Date & Time
		const end = setTimeOnDate(
			new Date(event.endDate),
			format(event.endTime, "HH:mm")
		);

		const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;

		return {
			id: event.id,
			start: start.toISOString(),
			end: end.toISOString(),
			location: event.location,
			title: event.title,
			backgroundColor: color,
			borderColor: color,
		} as CalendarEvent;
	});
};
