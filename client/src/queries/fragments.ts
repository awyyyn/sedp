import { gql } from "@apollo/client";

export const systemUsersFragment = gql`
	fragment SystemUserFragment on SystemUser {
		id
		email
		firstName
		lastName
		middleName
		gender
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
		email
		firstName
		lastName
		gender
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
		statusUpdatedAt
		createdAt
		updatedAt
	}
`;
