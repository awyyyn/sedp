import { useRoutes } from "react-router-dom";

import AuthLayout from "@/layouts/auth-layout";
import Login from "@/pages/auth/admin/login";
import ForgotPassword from "@/pages/auth/admin/forgot-password";
import ProtectedRoute from "@/components/protected-route";
import Dashboard from "@/pages/admin/dashboard";
import AdminLayout from "@/layouts/admin-layout";
import Scholars from "@/pages/admin/scholars/list";
import SystemUsers from "@/pages/admin/system-users/system-users";
import SystemUser from "@/pages/admin/system-users/system-user";
import StudentLogin from "@/pages/auth/student/login";
import StudentForgotPassword from "@/pages/auth/student/forgot-password";
import Unauthorized from "@/pages/unauthorized";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AddScholar from "@/pages/admin/scholars/create";
import AddSystemUser from "@/pages/admin/system-users/add-system-user";
import Announcements from "@/pages/admin/announcements/list";
import AddAnnouncement from "@/pages/admin/announcements/add";
import AnnouncementInfo from "@/pages/admin/announcements/info";
import EditAnnouncement from "@/pages/admin/announcements/edit";
import ScholarInfo from "@/pages/admin/scholars/info";
import EventLists from "@/pages/admin/events/list";
import AddEvent from "@/pages/admin/events/add";
import EventInfo from "@/pages/admin/events/info";
import EditEvent from "@/pages/admin/events/edit";
import Meetings from "@/pages/admin/meetings/list";
import AddMeeting from "@/pages/admin/meetings/add";
import MeetingInfo from "@/pages/admin/meetings/info";
import EditMeeting from "@/pages/admin/meetings/edit";
import MonthlySubmission from "@/pages/admin/monthly-submission/list";
import UserLayout from "@/layouts/user-layout";
import StudentProfile from "@/pages/account/account";
import Security from "@/pages/account/security";
import AccountLayout from "@/pages/account/layout";
import TimelineLayout from "@/pages/timeline/layout";
import AnnouncementFeed from "@/pages/timeline/announcements/feed";
import MeetingFeed from "@/pages/timeline/meetings/feed";
import EventFeed from "@/pages/timeline/events/feed";
import TimelinePage from "@/pages/timeline/page";
import DocumentsLayout from "@/pages/documents/layout";
import Monthly from "@/pages/documents/monthly/list";
import Semester from "@/pages/documents/semester/list";
import AddMonthlyDocument from "@/pages/documents/monthly/add";
import AddSemesterDocument from "@/pages/documents/semester/add";
import StudentFiles from "@/pages/admin/monthly-submission/scholar/info";
import Documents from "@/pages/documents/documents";
import EditMonthlyDocument from "@/pages/documents/monthly/edit";
import AllowanceList from "@/pages/admin/allowance/list";
import MyAllowanceList from "@/pages/allowance/list";
import AdminAccount from "@/pages/admin/account/account";
import AdminNotifications from "@/pages/admin/notifications";
import AdminAccountLayout from "@/pages/admin/account/layout";
import AdminSecurity from "@/pages/admin/account/security";
import SemesterSubmissions from "@/pages/admin/semester-docs/list";
import StudentSemesterFiles from "@/pages/admin/semester-docs/scholar/info";
import DisqualifyPage from "@/pages/disqualify";
import ScholarAllowances from "@/pages/admin/scholars/allowances";

