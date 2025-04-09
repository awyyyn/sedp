import { SystemUserRole } from "./system-user";

interface Notification {
	readonly id: string;
	read: boolean;
	title: string;
	message: string;

	link?: string;
	createdAt: string;
}

export interface AdminNotification extends Notification {
	type: AdminNotificationType;
	role: SystemUserRole;
	readerIds: string[];
}

export interface ScholarNotification extends Notification {
	type: ScholarNotificationType;
	receiverId: string;
}

export type ScholarNotificationType =
	| "MEETING"
	| "EVENT"
	| "ANNOUNCEMENT"
	| "ALLOWANCE"
	| "SYSTEM_UPDATE"
	| "OTHER";

export type AdminNotificationType =
	| "SEMESTER_DOCUMENT"
	| "MONTHLY_DOCUMENT"
	| "OTHER";
