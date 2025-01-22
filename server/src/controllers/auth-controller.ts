import { Request, Response } from "express";
import speakeasy from "speakeasy";
import { generateToken, verifyToken } from "@app/services/jwt";
import { randomUUID } from "crypto";

export const authController = async (req: Request, res: Response) => {
	const { token } = req.body;
	try {
		const isValid = await speakeasy.totp.verify({
			secret: process.env.MY_SECRET!,
			encoding: "base32",
			token,
		});

		if (!isValid) {
			res.status(400).json({ message: "Invalid Token" });
			return;
		}

		const accessToken = generateToken(randomUUID());
		res.status(200).json({ accessToken });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const validateTokenController = async (req: Request, res: Response) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		res.status(400).json({ message: "Token is required" });
		return;
	}

	try {
		const isValid = verifyToken(token);

		if (!isValid) {
			res.status(400).json({ message: "Invalid Token" });
			return;
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
