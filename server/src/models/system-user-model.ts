import { environment } from "@/environments/environment.js";
import { prisma } from "@/services/prisma.js";
import { SystemUser, PaginationArgs, PaginationResult } from "@/types/index.js";
import { Prisma, SystemUserStatus } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

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
		birthDate,
		phoneNumber,
		password,
		role,
		middleName,
	} = values;

	const generateSalt = await genSalt(environment.SALT);
	const hashedPassword = await hash(password, generateSalt);

	const newUser = await prisma.systemUser.create({
		data: {
			email,
			password: hashedPassword,
			firstName,
			lastName,
			birthDate: new Date(birthDate).toISOString(),
			role: "SUPER_ADMIN",
			address,
			phoneNumber,
			status: SystemUserStatus.VERIFIED,
			displayName,
			mfaEnabled,
			mfaSecret,
			middleName,
		},
	});

	if (!newUser) return null;

	return newUser;
};

export const updateSystemUser = async (
	toUpdateId: string,
	values: Partial<SystemUser>
) => {
	const {
		address,
		status,
		displayName,
		email,
		firstName,
		lastName,
		mfaEnabled,
		mfaSecret,
		birthDate,
		phoneNumber,
		middleName,
		role,
	} = values;

	const updatedUser = await prisma.systemUser.update({
		where: { id: toUpdateId },
		data: {
			email,
			firstName,
			lastName,
			birthDate,
			role,
			address,
			phoneNumber,
			status,
			displayName,
			mfaEnabled,
			mfaSecret,
			middleName,
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
		birthDate: user.birthDate.toISOString(),
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
		mfaEnabled: !!user.mfaEnabled,
		mfaSecret: user.mfaSecret || "",
	};
};

export async function readAllSystemUsers({
	filter,
	pagination,
	status,
}: PaginationArgs = {}): Promise<PaginationResult<SystemUser>> {
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

	console.log(status);

	if (status) {
		where = {
			...where,
			status: SystemUserStatus[status as SystemUserStatus],
		};
	} else
		[
			(where = {
				...where,
				status: {
					not: SystemUserStatus.DELETED,
				},
			}),
		];

	const users = await prisma.systemUser.findMany({
		where,
		take: pagination ? pagination.take : undefined,
		skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
	});

	const count = await prisma.systemUser.count({
		where,
	});

	const hasMore = pagination
		? pagination.page * pagination.take < count
		: false;

	return {
		data: users.map((user) => ({
			...user,
			birthDate: user.birthDate.toISOString(),
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString(),
			mfaEnabled: !!user.mfaEnabled,
			mfaSecret: user.mfaSecret || "",
			password: "",
		})),
		count: count,
		hasMore: hasMore,
	};
}
