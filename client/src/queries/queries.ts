import { gql } from "@apollo/client";

export const systemUsersFragment = gql`
	fragment SystemUserFragment on SystemUser {
		id
		email
		firstName
		lastName
		middleName
		displayName
		password
		mfaSecret
		phoneNumber
		birthDate
		mfaEnabled
		address {
			city
			street
		}
		role
		status

		createdAt
		updatedAt
	}
`;

export const generateTOTPQuery = gql`
	query {
		totp: generateTOTPSecret {
			secret
			otpauthurl
		}
	}
`;

export const systemUsersQuery = gql`
	${systemUsersFragment}
	query ($filter: String, $pagination: PaginationInput) {
		systemUsers(filter: $filter, pagination: $pagination) {
			data {
				...SystemUserFragment
			}
			hasMore
			count
		}
	}
`;
