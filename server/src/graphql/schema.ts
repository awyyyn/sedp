import { gql } from "graphql-tag";

export const typeDefs = gql`
	type Query {
		generateTOTPSecret: GeneratedOTPResult
		systemUsers(
			filter: String
			pagination: PaginationInput
			status: String
		): SystemUsersResult
		systemUser(id: String!): SystemUser
		students(
			filter: String
			pagination: PaginationInput
			status: String
		): StudentsResult
		student(id: String!): Student
	}

	type Mutation {
		verifyTOTP(secret: String!, token: String!): Boolean
		updateSystemUser(values: updateSystemUserInput): SystemUser
		deleteSystemUser(id: String!): SystemUser
		sendSystemUserRegistrationEmail(
			email: String!
			role: SystemUserRole!
		): SendEmailResult
		sendStudentRegistrationEmail(email: String!): SendEmailResult
	}

	type SendEmailResult {
		message: String
	}

	input AddressInput {
		street: String
		city: String
	}

	type GeneratedOTPResult {
		secret: String!
		otpauthurl: String!
	}

	input updateSystemUserInput {
		id: String!
		email: String
		firstName: String
		lastName: String
		middleName: String
		displayName: String
		password: String
		mfaSecret: String
		phoneNumber: String
		birthDate: String
		mfaEnabled: Boolean
		address: AddressInput
		role: SystemUserRole
		status: SystemUserStatus
	}

	input PaginationInput {
		take: Int!
		page: Int!
	}

	type SystemUsersResult {
		data: [SystemUser]
		hasMore: Boolean
		count: Int
	}

	type StudentsResult {
		data: [SystemUser]
		hasMore: Boolean
		count: Int
	}

	type SystemUser {
		id: String
		email: String
		firstName: String
		lastName: String
		middleName: String
		displayName: String
		password: String
		mfaSecret: String
		phoneNumber: String
		birthDate: String
		mfaEnabled: Boolean
		address: Address
		role: SystemUserRole
		status: SystemUserStatus

		createdAt: String
		updatedAt: String
	}

	type Student {
		id: String
		studentId: String
		email: String
		firstName: String
		lastName: String
		middleName: String
		address: Address
		phoneNumber: String
		status: StudentStatus
		mfaSecret: String
		mfaEnabled: Boolean
		yearLevel: Int
		schoolName: String

		createdAt: String
		updatedAt: String
	}

	enum StudentStatus {
		REQUESTING
		SCHOLAR
		GRADUATED
		DISQUALIFIED
		ARCHIVED
	}

	type Address {
		street: String
		city: String
	}

	enum SystemUserRole {
		SUPER_ADMIN
		ADMIN
	}

	enum SystemUserStatus {
		VERIFIED
		UNVERIFIED
		DELETED
	}
`;
