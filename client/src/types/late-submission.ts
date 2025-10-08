import { Student } from "./student";
import { SystemUser } from "./system-user";

export type MonthlyLateSubmitter = {
  id: string;
  month: number;
  year: number;
  reason: string;
  studentId: string;
  student: Student;
  updatedById?: string;
  updatedBy?: SystemUser;
  updatedOn?: string;
  isApproved?: boolean;

  openUntil?: string;
  createdAt: string;
};
