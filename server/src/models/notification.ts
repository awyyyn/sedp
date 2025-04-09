import {
	AdminNotification,
	Prisma,
	ScholarNotification,
	SystemUserRole,
} from "@prisma/client";
import { prisma } from "../services/prisma.js";

export const readStudentNotification = async (id: string) => {
	const notifications = await prisma.scholarNotification.findMany({
		where: {
			receiverId: id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return notifications.map((notification) => ({
		...notification,
		createdAt: notification.createdAt.toISOString(),
	}));
};

export const updateReadStudentNotification = async (
	id: string,
	notificationId?: string
) => {
	if (!notificationId) {
		await prisma.scholarNotification.updateMany({
			data: { read: true },
			where: {
				receiverId: id,
				read: false,
			},
		});

		return true;
	}

	await prisma.scholarNotification.update({
		data: { read: true },
		where: {
			id: notificationId,
			receiverId: id,
			read: false,
		},
	});

	return true;
};

export const updateReadAllNotifications = async (id: string) => {
	const notifications = await prisma.scholarNotification.updateMany({
		data: {
			read: true,
		},
		where: {
			receiverId: id,
			read: false,
		},
	});

	console.log(notifications);

	return notifications;
};

export const readAdminNotification = async (role: SystemUserRole) => {
	let where: Prisma.AdminNotificationWhereInput = {};

	if (role !== SystemUserRole.SUPER_ADMIN) {
		where.role = role;
	}

	const notifications = await prisma.adminNotification.findMany({
		where,
	});

	return notifications.map((notification) => ({
		...notification,
		createdAt: notification.createdAt.toISOString(),
	}));
};

export const updateReadAdminNotification = async (
	id: string,
	notificationId: string
) => {
	const notification = await prisma.adminNotification.update({
		data: {
			readerIds: {
				push: id,
			},
		},
		where: {
			id: notificationId,
		},
	});

	return notification;
};

export const updateReadAllAdminNotification = async (
	id: string,
	role: SystemUserRole
) => {
	const notifications = await prisma.adminNotification.updateMany({
		data: {
			readerIds: {
				push: id,
			},
		},
		where: {
			role,
		},
	});

	return notifications;
};

export const createStudentNotification = async (
	data: Omit<ScholarNotification, "id" | "createdAt" | "read">
) => {
	return await prisma.scholarNotification.create({
		data: {
			title: data.title,
			message: data.message,
			receiver: {
				connect: {
					id: data.receiverId,
				},
			},
			link: data.link || null,
			type: data.type,
		},
	});
};

export const createAdminNotification = async (
	data: Omit<AdminNotification, "id" | "createdAt" | "read" | "readerIds">
) => {
	return await prisma.adminNotification.create({
		data: {
			message: data.message,
			title: data.title,
			role: data.role,
			link: data.link || null,
			type: data.type,
		},
	});
};
