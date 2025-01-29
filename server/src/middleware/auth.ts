import { verifyToken } from "../services/index.js";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		res.status(401).json({ error: { message: "Unauthorized" } });
		return;
	}

	const data = verifyToken(token);

	if (!data) {
		res.status(401).json({ error: { message: "Unauthorized" } });
		return;
	}

	req.body = { ...req.body, ...data };

	next();
};
