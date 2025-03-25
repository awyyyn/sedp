import { Events, Meeting } from "@prisma/client";
import { readAllEvents, readEvent, upsertEvent } from "../../models/event.js";
import { AppContext, PaginationArgs } from "../../types/index.js";
import { GraphQLError } from "graphql";
import {
	readAllMeetings,
	readMeeting,
	upsertMeeting,
} from "../../models/meeting.js";

type MeetingInput = Omit<Meeting, "createdAt" | "id" | "date"> & {
	date: string;
};

export const createMeetingResolver = async (
	_: never,
	{ description, endTime, location, startTime, title, date }: MeetingInput,
	app: AppContext
) => {
	try {
		if (
			!(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_GATHERINGS")
		) {
			throw new GraphQLError("Unauthorized!");
		}

		const newMeeting = await upsertMeeting({
			description,
			date: new Date(date),
			endTime,
			location,
			startTime,
			title,
		});

		if (!newMeeting) throw new GraphQLError("Failed to create event!");

		return newMeeting;
	} catch (err) {
		console.log(err, "qq");
		throw new GraphQLError("Internal Server Error!");
	}
};

export const updateMeetingResolver = async (
	_: never,
	{
		description,
		endTime,
		location,
		startTime,
		title,
		id,
		date,
	}: MeetingInput & { id: string },
	app: AppContext
) => {
	try {
		if (
			!(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_GATHERINGS")
		) {
			throw new GraphQLError("Unauthorized!");
		}

		const updatedMeeting = await upsertMeeting(
			{
				description,
				endTime,
				location,
				date: new Date(date),
				startTime,
				title,
			},
			id
		);

		if (!updatedMeeting) throw new GraphQLError("Failed to create event!");

		return updatedMeeting;
	} catch (err) {
		console.log(err, "qq");
		throw new GraphQLError("Internal Server Error!");
	}
};

export const meetingsResolver = async (
	_: never,
	{ filter, pagination }: PaginationArgs
) => {
	try {
		return await readAllMeetings({
			filter: filter ?? undefined,
			pagination: pagination ? pagination : undefined,
		});
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const meetingResolver = async (_: never, { id }: { id: string }) => {
	try {
		const meeting = await readMeeting(id);

		if (!meeting) throw new GraphQLError("Failed to create event!");

		return meeting;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};
