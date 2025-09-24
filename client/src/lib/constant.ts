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

export const schools = [
  "CatSU  - Catanduanes State University (Virac)",
  "TCC  -Tiwi Community College",
  "BU TC -Bicol University Tabaco Campus",
  "BU CENG -Bicol University College of Engineering",
  "BU CAL - Bicol University College of Arts & Letters",
  "BU CE -Bicol University College of Education",
  "BU IDEA - Bicol University Institute of Design & Architecture",
  "BU CS -Bicol University College of Science",
  "BU IPESR",
  "BU CIT -Bicol University College of Industrial Technology",
  "BU CSSP -Bicol University College of Social Sciences & Philosophy",
  "BU CBEM -Bicol University College of Business, Economics & Management",
  "BU Daraga",
  "Daraga Community College",
  "BU GNBTN -Bicol University Guinobatan Campus",
  "BU CAF - Bicol University College of Agriculture & Forestry",
  "BU PC - Bicol University Polangui Campus",
  "Libon Community College",
  "Oas Community College",
  "CBSUA PILI -Central Bicol State University of Agriculture (Pili Campus)",
  "CBSUA- Central Bicol State University of Agriculture",
  "CBSUA Calabanga Campus",
  "CSPC NABUA -Camarines Sur Polytechnic Colleges Nabua Campus",
  "CSPC - Camarines Sur Polytechnic Colleges",
  "PSU GOA -Philippine State University Goa Campus (needs confirmation)",
  "Goa Community College",
  "CBSUA Sipocot Campus",
  "CBSUA Pasacao Campus",
  "Polytechnic University of the Philippines Ragay Campus",
  "BISCAST NAGA",
  "BISCAST",
  "ST. BENEDICT SEM -St. Benedict Seminary",
  "Donsol Community College",
  "Pilar Community College",
  "Sorsogon State University Castilla Campus",
  "Sorsogon State University Main Campus",
  "Sorsogon State University Bulan Campus",
  "Sorsogon State University Magallanes Campus",
  "LICEO DE MASBATE",
  "DEBESMSCAT  -Dr. Emilio B. Espinosa Sr. Memorial State College of Agriculture & Technology",
  "SAN PASCUAL POLYTECHNIC",
  "UEP - University of Eastern Philippines",
  "Baao Community College",
  "Camarines Norte State College",
  "Southern Luzon State University Tagkawayan Campus (Quezon)",
  "VERITAS COLLEGE",
  "San Jose Community College",
  "Rapu-Rapu Community College",
];

export const schoolOptions = schools.map((school) => ({
  key: school,
  label: school,
  description: school,
}));

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

export const headingClasses =
  "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";
