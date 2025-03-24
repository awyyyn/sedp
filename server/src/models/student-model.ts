import { environment } from "../environments/environment.js";
import { prisma } from "../services/prisma.js";
import {
	CreateScholarInput,
	PaginationResult,
	Student,
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

	return newStudentUser;
};

export const updateStudent = async (
	id: string,
	values: Partial<Student>
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

	return student;
};

interface readAllArgs {
	filter?: string;
	pagination?: { take: number; page: number };
}

export async function readAllStudents({
	filter,
	pagination,
}: readAllArgs = {}): Promise<PaginationResult<Student>> {
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

	const users = await prisma.student.findMany({
		where,
		skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
		take: pagination ? pagination.take : undefined,
	});

	const count = await prisma.student.count({
		where,
	});

	return {
		data: users,
		hasMore: pagination ? pagination.page * pagination.take < count : false,
		count,
	};
}
