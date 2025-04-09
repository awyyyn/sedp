import { gql } from "@apollo/client";

export const READ_STUDENT_NOTIFICATIONS_SUBSCRIPTION = gql`
	subscription ($scholarId: ID!) {
		notification: scholarNotificationSent(scholarId: $scholarId) {
			id
			read
			message
			title
			receiverId
			type
			link
			createdAt
		}
	}
`;

export const READ_ADMIN_NOTIFICATIONS_SUBSCRIPTION = gql`
	subscription AdminNotificationSent($role: SystemUserRole) {
		notification: adminNotificationSent(role: $role) {
			id
			read
			message
			title
			role
			type
			readerIds
			link
			createdAt
		}
	}
`;
