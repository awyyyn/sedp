import { Document, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";

type DocumentInput = Omit<Document, "id" | "createdAt" | "updatedAt">;

export const createDocument = async (input: DocumentInput) => {
	const document = await prisma.document.create({
		data: input,
	});

	return document;
};

export const deleteDocument = async (id: string, ownerId: string) => {
	const document = await prisma.document.delete({
		where: {
			id,
			studentId: ownerId,
		},
	});

	return document;
};

export const getDocuments = async ({
	studentId,
	year,
	month,
	schoolYear,
	semester,
}: {
	studentId?: string;
	year?: number;
	schoolYear?: string;
	semester?: number;
	month?: number;
	type?: Document["documentType"];
} = {}) => {
	let where: Prisma.DocumentWhereInput = {};

	if (studentId) {
		where.studentId = studentId;
	}

	if (year) {
		where.year = year;
	}

	if (month) {
		where.month = month;
	}

	if (schoolYear) {
		where.schoolYear = schoolYear;
	}

	if (semester) {
		where.semester = semester;
	}

	const documents = await prisma.document.findMany({
		where,
		include: {
			student: true,
		},
	});

	return documents.map((doc) => ({
		...doc,
		createdAt: doc.createdAt.toISOString(),
		updatedAt: doc.updatedAt.toISOString(),
	}));
};
