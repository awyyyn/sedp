import { environment } from "../environments/environment.js";

import { prisma } from "../services/prisma.js";
import {
	CreateScholarInput,
	PaginationArgs,
	PaginationResult,
	Student,
	StudentStatus,
} from "../types/index.js";
import { Prisma } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

export const createStudent = async (
	values: CreateScholarInput
): Promise<Student> => {
	const {
		address,
		birthDate,
		email,
		firstName,
		lastName,
		gender,
		mfaSecret,
		middleName,
		password,
		course,
		schoolName,
		phoneNumber,
		yearLevel,
	} = values;

	const generateSalt = await genSalt(environment.SALT);
	const hashedPassword = await hash(password, generateSalt);

	const newStudentUser = await prisma.student.create({
		data: {
			password: hashedPassword,
			address,
			birthDate: new Date(birthDate).toISOString(),
			email,
			firstName,
			course,
			lastName,
			phoneNumber,
			schoolName,
			gender,
			yearLevel,
			middleName,
			status: "SCHOLAR",
			mfaEnabled: !!mfaSecret,
			mfaSecret,
		},
	});
	return {
		...newStudentUser,
		birthDate: newStudentUser.birthDate.toISOString(),
	};
};

export const updateStudent = async (
	id: string,
	values: Partial<Student>
): Promise<Student> => {
	let toUpdateData = values;
	let hashedPassword: string | undefined = undefined;

	if (values.status) {
		toUpdateData.statusUpdatedAt = new Date();
	}

	if (values.password && values.password.trim()) {
		const generateSalt = await genSalt(environment.SALT);
		hashedPassword = await hash(values.password.trim(), generateSalt);
	}

	const updatedStudent = await prisma.student.update({
		data: {
			...toUpdateData,
			password: hashedPassword,
		},
		where: {
			id,
		},
	});

	return {
		...updatedStudent,
		birthDate: updatedStudent.birthDate.toISOString(),
	};
};

export const readStudent = async (id: string): Promise<Student | null> => {
	let where: Prisma.StudentWhereInput = {
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

	return {
		...student,
		birthDate: student.birthDate.toISOString(),
	};
};

export async function readAllStudents({
	filter,
	pagination,
	status,
}: PaginationArgs<StudentStatus> = {}): Promise<PaginationResult<Student>> {
	let where: Prisma.StudentWhereInput = {};

	if (filter) {
		where = {
			OR: [
				{ email: { contains: filter } },
				{ firstName: { contains: filter } },
				{ lastName: { contains: filter } },
			],
		};
	}

	console.log(status);

	if (status) {
		where.status = status;
	}

	const users = await prisma.student.findMany({
		where,
		skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
		take: pagination ? pagination.take : undefined,
	});

	const count = await prisma.student.count({
		where,
	});

	return {
		data: users.map((user) => ({
			...user,
			birthDate: user.birthDate.toISOString(),
		})),
		hasMore: pagination ? pagination.page * pagination.take < count : false,
		count,
	};
}

export const changePassword = async (newPassword: string, id: string) => {
	const generateSalt = await genSalt(environment.SALT);
	const hashedPassword = await hash(newPassword, generateSalt);

	await prisma.student.update({
		data: {
			password: hashedPassword,
		},
		where: {
			id,
		},
	});
};
