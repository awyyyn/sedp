import { gql } from "@apollo/client";

import {
	allowanceFragment,
	documentFragment,
	eventFragment,
	meetingFragment,
	studentsFragment,
	systemUsersFragment,
} from "./fragments";

export const GENERATE_TOTP_QUERY = gql`
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

export const READ_EVENTS_QUERY = gql`
	${eventFragment}
	query ($filter: String, $pagination: PaginationInput) {
		events(filter: $filter, pagination: $pagination) {
			count
			hasMore
			data {
				...EventFragment
			}
		}

		calendarEvents {
			id
			start
			end
			title
			location
			backgroundColor
			borderColor
		}
	}
`;

export const READ_EVENT_QUERY = gql`
	${eventFragment}
	query ($id: ID!) {
		event(id: $id) {
			...EventFragment
		}
	}
`;

export const READ_MEETING_QUERY = gql`
	${meetingFragment}
	query ($id: ID!) {
		meeting(id: $id) {
			...MeetingFragment
		}
	}
`;

export const READ_MEETINGS_QUERY = gql`
	${meetingFragment}
	query ($pagination: PaginationInput, $filter: String) {
		meetings(pagination: $pagination, filter: $filter) {
			data {
				...MeetingFragment
			}
			hasMore
			count
		}
		calendarMeetings: calendarMeetingEvents {
			id
			start
			end
			title
			location
			backgroundColor
			borderColor
		}
	}
`;

export const GET_CALENDAR_EVENTS_QUERY = gql`
	query {
		events: calendarEvents {
			id
			start
			end
			title
			location
			backgroundColor
			borderColor
		}
	}
`;

export const GET_CALENDAR_MEETINGS_QUERY = gql`
	query {
		calendarMeetings: calendarMeetingEvents {
			id
			start
			end
			title
			location
			backgroundColor
			borderColor
		}
	}
`;

export const READ_DOCUMENTS_QUERY = gql`
	${documentFragment}
	query (
		$year: Int
		$month: Int
		$schoolYear: String
		$semester: Int
		$type: DocumentType
		$monthlyDocument: Boolean
		$scholarId: String
	) {
		documents(
			scholarId: $scholarId
			year: $year
			month: $month
			schoolYear: $schoolYear
			semester: $semester
			type: $type
			monthlyDocument: $monthlyDocument
		) {
			...DocumentFragment
		}
	}
`;

export const READ_SCHOLAR_DOCUMENTS_QUERY = gql`
	${documentFragment}
	${allowanceFragment}
	query Documents(
		$year: Int
		$scholarId: String!
		$monthlyDocument: Boolean
		$type: DocumentType
		$semester: Int
		$schoolYear: String
		$month: Int
		$studentId: ID!
		$allowanceYear2: Int!
		$allowanceMonth2: Int!
	) {
		documents(
			year: $year
			scholarId: $scholarId
			monthlyDocument: $monthlyDocument
			type: $type
			semester: $semester
			schoolYear: $schoolYear
			month: $month
		) {
			...DocumentFragment
		}
		allowance(
			studentId: $studentId
			year: $allowanceYear2
			month: $allowanceMonth2
		) {
			...AllowanceFragment
		}
	}
`;

export const READ_SCHOLAR_SEMESTER_DOCUMENTS_QUERY = gql`
	${documentFragment}

	query Documents(
		$year: Int
		$scholarId: String!
		$monthlyDocument: Boolean
		$type: DocumentType
		$semester: Int
		$schoolYear: String
		$month: Int
	) {
		documents(
			year: $year
			scholarId: $scholarId
			monthlyDocument: $monthlyDocument
			type: $type
			semester: $semester
			schoolYear: $schoolYear
			month: $month
		) {
			...DocumentFragment
		}
	}
`;

export const READ_ALLOWANCES_QUERY = gql`
	${allowanceFragment}
	${studentsFragment}
	query (
		$claimed: Boolean
		$studentId: String
		$month: Int
		$pagination: PaginationInput
		$year: Int
		$semester: Int
		$yearLevel: Int
		$includeStudent: Boolean
	) {
		allowances(
			claimed: $claimed
			studentId: $studentId
			month: $month
			pagination: $pagination
			year: $year
			semester: $semester
			yearLevel: $yearLevel
			includeStudent: $includeStudent
		) {
			hasMore
			count
			data {
				...AllowanceFragment
				student {
					...StudentFragment
				}
			}
		}
	}
`;

export const READ_MONTHLY_EVENTS = gql`
	query {
		events: monthlyEvents {
			id
			title
			description
			startTime
			endTime
			location
			startDate
			endDate
			createdAt
		}
	}
`;
