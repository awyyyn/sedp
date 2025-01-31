import { Request, Response } from "express";
import { readStudent, sendForgotPasswordOTP } from "@/models/index.js";
import * as bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/services/index.js";

export const studentLoginController = async (req: Request, res: Response) => {
	const { password, email } = req.body;

	if (!password || !email) {
		res.status(400).json({
			error: {
				code: 400,
				message: "Email and password are required",
			},
		});
		return;
	}

	try {
		const student = await readStudent(email);

		if (!student) {
			res.status(404).json({
				error: {
					code: 404,
					message: "User is not registered!",
				},
			});
			return;
		}

		const isPasswordValid = await bcrypt.compare(password, student.password);

		if (!isPasswordValid) {
			res.status(401).json({
				error: {
					code: 401,
					message: "Invalid password",
				},
			});
			return;
		}

		const payload = {
			email: student.email,
			role: "STUDENT",
			id: student.id,
		};

		const accessToken = generateAccessToken(payload);
		const refreshToken = generateRefreshToken(payload);
		const { password: removePassword, ...userData } = student;

		res.status(200).json({
			data: {
				accessToken,
				refreshToken,
				user: userData,
			},
			error: null,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: {
				code: 500,
				message: "Internal server error",
			},
		});
	}
};

// TODO: FIX THIS
// export const adminRegisterController = async (req: Request, res: Response) => {
// 	const { password, email } = req.body;

// 	const salt = bcrypt.genSaltSync(environment.SALT);

// 	const hashedPassword = await bcrypt.hash(password, salt);

// 	try {
// 		const newUser = await createSystemUser({
// 			displayName: "",
// 			email,
// 			firstName: "",
// 			lastName: "",
// 			mfaEnabled: false,
// 			mfaSecret: "",
// 			password: hashedPassword,
// 			role: SystemUserRole.SUPER_ADMIN,
// 			address: {
// 				brgy: "",
// 				city: "",
// 				street: "",
// 				zip: 0,
// 			},
// 		});
// 		res.status(201).json({
// 			data: {},
// 			error: null,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({
// 			error: {
// 				code: 500,
// 				message: "Internal server error",
// 			},
// 		});
// 	}
// };

export const studentForgotPasswordController = async (
	req: Request,
	res: Response
) => {
	const { email } = req.body;

	if (!email) {
		res.status(400).json({
			error: {
				code: 400,
				message: "Email is required!",
			},
		});
		return;
	}

	try {
		const user = await readStudent(email);

		if (!user) {
			res.status(404).json({
				error: {
					code: 400,
					message: "User is not registered!",
				},
			});
			return;
		}

		await sendForgotPasswordOTP(email);

		await res.status(200).json({
			data: {
				message: "Reset password link is sent to your email.",
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: {
				code: 500,
				message: "Internal Server Error!",
			},
		});
	}
};
