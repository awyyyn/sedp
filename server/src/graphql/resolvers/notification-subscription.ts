import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../../services/pubsub.js";

export const scholarNotificationSubscription = {
	subscribe: withFilter(
		() => pubsub.asyncIterableIterator(["SCHOLAR_NOTIFICATION_SENT"]),
		(payload: any, variables: any) => {
			return payload.scholarNotificationSent.receiverId === variables.scholarId;
		}
	),
};

export const adminNotificationSubscription = {
	subscribe: withFilter(
		() => pubsub.asyncIterableIterator(["ADMIN_NOTIFICATION_SENT"]),
		(payload: any, variables: any) => {
			console.log(`PAYLOAD:`, payload);
			console.log(`VARIABLES:`, variables);

			// return (
			// 	payload.notificationSent.role === variables.role ||
			// 	variables.role === "SUPER_ADMIN"
			// );

			return true;
		}
	),
};
