import { generateTOTPSecret, verifyTOTP } from "../../services/otpauth.js";
import { GraphQLError } from "graphql";

export const twoFactorAuthResolver = async () => {
	try {
		const secret = await generateTOTPSecret();

		if (!secret) {
			throw new GraphQLError("Failed to generate TOTP secret");
		}

		return secret;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};

export const verifyTOTPResolver = async (
	_: never,
	{ secret, token }: { secret: string; token: string }
) => {
	try {
		const isVerified = await verifyTOTP(secret, token);

		console.log(isVerified);

		return isVerified;
	} catch {
		throw new GraphQLError("Internal Server Error!");
	}
};
