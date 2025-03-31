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

export const formatDate = (date: string | number) => {
	return formatDateFns(
		new Date(isNaN(Number(date)) ? date : Number(date)),
		"MMMM dd, yyyy"
	);
};

export const formatEventDate = (startDate: string, endDate: string) => {
	const sameDay = isSameDay(new Date(startDate), new Date(endDate));

	const formattedStartDate = parseAbsoluteToLocal(startDate).toAbsoluteString();
	const formattedEndDate = parseAbsoluteToLocal(endDate).toAbsoluteString();

	const sameMonth = isSameMonth(new Date(startDate), new Date(endDate));

	const sameDateLabel = formatDateFns(
		parseAbsoluteToLocal(startDate).toAbsoluteString(),
		"MMM dd, yyyy"
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
