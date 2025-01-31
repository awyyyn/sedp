import { prisma } from "@/services/prisma.js";
import { Student } from "@/types/index.js";
import { Prisma } from "@prisma/client";

export const createStudent = async (
	values: Omit<Student, "id" | "createdAt" | "updatedAt">
): Promise<Student> => {
	const newStudentUser = await prisma.student.create({
		data: values,
	});

	return newStudentUser;
};

export const updateStudent = async (
	values: Partial<Student>,
	id: string
): Promise<Student> => {
	const updatedStudent = await prisma.student.update({
		data: {
			...values,
		},

		where: {
			id,
		},
	});

	return updatedStudent;
};

export const readStudent = async (id: string): Promise<Student | null> => {
	let where: Prisma.studentWhereInput = {
		id: id,
	};

	if (id.includes("@")) {
		where = {
			email: id,
		};
	}

	const student = await prisma.student.findFirst({
		where,
	});

	if (!student) return null;

	return student;
};

interface readAllArgs {
	filter?: string;
	pagination?: { take: number; page: number };
}

export async function readAllStudents({
	filter,
	pagination,
}: readAllArgs = {}): Promise<Student[]> {
	let where: Prisma.studentWhereInput = {};

	if (filter) {
		where = {
			OR: [
				{ email: { contains: filter } },
				{ schoolYear: { contains: filter } },
				{ schoolYear: { contains: filter } },
				{ firstName: { contains: filter } },
				{ lastName: { contains: filter } },
			],
		};
	}

	const users = await prisma.student.findMany({
		where,
		skip: pagination ? pagination.page * pagination.take - 1 : undefined,
		take: pagination ? pagination.take : undefined,
	});

	return users;
}
