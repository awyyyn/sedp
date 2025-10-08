import { SystemUserRole } from "../types/system-user.js";
import {
  SystemUser,
  TransactionAction,
  TransactionEntity,
} from "@prisma/client";

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
// Transaction descriptions
const descriptions: Record<string, string> = {
  // CREATE
  CREATE_ALLOWANCE: "generated a new allowance for scholar disbursement",
  CREATE_STUDENT: "added a new scholar to the system",
  CREATE_MEETING: "scheduled a new meeting",
  CREATE_EVENT: "created a new event",
  CREATE_ANNOUNCEMENT: "published a new announcement",

  // UPDATE
  UPDATE_STUDENT: "updated scholar academic information",
  UPDATE_MEETING: "updated meeting details",
  UPDATE_EVENT: "updated event information",
  UPDATE_ANNOUNCEMENT: "updated announcement content",
  UPDATE_ALLOWANCE: "marked allowance as claimed",

  // DELETE
  DELETE_EVENT: "deleted an event",
  DELETE_MEETING: "deleted a meeting",
  DELETE_ANNOUNCEMENT: "deleted an announcement",

  // APPROVE
  APPROVE_LATE_SUBMISSION: "approved late submission request",

  // DISAPPROVE
  DISAPPROVE_LATE_SUBMISSION: "rejected late submission request",

  // BLOCK
  BLOCK_STUDENT: "blocked scholar account",

  // UNBLOCK
  UNBLOCK_STUDENT: "unblocked scholar account",
};

/**
 * Generate transaction description for database storage
 */
export function generateTransactionDescription(
  action: TransactionAction,
  entity: TransactionEntity,
  user: SystemUser,
): string {
  const key = `${action}_${entity}`;
  const description = descriptions[key];

  if (!description) {
    return `${getUserName(user)} performed ${action.toLowerCase()} on ${entity.toLowerCase()}`;
  }

  return `${getUserName(user)} ${description}`;
}

function getUserName(user: SystemUser): string {
  return (
    `${user.firstName} ${user.lastName}` ||
    user.email ||
    `User ${user.id.slice(-4)}`
  );
}

export const offices = {
  Albay: [
    "Tiwi",
    "Malinao",
    "Tabaco",
    "Malilipot",
    "Bacacay I",
    "Bacacay II",
    "Rapu-Rapu",
    "Legazpi Port",
    "Albay District",
    "Manito",
    "Anislag (Daraga area)",
    "Daraga",
    "Camalig",
    "Ligao",
    "Pioduran",
    "Polangui",
    "Libon",
  ],
  "Camarines Sur": [
    "Nabua",
    "Baao",
    "Pili",
    "Goa",
    "Pasacao",
    "Libmanan",
    "Sipocot",
  ],
  Sorsogon: ["Pilar", "Castilla", "Sorsogon City", "Irosin", "Bulan"],
  Masbate: ["Aroroy", "Masbate City"],
  Catanduanes: ["Virac", "Batan"],
  "Northern Samar": ["Catarman"],
  "Cagayan (Region II)": ["Claveria"],
  "Other Offices": ["Diocesan Subsidy", "Pre-Diaconal"],
};

export const officesOptions = Object.entries(offices).map(
  ([province, locations]) => ({
    province,
    offices: locations,
  }),
);
