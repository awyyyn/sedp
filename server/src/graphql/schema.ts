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
		announcements(
			filter: String
			pagination: PaginationInput
		): AnnouncementsResult
		announcement(id: String): Announcement
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
		updateStudent(
			id: String!
			studentId: String
			firstName: String
			lastName: String
			middleName: String
			city: String
			street: String
			phoneNumber: String
			birthDate: String
			status: StudentStatus
			mfaSecret: String
			mfaEnabled: Boolean
			yearLevel: Int
			schoolName: String
		): Student
		createSystemUser(
			firstName: String!
			middleName: String
			lastName: String!
			address: AddressInput!
			email: String!
			gender: Gender!
			password: String!
			role: SystemUserRole!
			birthDate: String!
			phoneNumber: String!
		): SystemUser
		createStudent(
			firstName: String!
			middleName: String
			lastName: String!
			address: AddressInput!
			email: String!
			course: String!
			yearLevel: Int!
			schoolName: String!
			gender: Gender!
			password: String!
			birthDate: String!
			phoneNumber: String!
		): Student
		createAnnouncement(title: String!, content: String!): Announcement
		updateAnnouncement(id: ID!, title: String!, content: String!): Announcement
		deleteAnnouncement(id: ID!): Announcement
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
		data: [Student]
		hasMore: Boolean
		count: Int
	}
	type AnnouncementsResult {
		data: [Announcement]
		hasMore: Boolean
		count: Int
	}

	type SystemUser {
		id: String
		email: String
		firstName: String
		lastName: String
		middleName: String
		password: String
		mfaSecret: String
		phoneNumber: String
		birthDate: String
		gender: Gender
		mfaEnabled: Boolean
		address: Address
		role: SystemUserRole
		status: SystemUserStatus
		verifiedAt: String
		createdAt: String
		updatedAt: String
	}

	type Student {
		id: String
		email: String
		firstName: String
		lastName: String
		middleName: String
		address: Address
		phoneNumber: String
		status: StudentStatus
		gender: Gender
		mfaSecret: String
		birthDate: String
		mfaEnabled: Boolean
		yearLevel: Int
		schoolName: String
		statusUpdatedAt: String
		createdAt: String
		updatedAt: String
	}

	enum Gender {
		MALE
		FEMALE
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
		ADMIN_MANAGE_SCHOLAR
		ADMIN_MANAGE_GATHERINGS
		ADMIN_MANAGE_DOCUMENTS
		ADMIN_VIEWER
	}

	enum SystemUserStatus {
		PENDING
		VERIFIED
		UNVERIFIED
		DELETED
	}

	type Announcement {
		id: ID!
		createdBy: SystemUser!
		content: String!
		title: String!
		createdAt: String!
	}

	type Meeting {
		id: ID!
		title: String!
		description: String
		startTime: String!
		endTime: String!
		location: String
		date: String
		createdAt: String
	}

	type Event {
		id: ID!
		title: String!
		description: String
		startTime: String!
		endTime: String!
		location: String
		startDate: String
		endDate: String

		createdAt: String
	}
`;
