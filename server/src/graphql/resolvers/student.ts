import {
	sendRegistrationLink,
	readStudent,
	updateStudent,
	readAllStudents,
} from "../../models/index.js";
import {
	AppContext,
	PaginationArgs,
	StudentUpdateArgs,
} from "../../types/index.js";
import { GraphQLError } from "graphql";

export const updateStudentResolver = async (
	_: never,
	{ values }: { values: StudentUpdateArgs },
	context: AppContext
) => {
	try {
		if (values.id !== context.id) {
			throw new GraphQLError("UnAuthorized!");
		}

		const updatedStudent = await updateStudent(context.id, values);

		if (!updatedStudent) {
			throw new GraphQLError("Error occurred while updating your information!");
		}

		return updatedStudent;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const studentsResolver = async (
	_: never,
	{ filter, pagination }: PaginationArgs
) => {
	try {
		const data = await readAllStudents({
			filter: filter ?? undefined,
			pagination: pagination ? pagination : undefined,
		});

		return data;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const studentResolver = async (_: never, { id }: { id: string }) => {
	try {
		const data = await readStudent(id);

		if (!data) {
			throw new GraphQLError("User not found!");
		}

		return data;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const sendStudentRegistrationEmailResolver = async (
	_: never,
	{ email }: { email: string; role: string },
	{ role }: AppContext
) => {
	if (role !== "SUPER_ADMIN") {
		throw new GraphQLError("UnAuthorized!");
	}
	try {
		const isUserExists = await readStudent(email);

		if (isUserExists) {
			throw new GraphQLError("User already exists!");
		}

		await sendRegistrationLink({ email, role: "STUDENT" });

		return { message: "Email sent successfully!" };
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};
