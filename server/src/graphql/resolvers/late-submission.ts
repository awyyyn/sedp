import { GraphQLError } from "graphql";
import {
  approveLateSubmissionRequest,
  getLateSubmissionByScholar,
  getLateSubmissionRequests,
  requestLateSubmission,
} from "../../models/index.js";
import { AppContext, TransactionPaginationArgs } from "../../types/index.js";
import { MonthlyLateSubmitter } from "@prisma/client";

export const requestLateSubmissionResolver = async (
  _: never,
  {
    month,
    reason,
    year,
  }: Pick<MonthlyLateSubmitter, "month" | "reason" | "year">,
  app: AppContext,
) => {
  try {
    return await requestLateSubmission({
      studentId: app.id,
      month,
      reason,
      year,
    });
  } catch (error) {
    throw new GraphQLError(
      (error as GraphQLError).message || "Failed to request late submission",
    );
  }
};

export const approveLateSubmissionRequestResolver = async (
  _: never,
  {
    approve,
    requestId,
    openUntil,
  }: { approve: boolean; openUntil?: string; requestId: string },
  app: AppContext,
) => {
  try {
    if (app.role !== "SUPER_ADMIN" && app.role !== "ADMIN_MANAGE_DOCUMENTS") {
      throw new GraphQLError("You are not authorized to perform this action");
    }

    return await approveLateSubmissionRequest({
      approve,
      requestId,
      openUntil,
      updatedBy: app.id,
    });
  } catch (error) {
    console.log(error);
    throw new GraphQLError(
      (error as GraphQLError).message || "Failed to approve late submission",
    );
  }
};

export const lateSubmissionRequestsResolver = async (
  _: never,
  args: {
    isApproved?: boolean;
    pagination?: TransactionPaginationArgs["pagination"];
    year?: number;
    month?: number;
  },
) => {
  try {
    return await getLateSubmissionRequests(args);
  } catch (error) {
    throw new GraphQLError(
      (error as GraphQLError).message || "Internal server error!",
    );
  }
};

export const lateSubmissionByScholarResolver = async (
  _: never,
  data: { id: string; year?: number; month?: number },
) => {
  try {
    return await getLateSubmissionByScholar(data);
  } catch (error) {
    throw new GraphQLError(
      (error as GraphQLError).message || "Internal server error!",
    );
  }
};
