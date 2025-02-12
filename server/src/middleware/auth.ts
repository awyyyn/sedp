import { prisma, verifyToken } from "../services/index.js";
import { NextFunction, Request, Response } from "express";
import { GraphQLError } from "graphql";
import { AppContext } from "../types/index.js";

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

export const contextMiddleware = async ({
	req,
}: {
	req: Request;
}): Promise<AppContext> => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		throw new GraphQLError("UnAuthorized");
	}

	const data = verifyToken(token);

	if (!data) {
		throw new GraphQLError("UnAuthorized");
	}

	return { id: data.id, email: data.email, prisma, role: data.role };
};
