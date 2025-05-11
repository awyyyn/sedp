import { Card, CardBody, CardHeader } from "@heroui/card";
import {
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Bar,
	ResponsiveContainer,
} from "recharts";

import { getYearLevelLabel } from "@/lib/utils";
import { DashboardOverviewData } from "@/types";
import { NoData } from "@/components";

export function ScholarStatusChart({
	data,
}: {
	data?: DashboardOverviewData["chart"];
}) {
	return (
		<Card className="p-2 ">
			<CardHeader>
				<h2 className="text-xl">Scholar Status Overview</h2>
			</CardHeader>
			<CardBody>
				{data ? (
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							data={(data || []).map((item) => ({
								Disqualified: item.disqualified,
								Active: item.active,
								Graduated: item.graduated,
								name: getYearLevelLabel(item.yearLevel),
							}))}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip
								contentStyle={{
									textTransform: "capitalize",
								}}
							/>
							<Legend />
							<Bar dataKey="Disqualified" fill="#8884d8" />
							<Bar dataKey="Active" fill="#321321" />
							<Bar dataKey="Graduated" fill="#123123" />
						</BarChart>
					</ResponsiveContainer>
				) : (
					<div className="flex items-center justify-center min-h-[300px]">
						<NoData
							icon={{
								icon: "tabler:box-off",
							}}
							title="No Data Available"
							description="Please check back later for updates."
						/>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
