import { formatDate as formatDateFns } from "date-fns";

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

import { SystemUserRole } from "../types/system-user.js";

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
