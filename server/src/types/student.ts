import { SystemUserAddress } from "./system-user.js";

export interface Student {
	readonly id: string;
	email: string;
	firstName: string;
	lastName: string;
	middleName: string | null;
	address: SystemUserAddress;
	password: string;
	birthDate: Date;
	mfaSecret: string | null;
	mfaEnabled: boolean;
	schoolYear: string;
	schoolName: string;

	createdAt: Date;
	updatedAt: Date;
}
