import { gql } from "@apollo/client";

import {
  allowanceFragment,
  documentFragment,
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
    $firstName: String
    $lastName: String
    $middleName: String
    # $city: String
    # $street: String
    $password: String
    $address: AddressInput
    $birthDate: String
    $phoneNumber: String
    $status: StudentStatus
    $mfaSecret: String
    $mfaEnabled: Boolean
    $yearLevel: Int
    $schoolName: String
    $semester: Int
    $gender: Gender
    $course: String
  ) {
    updateStudent(
      id: $id
      firstName: $firstName
      lastName: $lastName
      middleName: $middleName
      # city: $city
      # street: $street
      password: $password
      address: $address
      birthDate: $birthDate
      phoneNumber: $phoneNumber
      status: $status
      mfaSecret: $mfaSecret
      mfaEnabled: $mfaEnabled
      semester: $semester
      yearLevel: $yearLevel
      schoolName: $schoolName
      gender: $gender
      course: $course
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
    $office: String!
  ) {
    createSystemUser(
      office: $office
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
    $semester: Int!
    $birthDate: String!
    $phoneNumber: String!
    $middleName: String
    $office: String!
  ) {
    createStudent(
      firstName: $firstName
      lastName: $lastName
      address: $address
      email: $email
      course: $course
      office: $office
      yearLevel: $yearLevel
      semester: $semester
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

export const CREATE_DOCUMENT_MUTATION = gql`
  ${documentFragment}
  mutation ($input: DocumentInput!) {
    document: createDocument(input: $input) {
      ...DocumentFragment
    }
  }
`;

export const DELETE_DOCUMENT_MUTATION = gql`
  ${documentFragment}
  mutation ($id: ID!) {
    document: deleteDocument(id: $id) {
      ...DocumentFragment
    }
  }
`;

export const UPDATE_DOCUMENT_MUTATION = gql`
  ${documentFragment}
  mutation ($id: ID!, $input: DocumentInput!) {
    updateDocument(id: $id, input: $input) {
      ...DocumentFragment
    }
  }
`;

export const CREATE_ALLOWANCE_MUTATION = gql`
  ${allowanceFragment}
  mutation (
    $studentId: String!
    $month: Int!
    $year: Int!
    $semester: Int!
    $monthlyAllowance: Float!
    $bookAllowance: Float
    $miscellaneousAllowance: Float
    $thesisAllowance: Float
    $yearLevel: Int!
  ) {
    createAllowance(
      studentId: $studentId
      month: $month
      year: $year
      semester: $semester
      monthlyAllowance: $monthlyAllowance
      bookAllowance: $bookAllowance
      miscellaneousAllowance: $miscellaneousAllowance
      thesisAllowance: $thesisAllowance
      yearLevel: $yearLevel
    ) {
      ...AllowanceFragment
    }
  }
`;

export const UPDATE_ALLOWANCE_STATUS_MUTATION = gql`
  ${allowanceFragment}
  mutation ($id: String!, $claimed: Boolean!) {
    allowance: updateAllowanceStatus(id: $id, claimed: $claimed) {
      ...AllowanceFragment
    }
  }
`;

export const UPDATE_STUDENT_NOTIFICATION_MUTATION = gql`
  mutation ($notificationId: ID) {
    notification: updateStudentNotification(notificationId: $notificationId)
  }
`;

export const CREATE_ADMIN_NOTIFICATION_MUTATION = gql`
  mutation (
    $type: AdminNotificationType!
    $link: String!
    $message: String!
    $title: String!
    $role: SystemUserRole!
  ) {
    notification: createAdminNotification(
      type: $type
      link: $link
      message: $message
      title: $title
      role: $role
    ) {
      id
      read
      message
      title
      role
      type
      readerIds
      link
      createdAt
    }
  }
`;

export const READ_ADMIN_NOTIFICATION_MUTATION = gql`
  mutation ($notificationId: ID!) {
    notification: updateAdminNotification(notificationId: $notificationId) {
      id
      read
      message
      title
      role
      type
      readerIds
      link
      createdAt
    }
  }
`;

export const CREATE_SCHOLAR_NOTIFICATION_MUTATION = gql`
  mutation (
    $type: ScholarNotificationType!
    $link: String!
    $message: String!
    $title: String!
    $receiverId: String!
  ) {
    notification: createScholarNotification(
      type: $type
      link: $link
      message: $message
      title: $title
      receiverId: $receiverId
    ) {
      id
      read
      message
      title
      type
      link
      createdAt
    }
  }
`;
