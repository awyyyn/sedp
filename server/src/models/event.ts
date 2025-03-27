import { prisma } from "../services/prisma.js";
import { Events, Prisma } from "@prisma/client";
import { PaginationArgs } from "../types/system-user.js";
import { PaginationResult } from "../types/index.js";

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
