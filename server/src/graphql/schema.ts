import { gql } from "graphql-tag";

export const typeDefs = gql`
	type Query {
		hello: String!
		generateTOTPSecret: GeneratedOTPResult
	}

	type Mutation {
		verifyTOTP(secret: String!, token: String!): Boolean
	}

	type GeneratedOTPResult {
		secret: String!
		otpauthurl: String!
	}
`;
