export interface SystemUser {
	readonly id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	middleName: string | null;
	role: SystemUserRole;
	address: SystemUserAddress;
	birthDate: string;
	displayName: string;
	phoneNumber: string;
	mfaEnabled: boolean;
	mfaSecret: string;
	status: SystemUserStatus;
	createdAt?: string;
	updatedAt?: string;
}

export interface SystemUserAddress {
	city: string;
	street: string;
}

export type SystemUserRole = "SUPER_ADMIN" | "ADMIN";

export type SystemUserStatus = "VERIFIED" | "UNVERIFIED" | "DELETED";

export interface Pagination {
	skip: number;
	take: number;
}

export interface PaginationArgs {
	filter?: string;
	pagination?: {
		page: number;
		take: number;
	};
}

export type SystemUserUpdateArgs = Partial<
	Omit<SystemUser, "id" | "createdAt" | "updatedAt">
> & { id: string };

export interface PaginationResult<T> {
	data: T;
	count: number;
	hasMore: boolean;
}
