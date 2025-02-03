import { sendRegistrationLink } from "@/models/email-model.js";
import {
	readAllSystemUsers,
	readSystemUser,
	updateSystemUser,
} from "@/models/system-user-model.js";
import {
	AppContext,
	PaginationArgs,
	SystemUserUpdateArgs,
} from "@/types/index.js";
import { GraphQLError } from "graphql";

export const systemUsersResolver = async (
	_: never,
	{ filter, pagination }: PaginationArgs
) => {
	try {
		const data = await readAllSystemUsers({
			filter: filter ?? undefined,
			pagination: pagination ? pagination : undefined,
		});

		return data;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const systemUserResolver = async (_: never, { id }: { id: string }) => {
	try {
		const data = await readSystemUser(id);

		if (!data) {
			throw new GraphQLError("User not found!");
		}

		return data;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const updateSystemUserResolver = async (
	_: never,
	{ values }: { values: SystemUserUpdateArgs },
	context: AppContext
) => {
	if (values.id !== context.id) {
		throw new GraphQLError("UnAuthorized!");
	}

	try {
		const updatedUser = await updateSystemUser(context.id, values);

		if (!updatedUser) {
			throw new GraphQLError("Error occurred while updating your information!");
		}

		return updatedUser;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const deleteSystemUserResolver = async (
	_: never,
	{ id }: { id: string },
	{ role }: AppContext
) => {
	if (role !== "SUPER_ADMIN") {
		throw new GraphQLError("UnAuthorized!");
	}

	try {
		const deletedUser = await updateSystemUser(id, { status: "DELETED" });

		if (!deletedUser) {
			throw new GraphQLError("Error occurred while deleting the user!");
		}

		return deletedUser;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const sendSystemUserRegistrationEmailResolver = async (
	_: never,
	{ email }: { email: string; role: string },
	{ role }: AppContext
) => {
	if (role !== "SUPER_ADMIN") {
		throw new GraphQLError("UnAuthorized!");
	}
	try {
		const isUserExists = await readSystemUser(email);

		if (isUserExists) {
			throw new GraphQLError("User already exists!");
		}

		await sendRegistrationLink({ email, role });

		return { message: "Email sent successfully!" };
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};
