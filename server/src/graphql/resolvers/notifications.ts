import {
	AdminNotification,
	ScholarNotification,
	SystemUserRole,
} from "@prisma/client";
import {
	createAdminNotification,
	createStudentNotification,
	readAdminNotification,
	readStudentNotification,
	updateReadAdminNotification,
	updateReadAllAdminNotification,
	updateReadAllNotifications,
	updateReadStudentNotification,
} from "../../models/notification.js";
import { GraphQLError } from "graphql";
import { AppContext } from "../../types/index.js";
import { pubsub } from "../../services/pubsub.js";

export const createAdminNotificationResolver = async (
	_: never,
	data: Omit<AdminNotification, "id" | "createdAt" | "read" | "readerIds">
) => {
	try {
		const notification = await createAdminNotification(data);

		pubsub.publish("ADMIN_NOTIFICATION_SENT", {
			adminNotificationSent: notification,
		});

		return notification;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const updateReadAdminNotificationResolver = async (
	_: never,
	data: { notificationId: string },
	app: AppContext
) => {
	try {
		const notification = await updateReadAdminNotification(
			app.id,
			data.notificationId
		);

		return notification;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const updateReadAllAdminNotificationResolver = async (
	_: never,
	__: never,
	app: AppContext
) => {
	try {
		const notification = await updateReadAllAdminNotification(
			app.id,
			app.role as SystemUserRole
		);

		return notification;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const readAdminNotificationResolver = async (
	_: never,
	__: never,
	app: AppContext
) => {
	try {
		return await readAdminNotification(app.role as SystemUserRole);
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const createStudentNotificationResolver = async (
	_: never,
	data: Omit<ScholarNotification, "id" | "createdAt" | "read" | "receiverId">,
	app: AppContext
) => {
	try {
		return await createStudentNotification({
			link: data.link,
			message: data.message,
			receiverId: app.id,
			title: data.title,
			type: data.type,
		});
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const readStudentNotificationResolver = async (
	_: never,
	__: never,
	app: AppContext
) => {
	try {
		return await readStudentNotification(app.id);
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const updateReadStudentNotificationResolver = async (
	_: never,
	{ notificationId }: { notificationId?: string },
	app: AppContext
) => {
	try {
		return await updateReadStudentNotification(app.id, notificationId);
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const updateReadAllNotificationsResolver = async (
	_: never,
	__: never,
	app: AppContext
) => {
	try {
		return await updateReadAllNotifications(app.id);
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};
