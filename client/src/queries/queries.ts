import { gql } from "@apollo/client";

import {
  allowanceFragment,
  documentFragment,
  eventFragment,
  meetingFragment,
  monthlyLateSubmitterFragment,
  studentsFragment,
  systemUsersFragment,
  transactionFragment,
} from "./fragments";

export const READ_OFFICES_REPORTS_QUERY = gql`
  query {
    officesReports {
      name
      office
      totalAllowance
      totalScholars
      totalActiveScholars
      totalGraduatesScholars
      totalDisqualifiedScholars
    }
  }
`;

export const READ_REPORTS_BY_OFFICE_QUERY = gql`
  ${systemUsersFragment}
  ${transactionFragment}
  query (
    $office: String
    $filter: String
    $pagination: PaginationInput
    $input: TransactionPaginationArgs
    $schoolName: String
  ) {
    transactions(input: $input) {
      data {
        ...TransactionFragment
      }
      count
      hasMore
    }
    reportsByOffice(office: $office, schoolName: $schoolName) {
      office
      totalAllowance
      totalScholars
      totalActiveScholars
      totalGraduatesScholars
      totalDisqualifiedScholars
      totalMiscellaneousAllowance
      totalMonthlyAllowance
      totalBookAllowance
      totalThesisAllowance
    }
    announcements(filter: $filter, pagination: $pagination, office: $office) {
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

export const READ_SCHOLAR_DOCS_AND_LATE_SUBMISSION_QUERY = gql`
  ${monthlyLateSubmitterFragment}
  ${documentFragment}
  ${documentFragment}
  ${allowanceFragment}
  query (
    $scholarId: ID!
    $month: Int
    $year: Int
    $monthlyDocument: Boolean
    $type: DocumentType
    $semester: Int
    $schoolYear: String
    $allowanceYear2: Int!
    $allowanceMonth2: Int!
  ) {
    requests: lateSubmissionByScholar(
      id: $scholarId
      month: $month
      year: $year
    ) {
      ...MonthlyLateSubmitter
    }
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
      studentId: $scholarId
      year: $allowanceYear2
      month: $allowanceMonth2
    ) {
      ...AllowanceFragment
    }
  }
`;
export const LATE_SUBMISSION_REQUESTS_QUERY = gql`
  ${monthlyLateSubmitterFragment}
  query (
    $isApproved: Boolean
    $pagination: PaginationInput
    $year: Int
    $month: Int
  ) {
    requests: lateSubmissionRequests(
      isApproved: $isApproved
      pagination: $pagination
      year: $year
      month: $month
    ) {
      data {
        ...MonthlyLateSubmitter
        student {
          id
          firstName
          lastName
        }
        updatedBy {
          firstName
          id
          lastName
          email
        }
      }
      count
      hasMore
    }
  }
`;

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
  query ($filter: String, $pagination: PaginationInput, $office: String) {
    systemUsers(filter: $filter, pagination: $pagination, office: $office) {
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
  ${documentFragment}
  query (
    $status: String
    $pagination: PaginationInput
    $filter: String
    $includeDocs: Boolean
    $school: String
    $office: String
  ) {
    students(
      office: $office
      status: $status
      pagination: $pagination
      filter: $filter
      school: $school
      includeDocs: $includeDocs
    ) {
      data {
        ...StudentFragment
        documents {
          ...DocumentFragment
        }
      }
      count
      hasMore
    }
  }
`;

export const READ_ANNOUNCEMENTS_QUERY = gql`
  ${systemUsersFragment}
  query ($filter: String, $pagination: PaginationInput, $office: String) {
    announcements(filter: $filter, pagination: $pagination, office: $office) {
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

export const READ_TRANSACTIONS_QUERY = gql`
  ${transactionFragment}
  query ($input: TransactionPaginationArgs) {
    transactions(input: $input) {
      data {
        ...TransactionFragment
      }
      count
      hasMore
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
    $scholarId: ID
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

export const READ_DOCUMENTS_WITH_LATE_REQUETSTS_QUERY = gql`
  ${documentFragment}
  ${monthlyLateSubmitterFragment}
  query (
    $year: Int
    $month: Int
    $schoolYear: String
    $semester: Int
    $type: DocumentType
    $monthlyDocument: Boolean
    $scholarId: ID!
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
    requests: lateSubmissionByScholar(
      id: $scholarId
      month: $month
      year: $year
    ) {
      ...MonthlyLateSubmitter
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

export const READ_DASHBOARD_DATA = gql`
  ${systemUsersFragment}
  query {
    data: dashboardOverviewData {
      chart {
        yearLevel
        disqualified
        active
        graduated
      }
      briefOverview {
        activeScholars {
          avg
          new
        }
        events {
          avg
          new
        }
        graduated {
          avg
          new
        }
        totalScholars {
          avg
          new
        }
      }
      announcements {
        id
        content
        title
        createdAt
        createdBy {
          ...SystemUserFragment
        }
      }
    }
  }
`;
