import { gql } from "@apollo/client";

export const verifyTOTPMutation = gql`
	mutation ($secret: String!, $token: String!) {
		totp: verifyTOTP(secret: $secret, token: $token)
	}
`;
