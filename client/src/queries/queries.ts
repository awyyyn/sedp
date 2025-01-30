import { gql } from "@apollo/client";

export const generateTOTPQuery = gql`
	query {
		totp: generateTOTPSecret {
			secret
			otpauthurl
		}
	}
`;
