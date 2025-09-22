import { ROLE } from "@/contexts";
import { SystemUser, TransactionAction, TransactionEntity } from "@/types";

export const getFileExtension = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase();

  return ext;
};

export const imagesExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

export const semester = ["1st Semester", "2nd Semester", "3rd Semester"];

export const yearLevels = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthlyDocOptions = [
  "BOOK_ALLOWANCE",
  "MISCELLANEOUS_ALLOWANCE",
  "THESIS_ALLOWANCE",
];

export const roles: {
  SUPER_ADMIN: string;
  ADMIN_MANAGE_GATHERINGS: string;
  ADMIN_MANAGE_SCHOLAR: string;
  ADMIN_MANAGE_DOCUMENTS: string;
  ADMIN_VIEWER: string;
} = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_MANAGE_GATHERINGS: "Manage Gatherings",
  ADMIN_MANAGE_SCHOLAR: "Manage Scholar",
  ADMIN_MANAGE_DOCUMENTS: "Manage Documents",
  ADMIN_VIEWER: "Viewer",
};

export const Gatherings: ROLE[] = ["SUPER_ADMIN", "ADMIN_MANAGE_GATHERINGS"];
export const Documents: ROLE[] = ["SUPER_ADMIN", "ADMIN_MANAGE_DOCUMENTS"];
export const Scholars: ROLE[] = ["SUPER_ADMIN", "ADMIN_MANAGE_SCHOLAR"];

export const transactionActionsMap: Record<
  TransactionAction,
  string // or any custom type you want
> = {
  CREATE: "Create a new transaction",
  UPDATE: "Modify an existing transaction",
  DELETE: "Remove a transaction",
  GENERATE: "",
};

export const transactionMessages: Record<
  TransactionAction,
  Partial<Record<TransactionEntity, string>>
> = {
  [TransactionAction.CREATE]: {
    [TransactionEntity.STUDENT]: "Adds a scholar",
    [TransactionEntity.ALLOWANCE]: "Creates a new allowance record",
    [TransactionEntity.MEETING]: "Schedules a new meeting",
    [TransactionEntity.GATHERING]: "Organizes a gathering",
    [TransactionEntity.ANNOUNCEMENT]: "Publishes an announcement",
  },
  [TransactionAction.UPDATE]: {
    [TransactionEntity.STUDENT]: "Updates scholar information",
    [TransactionEntity.ALLOWANCE]: "Updates an allowance record",
    [TransactionEntity.MEETING]: "Reschedules or edits a meeting",
    [TransactionEntity.GATHERING]: "Updates gathering details",
    [TransactionEntity.ANNOUNCEMENT]: "Edits an announcement",
  },
  [TransactionAction.DELETE]: {
    [TransactionEntity.STUDENT]: "Removes a scholar",
    [TransactionEntity.ALLOWANCE]: "Deletes an allowance record",
    [TransactionEntity.MEETING]: "Cancels a meeting",
    [TransactionEntity.GATHERING]: "Cancels a gathering",
    [TransactionEntity.ANNOUNCEMENT]: "Deletes an announcement",
  },
  [TransactionAction.GENERATE]: {
    [TransactionEntity.ALLOWANCE]: "Generates allowance data",
    [TransactionEntity.STUDENT]: "Generates scholar-related report",
  },
};

export const getSystemUserStatusColorMap: Record<
  SystemUser["status"],
  "secondary" | "success" | "danger" | "warning"
> = {
  DELETED: "danger",
  PENDING: "secondary",
  UNVERIFIED: "warning",
  VERIFIED: "success",
};

export const getSystemUserRoleColorMap: Record<SystemUser["role"], string> = {
  ADMIN_MANAGE_DOCUMENTS: "#3B82F6", // blue - documents
  ADMIN_MANAGE_GATHERINGS: "#10B981", // green - gatherings
  ADMIN_MANAGE_SCHOLAR: "#F59E0B", // amber - scholars
  ADMIN_VIEWER: "#6B7280", // gray - read-only
  SUPER_ADMIN: "#EF4444", // red - highest privilege
};
