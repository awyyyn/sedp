import { gql } from "@apollo/client";

import {
	eventFragment,
	meetingFragment,
	studentsFragment,
	systemUsersFragment,
} from "./fragments";

export const verifyTOTPMutation = gql`
	mutation ($secret: String!, $token: String!) {
		totp: verifyTOTP(secret: $secret, token: $token)
	}
`;

export const sendSystemUserRegistrationMutation = gql`
	mutation SendSystemUserRegistrationEmail(
		$email: String!
		$role: SystemUserRole!
	) {
		sendRegistration: sendSystemUserRegistrationEmail(
			email: $email
			role: $role
		) {
			message
		}
	}
`;

export const deleteSystemUserMutation = gql`
	mutation DeleteSystemUser($id: String!) {
		deleteSystemUser(id: $id) {
			id
		}
	}
`;

export const UPDATE_STUDENT_MUTATION = gql`
	${studentsFragment}
	mutation (
		$id: String!
		$studentId: String
		$firstName: String
		$lastName: String
		$middleName: String
		$city: String
		$street: String
		$birthDate: String
		$phoneNumber: String
		$status: StudentStatus
		$mfaSecret: String
		$mfaEnabled: Boolean
		$yearLevel: Int
		$schoolName: String
	) {
		updateStudent(
			id: $id
			studentId: $studentId
			firstName: $firstName
			lastName: $lastName
			middleName: $middleName
			city: $city
			street: $street
			birthDate: $birthDate
			phoneNumber: $phoneNumber
			status: $status
			mfaSecret: $mfaSecret
			mfaEnabled: $mfaEnabled
			yearLevel: $yearLevel
			schoolName: $schoolName
		) {
			...StudentFragment
		}
	}
`;

export const CREATE_SYSTEM_USER_MUTATION = gql`
	${systemUsersFragment}
	mutation CreateSystemUser(
		$firstName: String!
		$lastName: String!
		$address: AddressInput!
		$email: String!
		$gender: Gender!
		$password: String!
		$role: SystemUserRole!
		$birthDate: String!
		$phoneNumber: String!
		$middleName: String
	) {
		createSystemUser(
			firstName: $firstName
			lastName: $lastName
			address: $address
			email: $email
			gender: $gender
			password: $password
			role: $role
			birthDate: $birthDate
			phoneNumber: $phoneNumber
			middleName: $middleName
		) {
			...SystemUserFragment
		}
	}
`;

export const CREATE_STUDENT_MUTATION = gql`
	${studentsFragment}
	mutation (
		$firstName: String!
		$lastName: String!
		$address: AddressInput!
		$email: String!
		$course: String!
		$yearLevel: Int!
		$schoolName: String!
		$gender: Gender!
		$password: String!
		$birthDate: String!
		$phoneNumber: String!
		$middleName: String
	) {
		createStudent(
			firstName: $firstName
			lastName: $lastName
			address: $address
			email: $email
			course: $course
			yearLevel: $yearLevel
			schoolName: $schoolName
			gender: $gender
			password: $password
			birthDate: $birthDate
			phoneNumber: $phoneNumber
			middleName: $middleName
		) {
			...StudentFragment
		}
	}
`;

export const CREATE_ANNOUNCEMENT_MUTATION = gql`
	mutation ($title: String!, $content: String!) {
		announcement: createAnnouncement(title: $title, content: $content) {
			id
			content
			title
			createdAt
		}
	}
`;

export const UPDATE_ANNOUNCEMENT_MUTATION = gql`
	mutation ($title: String!, $content: String!, $id: ID!) {
		announcement: updateAnnouncement(
			title: $title
			content: $content
			id: $id
		) {
			id
			content
			title
			createdAt
		}
	}
`;

export const DELETE_ANNOUNCEMENT_MUTATION = gql`
	mutation ($id: ID!) {
		deleteAnnouncement(id: $id) {
			id
			content
			title
			createdAt
		}
	}
`;
export const UPDATE_SYSTEM_USER_MUTATION = gql`
	${systemUsersFragment}
	mutation UpdateSystemUser($values: updateSystemUserInput) {
		updateSystemUser(values: $values) {
			...SystemUserFragment
		}
	}
`;

export const CREATE_EVENT_MUTATION = gql`
	${eventFragment}
	mutation (
		$description: String!
		$startTime: String!
		$endTime: String!
		$location: String!
		$startDate: String!
		$endDate: String!
		$title: String!
	) {
		event: createEvent(
			description: $description
			startTime: $startTime
			endTime: $endTime
			location: $location
			startDate: $startDate
			endDate: $endDate
			title: $title
		) {
			...EventFragment
		}
	}
`;

export const UPDATE_EVENT_MUTATION = gql`
	${eventFragment}
	mutation (
		$description: String!
		$startTime: String!
		$endTime: String!
		$location: String!
		$startDate: String!
		$endDate: String!
		$title: String!
		$id: ID!
	) {
		event: updateEvent(
			description: $description
			startTime: $startTime
			endTime: $endTime
			location: $location
			startDate: $startDate
			endDate: $endDate
			title: $title
			id: $id
		) {
			...EventFragment
		}
	}
`;

export const DELETE_EVENT_MUTATION = gql`
	${eventFragment}
	mutation DeleteEvent($id: ID!) {
		deleteEvent(id: $id) {
			...EventFragment
		}
	}
`;
export const DELETE_MEETING_MUTATION = gql`
	${meetingFragment}
	mutation ($id: ID!) {
		deleteMeeting(id: $id) {
			...MeetingFragment
		}
	}
`;

export const CREATE_MEETING_MUTATION = gql`
	${meetingFragment}
	mutation (
		$description: String!
		$startTime: String!
		$endTime: String!
		$location: String!
		$date: String!
		$title: String!
	) {
		meeting: createMeeting(
			description: $description
			startTime: $startTime
			endTime: $endTime
			location: $location
			date: $date
			title: $title
		) {
			...MeetingFragment
		}
	}
`;

export const UPDATE_MEETING_MUTATION = gql`
	${meetingFragment}
	mutation UpdateMeeting(
		$startTime: String!
		$endTime: String!
		$location: String!
		$date: String!
		$id: ID!
		$title: String!
		$description: String!
	) {
		updateMeeting(
			startTime: $startTime
			endTime: $endTime
			location: $location
			date: $date
			id: $id
			title: $title
			description: $description
		) {
			...MeetingFragment
		}
	}
`;
