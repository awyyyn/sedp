import { prisma } from "@/services/prisma.js";
import { SystemUser } from "@/types/system-user.js";

export const create = async (
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

export const update = async (values: Partial<SystemUser>) => {
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
			status,
		},
	});

	if (!updatedUser) return null;

	return updatedUser;
};

export const read = async (identifier: string): Promise<SystemUser | null> => {
	const user = await prisma.systemUser.findFirst({
		where: {
			OR: [{ id: identifier }, { email: identifier }],
		},
	});

	if (!user) return null;

	return {
		...user,
		address: user.address || undefined,
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
		mfaEnabled: !!user.mfaEnabled,
		mfaSecret: user.mfaSecret || "",
		password: "",
	};
};

export async function readAll(): Promise<SystemUser[]>;
export async function readAll(filter?: string): Promise<SystemUser[] | null> {
	const users = await prisma.systemUser.findMany({
		where: {
			OR: [
				{ email: { contains: filter } },
				{ displayName: { contains: filter } },
				{ firstName: { contains: filter } },
				{ lastName: { contains: filter } },
			],
		},
	});

	return users.map((user) => ({
		...user,
		address: user.address || undefined,
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
		mfaEnabled: !!user.mfaEnabled,
		mfaSecret: user.mfaSecret || "",
		password: "",
	}));
}
