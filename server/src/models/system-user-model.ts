import { prisma } from "@/services/prisma.js";
import { SystemUser, SystemUserAddress } from "@/types/system-user.js";
import { Prisma } from "@prisma/client";

export const createSystemUser = async (
	values: Omit<SystemUser, "id" | "createdAt" | "updatedAt" | "status">
) => {
	const {
		address,
		displayName,
		email,
		firstName,
		lastName,
		mfaEnabled,
		mfaSecret,
		password,
		role,
	} = values;

	const newUser = await prisma.systemUser.create({
		data: {
			email,
			password,
			firstName,
			lastName,
			role,
			address,
			displayName,
			mfaEnabled,
			mfaSecret,
		},
	});

	if (!newUser) return null;

	return newUser;
};

export const updateSystemUser = async (values: Partial<SystemUser>) => {
	const {
		address,
		status,
		displayName,
		email,
		firstName,
		id,
		lastName,
		mfaEnabled,
		mfaSecret,
		password,
		role,
	} = values;

	const updatedUser = await prisma.systemUser.update({
		where: { id },
		data: {
			email,
			password,
			firstName,
			lastName,
			role,
			displayName,
			mfaEnabled,
			mfaSecret,
			address,
			status,
		},
	});

	if (!updatedUser) return null;

	return updatedUser;
};

export const readSystemUser = async (
	identifier: string
): Promise<SystemUser | null> => {
	let where: Prisma.SystemUserWhereInput = { id: identifier };

	if (identifier.includes("@")) {
		where = { email: identifier };
	}

	const user = await prisma.systemUser.findFirst({
		where,
	});

	if (!user) return null;

	return {
		...user,
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
		mfaEnabled: !!user.mfaEnabled,
		mfaSecret: user.mfaSecret || "",
	};
};

export async function readAllSystemUsers(
	filter?: string
): Promise<SystemUser[]> {
	let where: Prisma.SystemUserWhereInput = {};

	if (filter) {
		where = {
			OR: [
				{ email: { contains: filter } },
				{ displayName: { contains: filter } },
				{ firstName: { contains: filter } },
				{ lastName: { contains: filter } },
			],
		};
	}

	const users = await prisma.systemUser.findMany({
		where,
	});

	return users.map((user) => ({
		...user,
		address:
			user.address ||
			({
				city: "",
				province: "",
				street: "",
				zip: 0,
			} as SystemUserAddress),
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
		mfaEnabled: !!user.mfaEnabled,
		mfaSecret: user.mfaSecret || "",
		password: "",
	}));
}
