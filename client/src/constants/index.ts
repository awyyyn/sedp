import {
  AdminNotificationType,
  ScholarNotificationType,
  TransactionAction,
} from "@/types";

export const years = [
  { label: "1st Year", value: 1 },
  { label: "2nd Year", value: 2 },
  { label: "3rd Year", value: 3 },
  { label: "4th Year", value: 4 },
  { label: "5th Year", value: 5, optional: true },
];

export const externalWebsite = [
  {
    title: "Official Website of Simbag sa Pag-asenso Inc. (SEDP)",
    url: "https://sedp.ph/",
    icon: "fluent-color:content-view-16",
  },
  {
    title:
      "SEDP provides micro-insurance to qualified members through the SEDP-MUTUAL Benefit Association (SEDP-MBA) ",
    url: "https://mba.sedp.ph/",
    // icon: "fluent-color:calendar-people-20",
    icon: "fluent-color:people-community-48",
  },
  {
    title:
      "The SEDP – Simbag sa Pag-Asenso Inc. is a development-oriented institution run by the Diocese of Legazpi.",
    url: "https://sedp.ph/about-us/",
    icon: "fluent-color:question-circle-48",
  },
  {
    title:
      "SEDP–Multi-Purpose Cooperative (SEDP-MPC) is the business development arm of the SEDP micro-finance.",
    url: "https://mpc.sedp.ph/",
    icon: "fluent-color:building-people-16",
  },
];

/*
type ScholarNotificationType =
	| "MEETING"
	| "EVENT"
	| "ANNOUNCEMENT"
	| "ALLOWANCE"
	| "SYSTEM_UPDATE"
	| "OTHER";
*/

export const notificationIconMap: Record<ScholarNotificationType, string> = {
  MEETING: "heroicons:calendar-20-solid",
  EVENT: "fluent-color:calendar-event-20",
  ANNOUNCEMENT: "heroicons:megaphone-20-solid",
  ALLOWANCE: "heroicons:banknotes-20-solid",
  SYSTEM_UPDATE: "heroicons:shield-check-20-solid",
  OTHER: "heroicons:information-circle-20-solid",
};

export const adminNotificationIconMap: Record<AdminNotificationType, string> = {
  MONTHLY_DOCUMENT: "heroicons:document-text-20-solid",
  SEMESTER_DOCUMENT: "heroicons:document-text-20-solid",
  OTHER: "heroicons:information-circle-20-solid",
};

export const TransactionEntityActionColorMap: Record<
  TransactionAction,
  "success" | "danger" | "default" | "warning" | "primary" | "secondary"
> = {
  APPROVE: "success",
  DISAPPROVE: "danger",
  UPDATE: "warning",
  CREATE: "primary",
  DELETE: "danger",
  BLOCK: "danger",
  UNBLOCK: "success",
};
