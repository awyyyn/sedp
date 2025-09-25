import { GraphQLError } from "graphql";
import {
  briefOverviewData,
  studentsStatusOverview,
} from "../../models/dashboard.js";
import { readAnnouncements } from "../../models/announcement.js";
import { AppContext } from "../../types/index.js";

export const dashboardOverviewDataResolver = async (
  _: never,
  __: never,
  app: AppContext,
) => {
  try {
    let office: string | undefined = undefined;

    if (app.role !== "SUPER_ADMIN") {
      office = app.office;
    }

    const barChartData = await studentsStatusOverview({ office });
    const briefOverview = await briefOverviewData({ office });
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
