import { GraphQLError } from "graphql";
import {
  approveLateSubmissionRequest,
  getLateSubmissionRequests,
  requestLateSubmission,
} from "../../models/index.js";
import { AppContext, TransactionPaginationArgs } from "../../types/index.js";
import { MonthlyLateSubmitter } from "@prisma/client";
import { setHours, setMinutes, setSeconds } from "date-fns";

export const requestLateSubmissionResolver = async (
  _: never,
  {
    isApproved,
    month,
    reason,
    studentId,
    year,
  }: Omit<
    MonthlyLateSubmitter,
    "createdAt" | "id" | "openUntil" | "updatedById" | "updatedOn"
  >,
  app: AppContext,
) => {
  try {
    return await requestLateSubmission({
      updatedById: app.id,
      studentId,
      isApproved,
      month,
      reason,
      updateOn: new Date(),
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
    return await approveLateSubmissionRequest({
      approve,
      requestId,
      openUntil,
      updatedBy: app.id,
    });
  } catch (error) {
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
