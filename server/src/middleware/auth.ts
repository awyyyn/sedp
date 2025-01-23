import { verifyToken } from "../services/index.js";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	// Verify token
	const isValid = verifyToken(token);
	if (!isValid) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	next();
};
