import { SystemUser } from "./system-user";

export type Announcement = {
	readonly id: string;
	title: string;
	content: string;
	createdBy: SystemUser;
	createdAt: string;
};
