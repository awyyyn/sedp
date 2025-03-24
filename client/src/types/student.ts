import { SystemUserAddress } from "./system-user.js";

import { Gender } from "./index.js";

export interface Student {
	readonly id: string;

	gender: Gender;
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
	course: string;
	statusUpdatedAt: string;

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
