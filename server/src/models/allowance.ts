import { Allowance, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { GetAllowanceArgs } from "../types/index.js";

export const createAllowance = async (
	data: Omit<
		Allowance,
		"createdAt" | "updatedAt" | "id" | "claimed" | "claimedAt"
	>
) => {
	const allowance = await prisma.allowance.create({
		data: {
			year: data.year,
			month: data.month,
			totalAmount: data.totalAmount,
			semester: data.semester,
			yearLevel: data.yearLevel,
			bookAllowance: data.bookAllowance || 0,
			miscellaneousAllowance: data.miscellaneousAllowance || 0,
			monthlyAllowance: data.monthlyAllowance || 0,
			thesisAllowance: data.thesisAllowance || 0,
			student: {
				connect: {
					id: data.studentId,
				},
			},
		},
	});

	return {
		...allowance,
		createdAt: allowance.createdAt.toISOString(),
		updatedAt: allowance.updatedAt.toISOString(),
	};
};

export const updateAllowanceStatus = async (id: string, claimed: boolean) => {
	let claimedAt = null;

	if (claimed) {
		claimedAt = new Date();
	}

	const allowance = await prisma.allowance.update({
		where: {
			id,
		},
		data: {
			claimed,
			claimedAt,
		},
	});

	return {
		...allowance,
		createdAt: allowance.createdAt.toISOString(),
		updatedAt: allowance.updatedAt.toISOString(),
	};
};

export const readAllowance = async (
	studentId: string,
	year: number,
	month: number
) => {
	const allowance = await prisma.allowance.findFirst({
		where: {
			studentId,
			year,
			month,
		},
	});

	if (!allowance) return null;

	return {
		...allowance,
		createdAt: allowance.createdAt.toISOString(),
		updatedAt: allowance.updatedAt.toISOString(),
	};
};

export const readAllowances = async ({
	claimed = false,
	month,
	pagination,
	semester,
	studentId,
	year,
	yearLevel,
	includeStudent,
}: GetAllowanceArgs) => {
	let where: Prisma.AllowanceWhereInput = {};

	if (studentId) {
		where.studentId = studentId;
	}

	if (year) {
		where.year = year;
	}

	if (month) {
		where.month = month;
	}
	if (semester) {
		where.semester = semester;
	}
	if (yearLevel) {
		where.yearLevel = yearLevel;
	}
	if (claimed) {
		where.claimed = claimed;
	}

	const allowances = await prisma.allowance.findMany({
		where,
		take: pagination ? pagination.take : undefined,
		skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
		include: {
			student: includeStudent,
		},
	});

	const count = await prisma.allowance.count({
		where,
		take: pagination ? pagination.take : undefined,
		skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
	});

	const hasMore = pagination
		? pagination.page * pagination.take < count
		: false;

	return {
		data: (allowances || []).map((allowance) => ({
			...allowance,
			createdAt: allowance.createdAt.toISOString(),
			updatedAt: allowance.updatedAt.toISOString(),
		})),
		count: hasMore,
	};
};
