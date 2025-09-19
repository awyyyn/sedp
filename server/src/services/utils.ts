import { SystemUserRole } from "../types/system-user.js";
import { TransactionAction, TransactionEntity } from "@prisma/client";

export function getRoleDescription(role: SystemUserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Full Access";
    case "ADMIN_MANAGE_SCHOLAR":
      return "Scholar Management";
    case "ADMIN_MANAGE_GATHERINGS":
      return "Event & Gathering Management";
    case "ADMIN_MANAGE_DOCUMENTS":
      return "Document Management";
    case "ADMIN_VIEWER":
      return "View Only Access";
    default:
      return "Unknown Role";
  }
}

interface GenerateTransactionDescriptionOptions {
  action: TransactionAction;
  entity: TransactionEntity;
  performedBy: string; // name or email of the user
  targetName?: string; // e.g. student name, meeting title
  extra?: string; // e.g. "March 2025", "ID: 1234"
}

export function generateTransactionDescription({
  action,
  entity,
  performedBy,
  targetName,
  extra,
}: GenerateTransactionDescriptionOptions): string {
  const actionMap: Record<TransactionAction, string> = {
    CREATE: "created",
    UPDATE: "updated",
    DELETE: "deleted",
    GENERATE: "generated",
  };

  const entityMap: Record<TransactionEntity, string> = {
    STUDENT: "scholar",
    ALLOWANCE: "allowance",
    MEETING: "meeting",
    GATHERING: "gathering",
    ANNOUNCEMENT: "announcement",
  };

  const actionText = actionMap[action];
  const entityText = entityMap[entity];

  let description = `${performedBy} ${actionText} ${entityText}`;
  if (targetName) description += `: ${targetName}`;
  if (extra) description += ` (${extra})`;

  return description;
}
