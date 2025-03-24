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
