import { Announcement, SystemUser as PSystemUser } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { SystemUser, SystemUserRole } from "./system-user.js";

export * from "./system-user.js";
export * from "./student.js";
export * from "./token.js";

export type CreateSystemUserInput = Omit<
	SystemUser,
	"id" | "createdAt" | "updatedAt" | "status"
>;

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
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
