import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
	split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const httpLink = createHttpLink({
	uri: import.meta.env.VITE_GQL_API_URL!,
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("accessToken");

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const wsLink = new GraphQLWsLink(
	createClient({
		url: import.meta.env.VITE_GQL_API_URL!,
	})
);

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);

		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	httpLink
);

export const client = new ApolloClient({
	link: authLink.concat(splitLink),
	cache: new InMemoryCache(),
});
