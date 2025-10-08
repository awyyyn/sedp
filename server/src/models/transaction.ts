import {
  Transaction,
  Prisma,
  Student,
  Allowance,
  Meeting,
  Announcement,
  Events,
  MonthlyLateSubmitter,
} from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { PaginationResult, TransactionPaginationArgs } from "../types/index.js";

export const createTransaction = async ({
  action,
  description,
  entity,
  entityId,
  transactedById,
}: Omit<Transaction, "id" | "createdAt">) => {
  return await prisma.transaction.create({
    data: {
      entity,
      action,
      description,
      entityId,
      transactedBy: {
        connect: { id: transactedById },
      },
    },
  });
};

export const readTransactions = async ({
  action,
  entity,
  pagination,
  office,
  transactedById,
}: TransactionPaginationArgs = {}): Promise<
  PaginationResult<Omit<Transaction, "createdAt"> & { createdAt: string }>
> => {
  let where: Prisma.TransactionWhereInput = {};

  if (action) where.action = action;

  if (entity) where.entity = entity;

  if (transactedById) where.transactedById = transactedById;

  if (office) {
    where.transactedBy = {
      office,
    };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    take: pagination ? pagination.take : undefined,
    skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
    include: {
      transactedBy: true,
    },
  });

  const count = await prisma.transaction.count({ where });

  const transactionsWithEntity = await Promise.all(
    transactions.map(async (transaction) => {
      let student: Student | null = null;
      let allowance: Allowance | null = null;
      let event: Events | null = null;
      let meeting: Meeting | null = null;
      let announcement: Announcement | null = null;
      let lateSubmission: MonthlyLateSubmitter | null = null;

      switch (transaction.entity) {
        case "ALLOWANCE": {
          allowance = await prisma.allowance.findFirst({
            where: {
              id: transaction.entityId,
            },
          });
          break;
        }

        case "ANNOUNCEMENT": {
          announcement = await prisma.announcement.findFirst({
            where: { id: transaction.entityId },
          });
          break;
        }
        case "EVENT": {
          event = await prisma.events.findFirst({
            where: { id: transaction.entityId },
          });
          break;
        }
        case "MEETING": {
          meeting = await prisma.meeting.findFirst({
            where: { id: transaction.entityId },
          });
          break;
        }
        case "STUDENT": {
          student = await prisma.student.findFirst({
            where: { id: transaction.entityId },
          });

          if (student) {
            student = {
              ...student,
            };
          }
          break;
        }
        case "LATE_SUBMISSION": {
          lateSubmission = await prisma.monthlyLateSubmitter.findFirst({
            where: { id: transaction.entityId },
          });

          if (lateSubmission) {
            lateSubmission = {
              ...lateSubmission,
            };
          }

          break;
        }
        default:
      }

      return {
        ...transaction,
        student: student && {
          ...student,
          createdAt: student.createdAt.toISOString(),
          updatedAt: student.updatedAt.toISOString(),
          birthDate: student.birthDate.toISOString(),
        },
        allowance: allowance && {
          ...allowance,
          claimedAt: allowance.claimedAt && allowance.claimedAt.toISOString(),
          createdAt: allowance.createdAt.toISOString(),
          updatedAt: allowance.updatedAt.toISOString(),
        },
        event: event && {
          ...event,
          createdAt: event.createdAt.toISOString(),
        },
        meeting: meeting && {
          ...meeting,
          createdAt: meeting.createdAt.toISOString(),
        },
        announcement: announcement && {
          ...announcement,
          createdAt: announcement.createdAt.toISOString(),
        },
        lateSubmission: lateSubmission && {
          ...lateSubmission,
          openUntil: lateSubmission?.openUntil
            ? lateSubmission.openUntil.toISOString()
            : null,
          updatedOn: lateSubmission?.updatedOn
            ? lateSubmission.updatedOn.toISOString()
            : null,
          createdAt: lateSubmission.createdAt.toISOString(),
        },
        transactedBy: {
          ...transaction.transactedBy,
          birthDate: transaction.transactedBy.birthDate.toISOString(),
        },
        createdAt: transaction.createdAt.toISOString(),
      };
    }),
  );

  return {
    data: transactionsWithEntity,
    hasMore: pagination ? pagination.page * pagination.take < count : false,
    count,
  };
};
