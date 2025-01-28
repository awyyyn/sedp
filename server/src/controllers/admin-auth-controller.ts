import { Request, Response } from "express";
import {
	create as createSystemUser,
	read as readUser,
} from "@/models/index.js";
import { SystemUserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { environment } from "@/environments/environment.js";
import { generateAccessToken, generateRefreshToken } from "@/services/index.js";

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
		const user = await readUser(email);

		if (!user) {
			res.status(404).json({
				error: {
					code: 404,
					message: "User is not registered!",
				},
			});
			return;
		}

		if (user.status !== "VERIFIED") {
			res.status(401).json({
				error: {
					code: 401,
					message:
						"User is not verified, please contact admin to verify your account!",
				},
			});
			return;
		}

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

		res.status(200).json({
			data: {},
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
	const { password, email } = req.body;

	const salt = bcrypt.genSaltSync(environment.SALT);

	const hashedPassword = await bcrypt.hash(password, salt);

	try {
		const newUser = await createSystemUser({
			displayName: "",
			email,
			firstName: "",
			lastName: "",
			mfaEnabled: false,
			mfaSecret: "",
			password: hashedPassword,
			role: SystemUserRole.SUPER_ADMIN,
			address: {
				city: "",
				state: "",
				street: "",
				zip: 0,
			},
		});
		res.status(201).json({
			data: {},
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

export const forgotPasswordController = async (
	req: Request,
	res: Response
) => {};
