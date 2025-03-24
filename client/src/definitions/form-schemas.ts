import * as yup from "yup";

export const addScholarSchema = yup.object({
	firstName: yup.string().required("First name is required."),
	// studentId: yup.string().required(),
	middleName: yup.string().optional(),
	lastName: yup.string().required("Last name is required."),
	street: yup.string().required("Street is required."),
	city: yup.string().required("City is required."),
	schoolName: yup.string().required("School name is required."),
	email: yup.string().required("Email is required."),
	gender: yup.string().required("Gender is required."),
	birthDate: yup.date().required("Birth date is required."),
	password: yup.string().required("Password is required."),
	// yearLevel: yup.number().min(1).max(5).required("Year level is required."),
	yearLevel: yup.string().required("Year Level is required!."),
	course: yup.string().required("Course is required."),
	phoneNumber: yup
		.string()
		.matches(
			/^[9]\d{9}$/,
			"Contact number must start with 9 and be 10 digits long, containing only digits"
		)
		.required("Contact number is required."),
});

export const addAdminSchema = yup.object({
	firstName: yup.string().required("First name is required."),
	middleName: yup.string().optional(),
	lastName: yup.string().required("Last name is required."),
	street: yup.string().required("Street is required."),
	city: yup.string().required("City is required."),
	gender: yup.string().required("Gender is required."),
	email: yup.string().required("Email is required.").email("Email is invalid"),
	password: yup.string().required("Password is required."),
	role: yup
		.mixed()
		.oneOf([
			"SUPER_ADMIN",
			"ADMIN_MANAGE_SCHOLAR",
			"ADMIN_MANAGE_GATHERINGS",
			"ADMIN_MANAGE_DOCUMENTS",
			"ADMIN_VIEWER",
		])
		.required("Role is required."),
	birthDate: yup.date().required("Birth date is required."),
	phoneNumber: yup
		.string()
		.matches(
			/^[9]\d{9}$/,
			"Contact number must start with 9 and be 10 digits long, containing only digits"
		)
		.required("Contact number is required."),
});

export const AddAnnouncementSchema = yup.object({
	title: yup.string().required("Title is required!"),
	content: yup.string().required("Content is required"),
});
