import { GraphQLError } from "graphql";
import {
	briefOverviewData,
	studentsStatusOverview,
} from "../../models/dashboard.js";
import { readAnnouncements } from "../../models/announcement.js";

export const dashboardOverviewDataResolver = async () => {
	try {
		const barChartData = await studentsStatusOverview();
		const briefOverview = await briefOverviewData();
		const announcements = await readAnnouncements({
			pagination: {
				page: 1,
				take: 3,
			},
		});

		return {
			chart: barChartData,
			briefOverview,
			announcements: announcements.data,
		};
	} catch (err) {
		console.log(err);
		throw new GraphQLError("Internal Server Error!");
	}
};
