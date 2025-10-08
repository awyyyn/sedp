import { GraphQLError } from "graphql";
import {
  briefOverviewData,
  officesReportsData,
  reportsByOfficeData,
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
    throw new GraphQLError(
      (err as GraphQLError).message || "Internal Server Error!",
    );
  }
};

export const reportsByOfficeResolver = async (
  _: never,
  { office, schoolName }: { office?: string; schoolName?: string },
) => {
  try {
    const t = await reportsByOfficeData({ office, schoolName });
    console.log(t);
    return t;
  } catch (err) {
    throw new GraphQLError(
      (err as GraphQLError).message || "Internal Server Error!",
    );
  }
};

export const officesReportsResolver = async () => {
  try {
    return officesReportsData();
  } catch (err) {
    throw new GraphQLError(
      (err as GraphQLError).message || "Internal Server Error!",
    );
  }
};
