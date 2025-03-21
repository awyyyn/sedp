import * as yup from "yup";

export const addScholarSchema = yup.object({
	firstName: yup.string().required(),
	// studentId: yup.string().required(),
	middleName: yup.string().optional(),
	lastName: yup.string().required(),
	street: yup.string().required(),
	city: yup.string().required(),
	schoolName: yup.string().required(),
	email: yup.string().required(),
	password: yup.string().required(),
	yearLevel: yup.number().min(1).max(5).required(),
	contact: yup
		.string()
		.matches(
			/^[9]\d{9}$/,
			"Contact number must start with 9 and be 10 digits long, containing only digits"
		)
		.required(),
});
