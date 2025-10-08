import { Allowance } from "./allowance";
import { Announcement } from "./announcement";
import { Event } from "./event";
import { MonthlyLateSubmitter } from "./late-submission";
import { Meeting } from "./meeting";
import { Student } from "./student";
import { SystemUser } from "./system-user";

export type Transaction = {
  id: string;
  action: TransactionAction;
  entity: TransactionEntity;
  entityId: string;
  description: string;
  transactedById: string;
  transactedBy: SystemUser;
  student?: Student;
  allowance?: Allowance;
  meeting?: Meeting;
  event?: Event;
  announcement?: Announcement;
  lateSubmission?: MonthlyLateSubmitter;
  createdAt: string;
};

export const TransactionAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  APPROVE: "APPROVE",
  DISAPPROVE: "DISAPPROVE",
  BLOCK: "BLOCK",
  UNBLOCK: "UNBLOCK",
} as const;

export type TransactionAction =
  (typeof TransactionAction)[keyof typeof TransactionAction];

export const TransactionEntity = {
  STUDENT: "STUDENT",
  ALLOWANCE: "ALLOWANCE",
  MEETING: "MEETING",
  EVENT: "EVENT",
  ANNOUNCEMENT: "ANNOUNCEMENT",
  LATE_SUBMISSION: "LATE_SUBMISSION",
} as const;

export type TransactionEntity =
  (typeof TransactionEntity)[keyof typeof TransactionEntity];
