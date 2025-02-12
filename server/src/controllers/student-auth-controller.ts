import { Request, Response } from "express";
import {
	createStudent,
	readStudent,
	readToken,
	sendForgotPasswordOTP,
} from "../models/index.js";
import * as bcrypt from "bcrypt";
import {
	generateAccessToken,
	generateRefreshToken,
	prisma,
} from "../services/index.js";
import { environment } from "../environments/environment.js";

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
			id: student.id,
		};

		const accessToken = generateAccessToken({
			...payload,
			role: "STUDENT",
		});
		const refreshToken = generateRefreshToken({
			...payload,
			role: "STUDENT",
		});
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

export const studentRegisterController = async (
	req: Request,
	res: Response
) => {
	const {
		password,
		email,
		mfaSecret,
		firstName,
		lastName,
		city,
		street,
		phoneNumber,
		middleName,
		birthDate,
		schoolName,
		yearLevel,
	} = req.body;

	console.log(req.body);

	try {
		const newUser = await createStudent({
			email,
			firstName,
			lastName,
			mfaSecret,
			password,
			address: {
				city: city,
				street: street,
			},
			birthDate,
			middleName,
			phoneNumber,
			schoolName,
			// TODO: ADD STUDENT ID IN FRONTEND
			studentId: "",
			yearLevel: Number(yearLevel),
		});

		if (!newUser) {
			res.status(400).json({
				error: {
					code: 400,
					message: "Failed to create scholar account",
				},
			});
			return;
		}

		res.status(201).json({
			data: newUser,
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

		const token = await readToken(email);

		if (token !== null) {
			res.status(400).json({
				error: {
					code: 400,
					message:
						"Token is already sent, please check your spam folder! You can request a new OTP after 5 minutes.",
				},
			});
			return;
		}

		await sendForgotPasswordOTP(email);

		res.status(200).json({
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

export const studentVerifyTokenController = async (
	req: Request,
	res: Response
) => {
	try {
		const { token, email } = req.body;

		const user = await readStudent(email);

		if (!user) {
			res.status(400).json({
				error: {
					code: 400,
					message: "UnAuthorized!",
				},
			});
			return;
		}

		const storedToken = await readToken(email);

		if (storedToken === null) {
			res.status(400).json({
				error: {
					code: 400,
					message: "Token is expired!",
				},
			});
			return;
		}

		if (token !== storedToken?.token) {
			res.status(400).json({
				error: {
					code: 400,
					message: "OTP doesn't match!",
				},
			});
			return;
		}

		const passwordAccessToken = await generateAccessToken({
			email: user.email,
			role: "STUDENT",
			id: user.id,
		});
		res.status(200).json({
			data: {
				passwordAccessToken,
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

export const studentResetPasswordController = async (
	req: Request,
	res: Response
) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({
			error: {
				code: 400,
				message: "Email and password are required!",
			},
		});
		return;
	}

	try {
		const user = await prisma.student.findUnique({ where: { email } });

		if (!user) {
			res.status(404).json({
				error: {
					code: 404,
					message: "User is not registered",
				},
			});
			return;
		}

		const generatedSALT = await bcrypt.genSalt(environment.SALT);
		const hashedPassword = await bcrypt.hash(password, generatedSALT);

		console.log(hashedPassword);

		const updatedUser = await prisma.systemUser.update({
			where: { id: user.id },
			data: { password: hashedPassword },
		});

		if (!updatedUser) {
			res.status(400).json({
				code: 400,
				message: "Something went wrong while updating your password!",
			});
			return;
		}

		res.status(200).json({
			data: {
				message: "Password reset!",
			},
		});
	} catch (error) {
		res.status(500).json({
			error: {
				code: 500,
				message: "Internal Server Error!",
			},
		});
	}
};
