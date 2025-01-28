import jwt from "jsonwebtoken";

interface Payload {
	id: string;
	email: string;
	role?: string;
}

export const generateAccessToken = (payload: Payload) => {
	const secret = process.env.ACCESS_SECRET;
	return jwt.sign(payload, secret!, {
		expiresIn: "2h",
	});
};

export const generateRefreshToken = (payload: Payload) => {
	const secret = process.env.REFRESH_SECRET;
	return jwt.sign(payload, secret!, {
		expiresIn: "2h",
	});
};

export const verifyToken = (token: string) => {
	try {
		jwt.verify(token, process.env.ACCESS_SECRET!);
		return true;
	} catch (error) {
		return false;
	}
};
