import jwt, { JwtPayload } from "jsonwebtoken";

interface PayloadArgs {
	id: string;
	email: string;
	role?: string;
}

type JWTPayload = PayloadArgs & JwtPayload;

export const generateAccessToken = (payload: PayloadArgs) => {
	const secret = process.env.ACCESS_SECRET;
	return jwt.sign(payload, secret!, {
		expiresIn: "2h",
	});
};

export const generateRefreshToken = (payload: PayloadArgs) => {
	const secret = process.env.REFRESH_SECRET;
	return jwt.sign(payload, secret!, {
		expiresIn: "2h",
	});
};

export const verifyToken = (token: string): JWTPayload | null => {
	try {
		const decoded = <JWTPayload>jwt.verify(token, process.env.ACCESS_SECRET!);
		return decoded;
		// return decoded;
	} catch (error) {
		return null;
	}
};
