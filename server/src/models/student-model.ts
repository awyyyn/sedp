import { prisma } from "@/services/prisma.js";
import { Student } from "@/types/index.js";

export const create = async (
	values: Omit<Student, "id" | "createdAt" | "updatedAt">
) => {
	const newStudentUser = await prisma.student.create({
		data: values,
	});

	return newStudentUser;
};

export const update = async (values: Partial<Student>, id: string) => {
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
