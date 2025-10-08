import { SystemUserAddress } from "./system-user.js";

import { Document, Gender } from "./index.js";

export interface Student {
  readonly id: string;

  gender: Gender;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  office: string;
  address: SystemUserAddress;
  password: string;
  birthDate: string;
  mfaSecret: string | null;
  mfaEnabled: boolean;
  status: StudentStatus;
  phoneNumber: string;
  documents?: Document[];

  yearLevel: number;
  schoolName: string;
  course: string;
  semester: number;
  yearLevelJoined: number;
  statusUpdatedAt: string;

  createdAt: string;
  updatedAt: string;
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
