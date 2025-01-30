import {
	twoFactorAuthResolver,
	verifyTOTPResolver,
} from "./resolvers/index.js";

export const resolvers = {
	Query: {
		hello: () => "Hello, world 2!",
		generateTOTPSecret: twoFactorAuthResolver,
	},
	Mutation: {
		// Verify OTP
		verifyTOTP: verifyTOTPResolver,
	},
};
