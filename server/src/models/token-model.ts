import { prisma } from "@/services/prisma.js";
import { Token } from "@/types/token.js";

export const createToken = async (email: string): Promise<Token> => {
	const generatedToken = Math.random()
		.toString(36)
		.substring(2)
		.toUpperCase()
		.substring(0, 4);

	const token = await prisma.token.create({
		data: {
			token: generatedToken,
			email,
			time: new Date(),
		},
	});

	return token;
};

export const readToken = async (email: string): Promise<Token | null> => {
	const token = await prisma.token.findUnique({ where: { email } });
	return token;
};
