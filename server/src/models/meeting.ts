import { prisma } from "../services/prisma.js";
import { Meeting, Prisma } from "@prisma/client";
import { PaginationArgs } from "../types/system-user.js";
import { CalendarEvent, PaginationResult } from "../types/index.js";
import { format } from "date-fns";

export const upsertMeeting = async (
	{
		description,
		endTime,
		location,
		startTime,
		date,
		title,
	}: Omit<Meeting, "id" | "createdAt">,
	toUpdateId?: string
) => {
	return await prisma.meeting.upsert({
		create: {
			description,
			endTime,
			location,
			startTime,
			title,
			date,
		},
		update: {
			description,
			endTime,
			location,
			date,
			startTime,
			title,
		},
		where: {
			id: toUpdateId,
		},
	});
};

export async function readAllMeetings({
	filter,
	pagination,
}: PaginationArgs = {}): Promise<PaginationResult<Meeting>> {
	let where: Prisma.MeetingWhereInput = {};

	if (filter) {
		where = { title: { contains: filter } };
	}

	const meetings = await prisma.meeting.findMany({
		where,
		take: pagination ? pagination.take : undefined,
		skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
	});

	const count = await prisma.meeting.count({
		where,
	});

	const hasMore = pagination
		? pagination.page * pagination.take < count
		: false;

	return {
		data: meetings,
		count: count,
		hasMore: hasMore,
	};
}

export async function readMeeting(id: string) {
	return await prisma.meeting.findUnique({
		where: {
			id,
		},
	});
}

export async function deleteMeeting(id: string) {
	return await prisma.meeting.delete({
		where: {
			id,
		},
	});
}

export const readMeetingAsCalendar = async (): Promise<CalendarEvent[]> => {
	const meetings = await prisma.meeting.findMany({});

	// const futureEvents = allEvents.data.filter((meeting) =>
	// 	isFuture(meeting.startDate)
	// );

	const setTimeOnDate = (date: Date, timeString: string) => {
		// Split the timeString into hours and minutes
		const [hours, minutes] = timeString.split(":").map(Number);

		// Set the hours and minutes on the provided date
		date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
		return date;
	};

	return meetings.map((meeting) => {
		// Start Date & Time
		const start = setTimeOnDate(
			new Date(meeting.date),
			format(meeting.startTime, "HH:mm")
		);

		// End Date & Time
		const end = setTimeOnDate(
			new Date(meeting.date),
			format(meeting.endTime, "HH:mm")
		);

		const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;

		return {
			id: meeting.id,
			start: start.toISOString(),
			end: end.toISOString(),
			location: meeting.location,
			title: meeting.title,
			backgroundColor: color,
			borderColor: color,
		} as CalendarEvent;
	});
};
