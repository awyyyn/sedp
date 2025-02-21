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

export const studentsFragment = gql`
	fragment StudentFragment on Student {
		id
		studentId
		email
		firstName
		lastName
		middleName
		address {
			city
			street
		}
		phoneNumber
		status
		mfaSecret
		mfaEnabled
		birthDate
		yearLevel
		schoolName
		createdAt
		updatedAt
	}
`;
