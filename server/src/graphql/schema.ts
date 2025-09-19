import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Subscription {
    scholarNotificationSent(scholarId: ID!): ScholarNotification
    adminNotificationSent(role: SystemUserRole): AdminNotification
  }
  type Query {
    transactions(input: TransactionPaginationArgs): TransactionResult
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
    monthlyEvents: [Event]
    notifications: [ScholarNotification]
    adminNotifications: [AdminNotification]
    dashboardOverviewData: DashboardOverviewData
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
      semester: Int
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
      semester: Int!
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
    createAdminNotification(
      type: AdminNotificationType!
      link: String!
      message: String!
      title: String!
      role: SystemUserRole!
    ): AdminNotification
    createScholarNotification(
      type: ScholarNotificationType!
      link: String!
      message: String!
      title: String!
      receiverId: String!
    ): ScholarNotification
    updateStudentNotification(notificationId: ID): Boolean
    # updateAllStudentNotification: [ScholarNotification]

    # updateAllAdminNotification: [AdminNotification]
    updateAdminNotification(notificationId: ID): AdminNotification
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
    amount: Float
  }

  enum DocType {
    NARRATIVE_REPORT
    RECEIPT
    COR
    COG
    ACKNOWLEDGEMENT
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
    gender: Gender
    role: SystemUserRole
    status: SystemUserStatus
  }

  type Transaction {
    id: ID!

    action: TransactionAction!
    entity: TransactionEntity!
    entityId: String!
    description: String!
    transactedBy: SystemUser!
    transactedById: String!

    createdAt: String!
  }

  enum TransactionAction {
    CREATE
    UPDATE
    DELETE
    GENERATE
  }

  enum TransactionEntity {
    STUDENT
    ALLOWANCE
    MEETING
    GATHERING
    ANNOUNCEMENT
  }

  input TransactionPaginationArgs {
    pagination: PaginationInput
    enity: TransactionEntity
    action: TransactionAction
    transactedById: String
  }

  input PaginationInput {
    take: Int!
    page: Int!
  }

  type TransactionResult {
    data: [Transaction]
    hasMore: Boolean
    count: Int
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
    yearLevelJoined: Int
    gender: Gender
    mfaSecret: String
    birthDate: String
    mfaEnabled: Boolean
    yearLevel: Int
    semester: Int
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

  type OverviewData {
    avg: Float
    new: Int
  }

  type BriefOverviewData {
    activeScholars: OverviewData
    totalScholars: OverviewData
    graduated: OverviewData
    events: OverviewData
  }

  type ChartData {
    yearLevel: Int
    disqualified: Int
    active: Int
    graduated: Int
  }

  type DashboardOverviewData {
    briefOverview: BriefOverviewData
    chart: [ChartData]
    announcements: [Announcement]
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

  enum AdminNotificationType {
    SEMESTER_DOCUMENT
    MONTHLY_DOCUMENT
    OTHER
  }

  type AdminNotification {
    id: ID!
    read: Boolean!
    message: String!
    title: String!
    role: SystemUserRole!
    type: AdminNotificationType!
    readerIds: [String]
    link: String

    createdAt: String!
  }

  enum ScholarNotificationType {
    MEETING
    EVENT
    ANNOUNCEMENT
    ALLOWANCE
    SYSTEM_UPDATE
    OTHER
  }

  type ScholarNotification {
    id: ID!
    read: Boolean!
    message: String!
    title: String!
    receiverId: String!
    # receiver: Student!
    type: ScholarNotificationType!
    link: String

    createdAt: String!
  }
`;
