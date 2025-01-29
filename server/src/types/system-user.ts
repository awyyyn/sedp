export interface SystemUser {
	readonly id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: SystemUserRole;
	address: SystemUserAddress;
	displayName: string;
	mfaEnabled: boolean;
	mfaSecret: string;
	status: SystemUserStatus;
	createdAt?: string;
	updatedAt?: string;
}

export interface SystemUserAddress {
	city: string;
	zip: number;
	province: string;
	street: string;
}

export type SystemUserRole = "SUPER_ADMIN" | "ADMIN";

export type SystemUserStatus = "VERIFIED" | "UNVERIFIED" | "ARCHIVED";
