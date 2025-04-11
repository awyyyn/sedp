import {
	sendRegistrationLink,
	readStudent,
	updateStudent,
	readAllStudents,
	createStudent,
	sendCredentials,
	sendDisqualificationEmail,
} from "../../models/index.js";
import {
	AppContext,
	CreateScholarInput,
	PaginationArgs,
	StudentStatus,
	StudentUpdateArgs,
} from "../../types/index.js";
import { GraphQLError } from "graphql";

export const updateStudentResolver = async (
	_: never,
	{ id, ...values }: StudentUpdateArgs,
	context: AppContext
) => {
	try {
		if (id !== context.id && context.role === "STUDENT") {
			throw new GraphQLError("UnAuthorized!");
		}

		const updatedStudent = await updateStudent(id, values);

		if (!updatedStudent) {
			throw new GraphQLError("Error occurred while updating your information!");
		}

		if (updatedStudent.status === "DISQUALIFIED") {
			await sendDisqualificationEmail({ email: updatedStudent.email });
		}

		return updatedStudent;
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};

export const studentsResolver = async (
	_: never,
	{ filter, pagination, status }: PaginationArgs<StudentStatus>
) => {
	try {
		const data = await readAllStudents({
			filter: filter ?? undefined,
			pagination: pagination ? pagination : undefined,
			status,
		});

		return data;
	} catch (err) {
		console.log(err);
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

export const createStudentResolver = async (
	_: never,
	data: CreateScholarInput,
	app: AppContext
) => {
	try {
		if (app.role !== "SUPER_ADMIN" && app.role !== "ADMIN_MANAGE_SCHOLAR") {
			throw new GraphQLError("UnAuthorized Access!");
		}

		const newScholar = await createStudent(data);

		if (!newScholar) return null;
		await sendCredentials({
			email: newScholar.email,
			password: data.password,
		});
		return newScholar;
	} catch (error) {
		console.log(error);
		if (error instanceof GraphQLError) {
			throw new GraphQLError((error as GraphQLError).message);
		} else {
			throw new GraphQLError("Internal Server Error!");
		}
	}
};
