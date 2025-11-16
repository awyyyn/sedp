import { MonthlyLateSubmitter, Prisma } from "@prisma/client";
import { addDays, addMonths, setHours, setMinutes, setSeconds } from "date-fns";

import { prisma } from "../services/prisma.js";
import { PaginationArgs } from "../types/system-user.js";
import { pubsub } from "../services/pubsub.js";
import { generateTransactionDescription } from "../services/utils.js";

export const requestLateSubmission = async ({
  reason,
  studentId,
  month,
  year,
}: Omit<
  MonthlyLateSubmitter,
  "createdAt" | "id" | "openUntil" | "updatedOn" | "isApproved" | "updatedById"
>) => {
  return await prisma.$transaction(async (tx) => {
    const isRequestExceedsLimit = await tx.monthlyLateSubmitter.count({
      where: {
        studentId,
        year,
        month,
      },
    });
    const isLateSubmissionExists = await tx.monthlyLateSubmitter.count({
      where: {
        studentId,
        month,
        year,
        updatedOn: {
          equals: null,
        },
      },
    });

    if (isLateSubmissionExists) {
      throw new Error(
        "You have already requested for late submission for this month.",
      );
    } else if (isRequestExceedsLimit >= 5) {
      throw new Error(
        "You have exceeded the maximum number of late submission requests for this month.",
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
      include: {
        student: true,
        updatedBy: true,
      },
    });

    const notification = await tx.adminNotification.create({
      data: {
        title: "New Late Submission Request",
        message: `A new late submission request has been made by ${lateSubmission.student.firstName} ${lateSubmission.student.lastName} for ${new Date(
          lateSubmission.year,
          lateSubmission.month - 1,
        ).toLocaleString("default", { month: "long" })}.`,
        link: `/admin/late-requests?active=${lateSubmission.id}`,
        role: "ADMIN_MANAGE_DOCUMENTS",
        type: "OTHER",
      },
    });

    if (!notification) throw new Error("Something went wrong!");

    pubsub.publish("ADMIN_NOTIFICATION_SENT", {
      adminNotificationSent: notification,
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

    let openUntilData: Date | undefined = undefined;

    switch (openUntil) {
      case "7d": {
        openUntilData = addDays(new Date(), 7);
        break;
      }
      case "14d": {
        openUntilData = addDays(new Date(), 14);
        break;
      }
      case "21d": {
        openUntilData = addDays(new Date(), 21);
        break;
      }
      case "1m": {
        openUntilData = addMonths(new Date(), 1);
        break;
      }
      default:
        openUntilData = addMonths(new Date(), 1);
    }

    const updatedRequest = await tx.monthlyLateSubmitter.update({
      data: {
        isApproved: approve,
        updatedBy: {
          connect: { id: updatedBy },
        },
        updatedOn: new Date(),
        openUntil: setSeconds(setMinutes(setHours(openUntilData, 23), 59), 59),
      },
      where: {
        id: requestId,
      },
      include: {
        student: true,
        updatedBy: true,
      },
    });

    if (!updatedRequest || !updatedRequest.updatedBy)
      throw new Error("Failed to update late submission request!");

    const notification = await tx.scholarNotification.create({
      data: {
        title: "Late Submission Request Update",
        message: `Your late submission request for ${new Date(
          updatedRequest.year,
          updatedRequest.month - 1,
        ).toLocaleString("default", { month: "long" })} has been ${
          approve ? "approved" : "denied"
        }.${
          approve && updatedRequest.openUntil
            ? ` You can submit your requirements until ${updatedRequest.openUntil.toLocaleDateString()}.`
            : ""
        }`,
        type: "OTHER",
        receiver: {
          connect: { id: updatedRequest.studentId },
        },
        link: `/my-documents/monthly?active=${updatedRequest.year}-${updatedRequest.month}`,
      },
    });

    if (!notification) throw new Error("Something went wrong!");

    const transaction = await tx.transaction.create({
      data: {
        action: approve ? "APPROVE" : "DISAPPROVE",
        description: generateTransactionDescription(
          approve ? "APPROVE" : "DISAPPROVE",
          "LATE_SUBMISSION",
          updatedRequest.updatedBy,
        ),
        entity: "LATE_SUBMISSION",
        entityId: updatedRequest.id,
        transactedBy: {
          connect: { id: updatedRequest.updatedBy.id },
        },
      },
    });

    if (!transaction) throw new Error("Failed to create transaction");

    pubsub.publish("SCHOLAR_NOTIFICATION_SENT", {
      scholarNotificationSent: notification,
    });

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
    where: {
      ...where,
      updatedOn: {
        isSet: false,
      },
    },
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
    where: {
      ...where,
      updatedOn: {
        isSet: false,
      },
    },
  });

  const hasMore = pagination
    ? pagination.page * pagination.take < count
    : false;

  return {
    data: requests.map((req) => ({
      ...req,
      updatedOn: req.updatedOn?.toISOString() || null,
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

export const getLateSubmissionByScholar = async ({
  id,
  month,
  year,
}: {
  id: string;
  year?: number;
  month?: number;
}) => {
  let where: Prisma.MonthlyLateSubmitterWhereInput = {
    studentId: id,
    isApproved: true,
    openUntil: {
      gte: new Date(),
    },
  };

  if (year) where.year = year;
  if (month) where.month = month;

  const requests = await prisma.monthlyLateSubmitter.findMany({
    where,
    include: {
      student: true,
      updatedBy: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  return requests.map((req) => ({
    ...req,
    updatedOn: req.updatedOn?.toISOString() || null,
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
  }));
};
