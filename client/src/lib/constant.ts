import { ROLE } from "@/contexts";

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
