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
