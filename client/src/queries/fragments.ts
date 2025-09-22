import { gql } from "@apollo/client";

export const systemUsersFragment = gql`
  fragment SystemUserFragment on SystemUser {
    id
    email
    firstName
    lastName
    middleName
    gender
    password
    mfaSecret
    phoneNumber
    birthDate
    mfaEnabled
    address {
      city
      street
    }
    role

    status
    verifiedAt
    createdAt
    updatedAt
  }
`;

export const studentsFragment = gql`
  fragment StudentFragment on Student {
    id
    email
    firstName
    lastName
    gender
    middleName
    address {
      city
      street
    }
    phoneNumber
    status
    mfaSecret
    mfaEnabled
    birthDate
    yearLevel
    semester
    schoolName
    course
    statusUpdatedAt
    yearLevelJoined
    createdAt
    updatedAt
  }
`;

export const eventFragment = gql`
  fragment EventFragment on Event {
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
`;

export const meetingFragment = gql`
  fragment MeetingFragment on Meeting {
    id
    title
    description
    startTime
    endTime
    location
    date
    createdAt
  }
`;

export const documentFragment = gql`
  fragment DocumentFragment on Document {
    id
    documentType
    documentName
    documentUrl
    amount
    docType
    otherType
    monthlyDocument
    month
    year
    schoolYear
    semester
    createdAt
    updatedAt
    studentId
  }
`;

export const allowanceFragment = gql`
  fragment AllowanceFragment on Allowance {
    id
    studentId
    month
    year
    semester
    yearLevel
    bookAllowance
    miscellaneousAllowance
    thesisAllowance
    monthlyAllowance
    claimedAt
    totalAmount
    claimed
    createdAt
    updatedAt
  }
`;

export const announcementFragment = gql`
  fragment AnnouncementFragment on Announcement {
    id
    content
    title
    createdAt
  }
`;

export const transactionFragment = gql`
  ${allowanceFragment}
  ${meetingFragment}
  ${studentsFragment}
  ${systemUsersFragment}
  ${eventFragment}
  ${announcementFragment}
  fragment TransactionFragment on Transaction {
    id
    action
    entity
    entityId
    description
    createdAt
    transactedById
    transactedBy {
      ...SystemUserFragment
    }
    student {
      ...StudentFragment
    }
    allowance {
      ...AllowanceFragment
    }
    meeting {
      ...MeetingFragment
    }
    event {
      ...EventFragment
    }
    announcement {
      ...AnnouncementFragment
    }
  }
`;
