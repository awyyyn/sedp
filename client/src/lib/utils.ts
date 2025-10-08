import {
  format,
  formatDate as formatDateFns,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { SystemUserRole } from "../types/system-user.js";

import { TransactionAction, TransactionEntity } from "@/types/transaction.js";
import { transactionMessages } from "./constant.js";

export function generatePassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const specialChars = "@_-";
  const combinedCharset = charset + specialChars;
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * combinedCharset.length);

    password += combinedCharset[randomIndex];
  }

  return password;
}

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

export const formatDate = (date: string | number, format?: string) => {
  return formatDateFns(
    new Date(isNaN(Number(date)) ? date : Number(date)),
    format || "MMMM dd, yyyy",
  );
};

export const formatEventDate = (startDate: string, endDate: string) => {
  const sameDay = isSameDay(new Date(startDate), new Date(endDate));

  const formattedStartDate = parseAbsoluteToLocal(startDate).toAbsoluteString();
  const formattedEndDate = parseAbsoluteToLocal(endDate).toAbsoluteString();

  const sameMonth = isSameMonth(new Date(startDate), new Date(endDate));

  const sameDateLabel = formatDateFns(
    parseAbsoluteToLocal(startDate).toAbsoluteString(),
    "MMM dd, yyyy",
  );
  const sameMonthLabel = `${formatDateFns(formattedStartDate, "MMM dd")} - ${formatDateFns(formattedEndDate, "dd yyyy")}`;
  const twoOrMoreMonthLabel = `${formatDateFns(formattedStartDate, "MMM dd")} - ${formatDateFns(formattedEndDate, "MMM dd, yyyy")}`;

  return sameDay
    ? sameDateLabel
    : sameMonth
      ? sameMonthLabel
      : twoOrMoreMonthLabel;
};

export const formatEventTime = (startTime: string, endTime: string) => {
  const formattedStartTime = parseAbsoluteToLocal(startTime).toAbsoluteString();
  const formattedEndTime = parseAbsoluteToLocal(endTime).toAbsoluteString();

  return `${format(formattedStartTime, "hh:mm a")} - ${format(formattedEndTime, "hh:mm a")}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
};

export const getDocsTotalAmount = (
  data: { category: string; amount: number }[],
  type: "BOOK_ALLOWANCE" | "MISCELLANEOUS_ALLOWANCE",
) => {
  return data
    .filter((doc) => doc.category === type)
    .reduce((acc, doc) => acc + doc.amount, 0);
};

export const checkIfPreviousMonth = (
  selectedMonth: number,
  selectedYear: number,
) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Convert from 0-indexed to 1-indexed
  const currentYear = currentDate.getFullYear();

  if (selectedYear + 1 === currentYear) {
    return selectedMonth === 12 && currentMonth === 1;
  }

  // Check if the selected month and year match the previous month and year
  return selectedMonth === currentMonth - 1;
};

export const getYearLevelLabel = (yearLevel: number): string => {
  switch (yearLevel) {
    case 1:
      return "First Year";
    case 2:
      return "Second Year";
    case 3:
      return "Third Year";
    case 4:
      return "Fourth Year";
    case 5:
      return "Fifth Year";
    default:
      return "Unknown Year Level";
  }
};

export function getTransactionMessage(
  action: TransactionAction,
  entity: TransactionEntity,
): string {
  return transactionMessages[action]?.[entity] ?? "Performed a transaction";
}

export const getPercentage = (part: number, total: number) => {
  return total === 0 ? 0 : (part / total) * 100;
};
