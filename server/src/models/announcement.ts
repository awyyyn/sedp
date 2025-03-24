import { Announcement, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { PaginationArgs } from "../types/system-user.js";
import { AnnouncementWithRelation, PaginationResult } from "../types/index.js";

export const createAnnouncement = async ({
	content,
	createdById,
	title,
}: Pick<Announcement, "content" | "createdById" | "title">) => {
	const newAnnouncement = await prisma.announcement.create({
		data: {
			content,
			createdBy: {
				connect: {
					id: createdById,
				},
			},
			title,
		},
	});

	return newAnnouncement;
};

export const readAnnouncements = async ({
	filter,
	pagination,
}: PaginationArgs = {}): Promise<
	PaginationResult<AnnouncementWithRelation>
> => {
	let where: Prisma.AnnouncementWhereInput = {};

	if (filter) {
		where = {
			title: { contains: filter },
		};
	}

	const announcements = await prisma.announcement.findMany({
		where,
		include: {
			createdBy: true,
		},
		take: pagination ? pagination.take : undefined,
		skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
	});

	const count = await prisma.announcement.count({
		where,
	});

	const hasMore = pagination
		? pagination.page * pagination.take < count
		: false;

	return {
		data: announcements,
		count: count,
		hasMore: hasMore,
	};
};

export const readAnnouncement = async (
	id: string
): Promise<AnnouncementWithRelation | null> => {
	return await prisma.announcement.findUnique({
		where: {
			id,
		},
		include: {
			createdBy: true,
		},
	});
};

export const editAnnouncement = async ({
	content,
	title,
	id,
}: Pick<Announcement, "content" | "id" | "title">) => {
	const newAnnouncement = await prisma.announcement.update({
		data: {
			content,
			title,
		},
		where: {
			id,
		},
	});

	return {
		...newAnnouncement,
		createdAt: newAnnouncement.createdAt.toISOString(),
	};
};

export const deleteAnnouncement = async (id: string) => {
	return await prisma.announcement.delete({
		where: {
			id,
		},
	});
};
