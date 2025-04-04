import {
	Announcement,
	Document,
	SystemUser as PSystemUser,
} from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { SystemUser, SystemUserRole } from "./system-user.js";

export * from "./system-user.js";
export * from "./student.js";
export * from "./token.js";

export type DocumentInput = Omit<Document, "id" | "createdAt" | "updatedAt">;

export type CreateSystemUserInput = Omit<
	SystemUser,
	"id" | "createdAt" | "updatedAt" | "status" | "verifiedAt"
>;

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
}

export interface GetAllowanceArgs {
	studentId?: string;
	year?: number;
	semester?: number;
	month?: number;
	claimed?: boolean;
	yearLevel?: number;
	pagination?: {
		page: number;
		take: number;
	};
	includeStudent?: boolean;
}

export interface AnnouncementWithRelation extends Announcement {
	createdBy: PSystemUser;
}

export type AppContext = {
	id: string;
	email: string;
	role: SystemUserRole | "STUDENT";
	prisma: typeof prisma;
};

export type Gender = "MALE" | "FEMALE";

export interface CalendarEvent {
	id: string;
	start: string;
	end: string;
	location: string;
	title: string;
	backgroundColor: string;
	borderColor: string;
}
