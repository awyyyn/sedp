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
