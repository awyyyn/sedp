import { prisma } from "@/services/prisma.js";

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
	role: "SUPER_ADMIN" | "ADMIN" | "STUDENT";
	prisma: typeof prisma;
};
