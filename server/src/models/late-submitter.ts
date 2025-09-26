import { MonthlyLateSubmitter, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { PaginationArgs } from "../types/system-user.js";
import { setHours, setMinutes, setSeconds } from "date-fns";

export const requestLateSubmission = async ({
  reason,
  studentId,
  month,
  year,
}: Omit<MonthlyLateSubmitter, "createdAt" | "id" | "openUntil">) => {
  return await prisma.$transaction(async (tx) => {
    const isLateSubmissionExists = await tx.monthlyLateSubmitter.count({
      where: {
        studentId,
        month,
        year,
      },
    });

    if (isLateSubmissionExists) {
      throw new Error(
        "You have already requested for late submission for this month.",
      );
    }

    const lateSubmission = await tx.monthlyLateSubmitter.create({
      data: {
        reason,
        student: {
          connect: { id: studentId },
        },
        month,
        year,
      },
    });

    return lateSubmission;
  });
};

export const approveLateSubmissionRequest = async ({
  updatedBy,
  requestId,
  approve,
  openUntil,
}: {
  updatedBy: string;
  requestId: string;
  approve: boolean;
  openUntil?: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    const isExists = await tx.monthlyLateSubmitter.count({
      where: { id: requestId },
    });

    if (!isExists) throw new Error("Late submission request cannot found!");

    const updatedRequest = await tx.monthlyLateSubmitter.update({
      data: {
        isApproved: approve,
        updatedBy: {
          connect: { id: updatedBy },
        },
        updateOn: new Date(),
        ...(openUntil && {
          openUntil: openUntil
            ? setSeconds(setMinutes(setHours(new Date(openUntil), 23), 59), 59)
            : null,
        }),
      },
      where: {
        id: requestId,
      },
    });

    if (!updatedRequest)
      throw new Error("Failed to update late submission request!");

    return updatedRequest;
  });
};

export const getLateSubmissionRequests = async ({
  isApproved,
  month,
  pagination,
  year,
}: {
  month?: number;
  year?: number;
  pagination?: PaginationArgs<never>["pagination"];
  isApproved?: boolean;
} = {}) => {
  const where: Prisma.MonthlyLateSubmitterWhereInput = {};

  if (typeof isApproved !== "undefined") {
    where.isApproved = isApproved;
  }

  if (month) where.month = month;

  if (year) where.year = year;

  const requests = await prisma.monthlyLateSubmitter.findMany({
    where,
    include: {
      student: true,
      updatedBy: true,
    },
    take: pagination ? pagination.take : undefined,
    skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  const count = await prisma.monthlyLateSubmitter.count({
    where,
  });

  const hasMore = pagination
    ? pagination.page * pagination.take < count
    : false;

  return {
    data: requests.map((req) => ({
      ...req,
      updateOn: req.updateOn?.toISOString() || null,
      createdAt: req.createdAt.toISOString(),
      openUntil: req.openUntil?.toISOString() || null,
      student: {
        ...req.student,
        password: null,
        createdAt: req.student.createdAt.toISOString(),
        birthDate: req.student.birthDate.toISOString(),
        updatedAt: req.student.updatedAt.toISOString(),
      },
      updatedBy: {
        ...req.updatedBy,
        password: null,
        verifiedAt: req.updatedBy?.verifiedAt?.toISOString() || null,
        updatedAt: req.updatedBy?.updatedAt.toISOString() || null,
        createdAt: req.updatedBy?.createdAt.toISOString() || null,
        birthDate: req.updatedBy?.birthDate.toISOString() || null,
      },
    })),
    count,
    hasMore,
  };
};
