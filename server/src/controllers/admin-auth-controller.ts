import { Request, Response } from "express";
import {
	createSystemUser,
	readStudent,
	readSystemUser,
	readToken,
	sendForgotPasswordOTP,
} from "../models/index.js";
import * as bcrypt from "bcrypt";
import {
	generateAccessToken,
	generateRefreshToken,
	PayloadArgs,
	prisma,
} from "..//services/index.js";
import { SystemUserRole } from "@prisma/client";
import { environment } from "../environments/environment.js";

export const adminLoginController = async (req: Request, res: Response) => {
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
		const user = await readSystemUser(email);

		if (!user) {
			res.status(404).json({
				error: {
					code: 404,
					message: "User is not registered!",
				},
			});
			return;
		}

		// if (user.status !== "VERIFIED") {
		// 	res.status(401).json({
		// 		error: {
		// 			code: 401,
		// 			message:
		// 				"User is not verified, please contact admin to verify your account!",
		// 		},
		// 	});
		// 	return;
		// }

		const isPasswordValid = await bcrypt.compare(password, user.password);

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
			email: user.email,
			role: user.role,
			id: user.id,
		};

		const accessToken = generateAccessToken(payload);
		const refreshToken = generateRefreshToken(payload);
		const { password: removePassword, ...userData } = user;

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

export const adminRegisterController = async (req: Request, res: Response) => {
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
		role,
	} = req.body;

	try {
		const newUser = await createSystemUser({
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
			mfaEnabled: !!mfaSecret,
			middleName,
			gender: "FEMALE",
			phoneNumber,
			role: role ?? SystemUserRole.ADMIN_VIEWER,
		});

		if (!newUser) {
			res.status(400).json({
				error: {
					code: 400,
					message: "Failed to create system user",
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

export const adminForgotPasswordController = async (
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
		const user = await readSystemUser(email);

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

export const adminVerifyTokenController = async (
	req: Request,
	res: Response
) => {
	try {
		const { token, email } = req.body;

		const user = await readSystemUser(email);

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
			role: user.role,
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

export const adminResetPasswordController = async (
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
		const user = await prisma.systemUser.findUnique({ where: { email } });

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

export const userProfileController = async (req: Request, res: Response) => {
	const { role, id } = req.body;
	try {
		let user;
		let userRole: PayloadArgs["role"] = "STUDENT";
		if (role === "STUDENT") {
			user = await readStudent(id);
			userRole = "STUDENT";
		} else {
			user = await readSystemUser(id);
			userRole = user?.role as SystemUserRole;
		}

		if (!user) throw new Error("INTERNAL_SERVER_ERROR");

		const accessToken = await generateAccessToken({
			email: user.email,
			id: user.id,
			role: userRole,
		});

		const refreshToken = await generateRefreshToken({
			email: user.email,
			id: user.id,
			role: userRole,
		});

		res.status(200).json({
			data: {
				accessToken,
				refreshToken,
				user: {
					...user,
					role: userRole,
				},
			},
			error: null,
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
