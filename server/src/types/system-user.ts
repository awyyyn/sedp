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

export type SystemUserStatus = "VERIFIED" | "UNVERIFIED" | "ARCHIVED";
