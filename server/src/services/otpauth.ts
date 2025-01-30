import speakeasy from "speakeasy";

export const generateTOTPSecret = async () => {
	const secret = speakeasy.generateSecret({
		issuer: "SEDP - MFA",
		name: "Email Placeholder",
		length: 20,
		otpauth_url: true,
	});

	return {
		secret: secret.base32,
		otpauthurl: secret.otpauth_url,
	};
};

export const verifyTOTP = async (secret: string, token: string) => {
	const isVerified = speakeasy.totp.verify({
		secret: secret,
		token: token,
		encoding: "base32",
	});

	return isVerified;
};
