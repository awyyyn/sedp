import { generateTOTPSecret, verifyTOTP } from "@/services/otpauth.js";
import { GraphQLError } from "graphql";

export const twoFactorAuthResolver = async () => {
	const secret = await generateTOTPSecret();

	if (!secret) {
		throw new GraphQLError("Failed to generate TOTP secret");
	}

	return secret;
};

export const verifyTOTPResolver = async (
	_: never,
	{ secret, token }: { secret: string; token: string }
) => {
	const isVerified = await verifyTOTP(secret, token);

	console.log(isVerified);

	return isVerified;
};
