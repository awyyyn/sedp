import { Events } from "@prisma/client";
import {
	deleteEvent,
	readAllEvents,
	readEvent,
	readEventAsCalendar,
	readMonthlyEvents,
	upsertEvent,
} from "../../models/event.js";
import { AppContext, PaginationArgs } from "../../types/index.js";
import { GraphQLError } from "graphql";

export const createEventResolver = async (
	_: never,
	{
		description,
		endDate,
		endTime,
		location,
		startDate,
		startTime,
		title,
	}: Omit<Events, "createdAt" | "id">,
	app: AppContext
) => {
	try {
		if (
			!(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_GATHERINGS")
		) {
			throw new GraphQLError("Unauthorized!");
		}

		const newEvent = await upsertEvent(
			{
				description,
				endDate,
				endTime,
				location,
				startDate,
				startTime,
				title,
			},
			"67dfd118d8898db58de87455"
		);

		if (!newEvent) throw new GraphQLError("Failed to create event!");

		return newEvent;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const updateEventResolver = async (
	_: never,
	{
		description,
		endDate,
		endTime,
		location,
		startDate,
		startTime,
		title,
		id,
	}: Omit<Events, "createdAt">,
	app: AppContext
) => {
	try {
		if (
			!(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_GATHERINGS")
		) {
			throw new GraphQLError("Unauthorized!");
		}

		const updatedEvent = await upsertEvent(
			{
				description,
				endDate,
				endTime,
				location,
				startDate,
				startTime,
				title,
			},
			id
		);

		if (!updatedEvent) throw new GraphQLError("Failed to create event!");

		return updatedEvent;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const eventsResolver = async (
	_: never,
	{ filter, pagination }: PaginationArgs<never>
) => {
	try {
		return await readAllEvents({
			filter: filter ?? undefined,
			pagination: pagination ? pagination : undefined,
		});
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const eventResolver = async (_: never, { id }: { id: string }) => {
	try {
		const event = await readEvent(id);

		if (!event) throw new GraphQLError("Failed to create event!");

		return event;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const deleteEventResolver = async (_: never, { id }: { id: string }) => {
	try {
		const event = await deleteEvent(id);

		if (!event) throw new GraphQLError("Failed to create event!");

		return event;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const calendarEventsResolver = async () => {
	try {
		const events = await readEventAsCalendar();

		return events;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const monthlyEventsResolver = async () => {
	try {
		const events = await readMonthlyEvents(
			new Date().getFullYear(),
			new Date().getMonth()
		);

		return events;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};
