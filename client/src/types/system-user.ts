import { Gender } from "./index.js";

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
	phoneNumber: string;
	mfaEnabled: boolean;
	gender: Gender;
	mfaSecret: string | null;
	status: SystemUserStatus;
	verifiedAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface SystemUserAddress {
	city: string;
	street: string;
}

export type SystemUserRole =
	| "SUPER_ADMIN"
	| "ADMIN_MANAGE_SCHOLAR"
	| "ADMIN_MANAGE_GATHERINGS"
	| "ADMIN_MANAGE_DOCUMENTS"
	| "ADMIN_VIEWER";

export type SystemUserStatus =
	| "VERIFIED"
	| "UNVERIFIED"
	| "DELETED"
	| "PENDING";

export interface Pagination {
	skip: number;
	take: number;
}
