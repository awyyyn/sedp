import { prisma } from "../services/prisma.js";
import { SystemUserRole } from "./system-user.js";

export * from "./system-user.js";
export * from "./student.js";
export * from "./token.js";

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
}

export type AppContext = {
	id: string;
	email: string;
	role: SystemUserRole | "STUDENT";
	prisma: typeof prisma;
};
