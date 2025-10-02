import { Student } from "./student";

export interface Allowance {
  readonly id: string;
  studentId: string;

  year: number;
  month: number;
  semester: number;
  monthlyAllowance: number;
  bookAllowance: number;
  miscellaneousAllowance: number;
  thesisAllowance: number;
  claimed: boolean;
  claimedAt: string | null;
  yearLevel: number;
  totalAmount: number;
  student: Student;

  createdAt: string;
  updatedAt: string;
}

export type AllowanceWithStudent = Allowance & {
  student: Student;
};
