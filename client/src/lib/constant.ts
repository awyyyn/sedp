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
