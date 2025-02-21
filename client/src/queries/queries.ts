import { gql } from "@apollo/client";

import { systemUsersFragment } from "./fragments";

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

export const systemUserQuery = gql`
	${systemUsersFragment}
	query SystemUser($id: String!) {
		systemUser(id: $id) {
			...SystemUserFragment
		}
	}
`;
