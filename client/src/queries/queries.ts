import { gql } from "@apollo/client";

import { studentsFragment, systemUsersFragment } from "./fragments";

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

export const READ_STUDENTS_QUERY = gql`
	${studentsFragment}
	query ($status: String, $pagination: PaginationInput, $filter: String) {
		students(status: $status, pagination: $pagination, filter: $filter) {
			data {
				...StudentFragment
			}
			count
			hasMore
		}
	}
`;

export const READ_ANNOUNCEMENTS_QUERY = gql`
	${systemUsersFragment}
	query ($filter: String, $pagination: PaginationInput) {
		announcements(filter: $filter, pagination: $pagination) {
			data {
				id
				content
				title
				createdAt
				createdBy {
					...SystemUserFragment
				}
			}
			hasMore
			count
		}
	}
`;

export const READ_ANNOUNCEMENT_QUERY = gql`
	${systemUsersFragment}
	query ($id: String!) {
		announcement(id: $id) {
			id
			content
			title
			createdAt
			createdBy {
				...SystemUserFragment
			}
		}
	}
`;

export const READ_STUDENT_QUERY = gql`
	${studentsFragment}
	query ($id: String!) {
		student(id: $id) {
			...StudentFragment
		}
	}
`;
