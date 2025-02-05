import { gql } from "@apollo/client";

export const verifyTOTPMutation = gql`
	mutation ($secret: String!, $token: String!) {
		totp: verifyTOTP(secret: $secret, token: $token)
	}
`;

export const sendSystemUserRegistrationMutation = gql`
	mutation SendSystemUserRegistrationEmail(
		$email: String!
		$role: SystemUserRole!
	) {
		sendRegistration: sendSystemUserRegistrationEmail(
			email: $email
			role: $role
		) {
			message
		}
	}
`;

export const deleteSystemUserMutation = gql`
	mutation DeleteSystemUser($id: String!) {
		deleteSystemUser(id: $id) {
			id
		}
	}
`;
