import { prisma } from "../services/prisma.js";
import { Meeting, Prisma } from "@prisma/client";
import { PaginationArgs } from "../types/system-user.js";
import { PaginationResult } from "../types/index.js";

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
