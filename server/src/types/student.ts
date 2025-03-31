import { Gender } from "./index.js";
import { SystemUserAddress } from "./system-user.js";

export interface Student {
	readonly id: string;

	email: string;
	firstName: string;
	lastName: string;
	middleName: string | null;
	address: SystemUserAddress;
	password: string;
	gender: Gender;
	birthDate: string;
	mfaSecret: string | null;
	mfaEnabled: boolean;
	status: StudentStatus;
	phoneNumber: string;

	statusUpdatedAt: Date | null;

	yearLevel: number;
	schoolName: string;
	course: string;

	createdAt: Date;
	updatedAt: Date;
}

export type CreateScholarInput = Omit<
	Student,
	"id" | "createdAt" | "updatedAt" | "status"
>;

export type StudentStatus =
	| "REQUESTING"
	| "SCHOLAR"
	| "GRADUATED"
	| "DISQUALIFIED"
	| "ARCHIVED";

export type StudentUpdateArgs = Partial<
	Omit<Student, "createdAt" | "updatedAt">
> & { id: string };
