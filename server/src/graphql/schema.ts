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
		events(filter: String, pagination: PaginationInput): EventsResult
		event(id: ID!): Event
		meeting(id: ID!): Meeting
		meetings(filter: String, pagination: PaginationInput): MeetingsResult
		calendarEvents: [CalendarEvent]
		calendarMeetingEvents: [CalendarEvent]
		documents(
			year: Int
			month: Int
			schoolYear: String
			semester: Int
			type: DocumentType
			monthlyDocument: Boolean
			scholarId: String
		): [Document]
		allowances(
			claimed: Boolean
			studentId: String
			month: Int
			pagination: PaginationInput
			year: Int
			semester: Int
			yearLevel: Int
			includeStudent: Boolean
		): AllowanceResult
		allowance(studentId: ID!, year: Int!, month: Int!): Allowance
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
			firstName: String
			lastName: String
			middleName: String
			# city: String
			# street: String
			address: AddressInput
			gender: Gender
			phoneNumber: String
			birthDate: String
			status: StudentStatus
			mfaSecret: String
			mfaEnabled: Boolean
			password: String
			yearLevel: Int
			schoolName: String
			course: String
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
		createEvent(
			description: String!
			startTime: String!
			endTime: String!
			location: String!
			startDate: String!
			endDate: String!
			title: String!
		): Event
		updateEvent(
			description: String!
			startTime: String!
			endTime: String!
			location: String!
			startDate: String!
			endDate: String!
			title: String!
			id: ID!
		): Event
		createMeeting(
			description: String!
			startTime: String!
			endTime: String!
			location: String!
			date: String!
			title: String!
		): Meeting
		updateMeeting(
			description: String!
			startTime: String!
			endTime: String!
			location: String!
			date: String!
			id: ID!
			title: String!
		): Meeting
		deleteEvent(id: ID!): Event
		deleteMeeting(id: ID!): Meeting
		createDocument(input: DocumentInput!): Document
		deleteDocument(id: ID!): Document
		updateDocument(id: ID!, input: DocumentInput!): Document
		createAllowance(
			studentId: String!
			month: Int!
			year: Int!
			semester: Int!
			bookAllowance: Float
			yearLevel: Int!
			miscellaneousAllowance: Float
			thesisAllowance: Float
			monthlyAllowance: Float!
		): Allowance
		updateAllowanceStatus(id: String!, claimed: Boolean!): Allowance
	}

	input DocumentInput {
		documentName: String!
		documentType: DocumentType
		docType: DocType!
		otherType: String
		documentUrl: String!
		monthlyDocument: Boolean
		month: Int!
		year: Int!
		schoolYear: String!
		semester: Int!
	}

	enum DocType {
		NARRATIVE_REPORT
		RECEIPT
		COR
		COG
		OSAS
		MISCELLANEOUS
		OTHER
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

	type AllowanceResult {
		data: [Allowance]
		hasMore: Boolean
		count: Int
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

	type EventsResult {
		data: [Event]
		hasMore: Boolean
		count: Int
	}
	type MeetingsResult {
		data: [Meeting]
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
		course: String
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

	type CalendarEvent {
		id: ID!
		start: String!
		end: String!
		title: String!
		location: String!
		backgroundColor: String!
		borderColor: String!
	}

	enum DocumentType {
		photo
		document
	}

	type Document {
		id: ID!
		studentId: String!
		student: Student!
		documentName: String!
		documentType: DocumentType!
		documentUrl: String!
		otherType: String
		amount: Float!
		docType: DocType!

		monthlyDocument: Boolean!
		month: Int!
		year: Int!
		schoolYear: String
		semester: Int

		createdAt: String!
		updatedAt: String!
	}

	type Allowance {
		id: String
		studentId: String
		student: Student

		month: Int
		year: Int
		semester: Int
		yearLevel: Int

		bookAllowance: Float
		miscellaneousAllowance: Float
		thesisAllowance: Float
		monthlyAllowance: Float

		claimedAt: String
		totalAmount: Float
		claimed: Boolean

		createdAt: String
		updatedAt: String
	}
`;
