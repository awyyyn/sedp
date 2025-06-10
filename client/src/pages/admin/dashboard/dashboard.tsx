import { useQuery } from "@apollo/client";
import { Tab, Tabs } from "@heroui/tabs";
import { Icon } from "@iconify/react/dist/iconify.js";

import MiniInfoCard from "./__components/mini-info-card";
import { RecentAnnouncements } from "./__components/announcement";
import { ScholarStatusChart } from "./__components/scholar-status-chart";

import { DashboardOverviewData } from "@/types";
import { READ_DASHBOARD_DATA } from "@/queries";
import { ErrorUI } from "@/components";
import { Helmet } from "react-helmet";

export default function Dashboard() {
	const { data, loading, error, refetch } = useQuery<{
		data: DashboardOverviewData;
	}>(READ_DASHBOARD_DATA);

	if (loading) {
		return (
			<div className="flex items-center justify-center w-full h-full">
				<Icon
					icon="lucide:loader-2"
					className="w-8 h-8 animate-spin text-gray-500"
				/>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<ErrorUI onRefresh={refetch} />
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Dashboard | Admin</title>
				<meta
					name="description"
					content="View the dashboard to get an overview of scholars, events, and announcements."
				/>
			</Helmet>
			<div className=" container  space-y-3">
				<h1 className="text-3xl font-medium">Dashboard</h1>
				<Tabs>
					<Tab title="Overview" className=" ">
						<div className="space-y-5 ">
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
								<MiniInfoCard
									description={`+${data?.data.briefOverview.totalScholars.avg}% from last month`}
									icon={
										<Icon
											icon="solar:users-group-two-rounded-broken"
											width="24"
											height="24"
											className="text-gray-500"
										/>
									}
									title="Total Students"
									value={data?.data.briefOverview.totalScholars.new || 0}
								/>

								<MiniInfoCard
									description={`+${data?.data.briefOverview.activeScholars.avg}% from last semester`}
									icon={
										<Icon
											icon="mdi:user-multiple-check"
											width="24"
											height="24"
											className="text-gray-500"
										/>
									}
									title="Active Scholars"
									value={data?.data.briefOverview.activeScholars.new || 0}
								/>
								<MiniInfoCard
									description={`${data?.data.briefOverview.graduated.avg}% from total number of scholars`}
									icon={
										<Icon
											icon="simple-icons:googlescholar"
											width="24"
											height="24"
											className="text-gray-500"
										/>
									}
									title="Graduated Scholars"
									value={data?.data.briefOverview.graduated.new || 0}
								/>
								<MiniInfoCard
									title="Events"
									value={data?.data.briefOverview.events.new || 0}
									description={`+${data?.data.briefOverview.events.avg}% from last month`}
									icon={
										<Icon
											icon="mdi:events"
											width="24"
											height="24"
											className="text-gray-500"
										/>
									}
								/>
							</div>

							<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
								<ScholarStatusChart data={data?.data.chart} />
								<RecentAnnouncements
									announcements={data?.data.announcements || []}
								/>
							</div>
						</div>
					</Tab>
				</Tabs>
			</div>
		</>
	);
}