function App() {
	const manageScholarRoutes = {
		element: (
			<ProtectedRoute
				allowedRoles={[
					"SUPER_ADMIN",
					"ADMIN_MANAGE_SCHOLAR",
					"ADMIN_VIEWER",
					"ADMIN_MANAGE_DOCUMENTS",
				]}
			/>
		),
		path: "admin",
		children: [
			{
				element: <AdminLayout />,
				children: [
					{
						path: "scholars",
						children: [
							{
								element: <Scholars />,
								index: true,
							},
							{
								element: <AddScholar />,
								path: "add",
							},
							{
								path: ":id",
								element: <ScholarInfo />,
							},

							{
								path: ":scholarId",
								children: [
									{
										path: "monthly-docs",
										element: <StudentFiles />,
									},
									{
										path: "semester-docs",
										element: <StudentSemesterFiles />,
									},
									{
										path: "allowance-history",
										element: <ScholarAllowances />,
									},
								],
							},
						],
					},
				],
			},
		],
	};

	const manageGatheringsRoutes = {
		element: (
			<ProtectedRoute
				allowedRoles={[
					"SUPER_ADMIN",
					"ADMIN_MANAGE_GATHERINGS",
					"ADMIN_MANAGE_DOCUMENTS",
					"ADMIN_MANAGE_SCHOLAR",
					"ADMIN_VIEWER",
				]}
			/>
		),
		path: "admin",
		children: [
			{
				element: <AdminLayout />,
				children: [
					{
						path: "events",
						children: [
							{
								element: <EventLists />,
								index: true,
							},
							{
								element: <AddEvent />,
								path: "add",
							},
							{
								path: ":id",
								children: [
									{
										element: <EventInfo />,
										index: true,
									},
									{
										element: <EditEvent />,
										path: "edit",
									},
								],
							},
						],
					},
					{
						path: "meetings",
						children: [
							{
								element: <Meetings />,
								index: true,
							},
							{
								element: <AddMeeting />,
								path: "add",
							},
							{
								path: ":id",
								children: [
									{
										element: <MeetingInfo />,
										index: true,
									},
									{
										element: <EditMeeting />,
										path: "edit",
									},
								],
							},
						],
					},
					{
						path: "announcements",
						children: [
							{
								element: <Announcements />,
								index: true,
							},
							{
								element: <AddAnnouncement />,
								path: "add",
							},
							{
								path: ":id",
								children: [
									{
										index: true,
										element: <AnnouncementInfo />,
									},

									{
										element: <EditAnnouncement />,
										path: "edit",
									},
								],
							},
						],
					},
				],
			},
		],
	};

	const manageDocumentsRoutes = {
		element: (
			<ProtectedRoute
				allowedRoles={["SUPER_ADMIN", "ADMIN_MANAGE_DOCUMENTS", "ADMIN_VIEWER"]}
			/>
		),
		path: "admin",
		children: [
			{
				element: <AdminLayout />,
				children: [
					{
						path: "monthly-submissions",
						children: [
							{
								index: true,
								element: <MonthlySubmission />,
							},
							{
								path: ":scholarId",
								// children:
								element: <StudentFiles />,
							},
						],
					},
					{
						path: "semester-submissions",
						children: [
							{
								index: true,
								element: <SemesterSubmissions />,
							},
							{
								path: ":scholarId",
								// children:
								element: <StudentSemesterFiles />,
							},
						],
					},
					{
						path: "allowances",
						children: [
							{
								index: true,
								element: <AllowanceList />,
							},
						],
					},
				],
			},
		],
	};

	const adminRoutes = {
		element: (
			<ProtectedRoute
				allowedRoles={[
					"SUPER_ADMIN",
					"ADMIN_MANAGE_DOCUMENTS",
					"ADMIN_VIEWER",
					"ADMIN_MANAGE_GATHERINGS",
					"ADMIN_MANAGE_SCHOLAR",
				]}
			/>
		),
		path: "admin",
		children: [
			{
				element: <AdminLayout />,
				children: [
					{
						path: "dashboard",
						element: <Dashboard />,
					},
					{
						element: <AdminAccountLayout />,
						path: "account",
						children: [
							{
								index: true,
								element: <AdminAccount />,
							},
							{
								path: "security",
								element: <AdminSecurity />,
							},
						],
					},
					{
						element: <AdminNotifications />,
						path: "notifications",
					},
				],
			},
		],
	};

	const superAdminRoutes = {
		element: <ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />,
		path: "admin",
		children: [
			{
				element: <AdminLayout />,
				children: [
					{
						path: "system-users",
						children: [
							{
								element: <SystemUsers />,
								index: true,
							},
							{
								path: "add",
								element: <AddSystemUser />,
							},
							{
								element: <SystemUser />,
								path: ":id",
							},
						],
					},
				],
			},
		],
	};

	const publicRoutes = [
		{
			path: "/",
			element: <Home />,
		},
		{
			element: <Unauthorized />,
			path: "unauthorized",
		},
		{
			element: <DisqualifyPage />,
			path: "disqualify",
		},
		{
			element: <NotFound />,
			path: "*",
		},
	];

	const userRoutes = {
		element: <ProtectedRoute allowedRoles={["STUDENT"]} />,
		children: [
			{
				element: <UserLayout />,
				children: [
					{
						element: <TimelineLayout />,
						children: [
							{
								path: "timeline",
								children: [
									{
										index: true,
										element: <TimelinePage />,
									},
									{
										element: <EventFeed />,
										path: "events",
									},
									{
										element: <AnnouncementFeed />,
										path: "announcements",
									},
									{
										element: <MeetingFeed />,
										path: "meetings",
									},
								],
							},
						],
					},
					{
						path: "account",
						element: <AccountLayout />,
						children: [
							{
								index: true,
								element: <StudentProfile />,
							},
							{
								element: <Security />,
								path: "security",
							},
						],
					},
					{
						path: "my-documents",
						element: <DocumentsLayout />,
						children: [
							{
								index: true,
								element: <Documents />,
							},
							{
								path: "monthly",
								children: [
									{
										index: true,
										element: <Monthly />,
									},
									{
										path: "upload",
										element: <AddMonthlyDocument />,
									},
									{
										path: ":id/edit",
										element: <EditMonthlyDocument />,
									},
								],
							},
							{
								path: "semester",
								children: [
									{
										index: true,
										element: <Semester />,
									},
									{
										path: "upload",
										element: <AddSemesterDocument />,
									},
								],
							},
						],
					},
					{
						path: "my-allowance",
						children: [
							{
								index: true,
								element: <MyAllowanceList />,
							},
						],
					},
				],
			},
		],
	};

	const authRoutes = {
		element: <AuthLayout />,
		children: [
			{
				path: "admin/login",
				children: [
					{ index: true, element: <Login /> },
					{
						path: "forgot-password",
						element: <ForgotPassword />,
					},
				],
			},
			{
				path: "login",
				element: <StudentLogin />,
			},
			{
				path: "forgot-password",
				element: <StudentForgotPassword />,
			},
			{
				path: "forgot-password",
				element: <StudentForgotPassword />,
			},
		],
	};

	return useRoutes([
		manageScholarRoutes,
		manageGatheringsRoutes,
		manageDocumentsRoutes,
		adminRoutes,
		superAdminRoutes,
		authRoutes,
		userRoutes,
		...publicRoutes,
	]);
}

export default App;
