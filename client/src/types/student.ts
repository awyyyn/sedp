import { SystemUserAddress } from "./system-user.js";

export interface Student {
	readonly id: string;
	studentId: string;
	email: string;
	firstName: string;
	lastName: string;
	middleName: string | null;
	address: SystemUserAddress;
	password: string;
	birthDate: Date;
	mfaSecret: string | null;
	mfaEnabled: boolean;
	status: StudentStatus;
	phoneNumber: string;

	yearLevel: number;
	schoolName: string;

	createdAt: Date;
	updatedAt: Date;
}

export type StudentStatus =
	| "REQUESTING"
	| "SCHOLAR"
	| "GRADUATED"
	| "DISQUALIFIED"
	| "ARCHIVED";

export type StudentUpdateArgs = Partial<
	Omit<Student, "id" | "createdAt" | "updatedAt">
> & { id: string };
