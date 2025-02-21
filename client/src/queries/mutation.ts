import { gql } from "@apollo/client";

import { studentsFragment } from "./fragments";

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
		$updateStudentMiddleName2: String
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
			middleName: $updateStudentMiddleName2
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
