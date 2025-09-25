import { Allowance, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { GetAllowanceArgs } from "../types/index.js";
import { generateTransactionDescription } from "../services/utils.js";
import { format } from "date-fns";

export const createAllowance = async (
  data: Omit<
    Allowance,
    "createdAt" | "updatedAt" | "id" | "claimed" | "claimedAt"
  >,
  systemUserId: string,
) => {
  const allowance = await prisma.$transaction(async (prsma) => {
    const user = await prsma.systemUser.findUniqueOrThrow({
      where: { id: systemUserId },
    });

    const allwnce = await prsma.allowance.create({
      data: {
        year: data.year,
        month: data.month,
        totalAmount: data.totalAmount,
        semester: data.semester,
        yearLevel: data.yearLevel,
        bookAllowance: data.bookAllowance || 0,
        miscellaneousAllowance: data.miscellaneousAllowance || 0,
        monthlyAllowance: data.monthlyAllowance || 0,
        thesisAllowance: data.thesisAllowance || 0,
        student: {
          connect: {
            id: data.studentId,
          },
        },
      },
    });

    const student = await prsma.student.findUniqueOrThrow({
      where: { id: data.studentId },
    });

    const transaction = await prsma.transaction.create({
      data: {
        action: "GENERATE",
        entity: "ALLOWANCE",
        entityId: allwnce.id,
        description: generateTransactionDescription({
          action: "GENERATE",
          entity: "ALLOWANCE",
          performedBy: `${user.firstName} ${user.lastName}`,
          targetName: `${student.firstName} ${student.lastName}`,
          extra: `Amount: ${data.totalAmount}, Month/Year: ${format(new Date(new Date().getFullYear(), data.month - 1, 1), "MMMM")}/${data.year}`,
        }),
        transactedBy: {
          connect: {
            id: systemUserId,
          },
        },
      },
    });

    if (!transaction) throw new Error("Transaction failed");

    return allwnce;
  });

  return {
    ...allowance,
    createdAt: allowance.createdAt.toISOString(),
    updatedAt: allowance.updatedAt.toISOString(),
  };
};

export const updateAllowanceStatus = async (
  id: string,
  claimed: boolean,
  transactedById: string,
) => {
  let claimedAt = null;

  if (claimed) {
    claimedAt = new Date();
  }

  const updatedAllowance = await prisma.$transaction(async (tx) => {
    const user = await tx.systemUser.findUniqueOrThrow({
      where: { id: transactedById },
    });

    const allowance = await tx.allowance.update({
      where: {
        id,
      },
      data: {
        claimed,
        claimedAt,
      },
      include: { student: true },
    });

    if (!allowance) throw new Error("Failed to update allowance status!");

    const transaction = await tx.transaction.create({
      data: {
        action: "UPDATE",
        entity: "ALLOWANCE",
        entityId: allowance.id,
        description: generateTransactionDescription({
          action: "UPDATE",
          entity: "ALLOWANCE",
          performedBy: `${user.firstName} ${user.lastName}`,
          targetName: `${allowance.student.firstName} ${allowance.student.lastName}`,
          extra: `Status: ${claimed ? "Claimed" : "Unclaimed"}`,
        }),
        transactedBy: {
          connect: {
            id: transactedById,
          },
        },
      },
    });

    if (!transaction) throw new Error("Transaction failed");

    return allowance;
  });

  return {
    ...updatedAllowance,
    createdAt: updatedAllowance.createdAt.toISOString(),
    updatedAt: updatedAllowance.updatedAt.toISOString(),
  };
};

export const readAllowance = async (
  studentId: string,
  year: number,
  month: number,
) => {
  const allowance = await prisma.allowance.findFirst({
    where: {
      studentId,
      year,
      month,
    },
  });

  if (!allowance) return null;

  return {
    ...allowance,
    createdAt: allowance.createdAt.toISOString(),
    updatedAt: allowance.updatedAt.toISOString(),
  };
};

export const readAllowances = async ({
  claimed = false,
  month,
  pagination,
  semester,
  studentId,
  year,
  yearLevel,
  includeStudent,
  office,
}: GetAllowanceArgs) => {
  let where: Prisma.AllowanceWhereInput = {};

  if (office) {
    where.student = {
      office: office,
    };
  }

  if (studentId) {
    where.studentId = studentId;
  }

  if (year) {
    where.year = year;
  }

  if (month) {
    where.month = month;
  }
  if (semester) {
    where.semester = semester;
  }
  if (yearLevel) {
    where.yearLevel = yearLevel;
  }
  if (claimed) {
    where.claimed = claimed;
  }

  const allowances = await prisma.allowance.findMany({
    where,
    take: pagination ? pagination.take : undefined,
    skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
    include: {
      student: includeStudent,
    },
  });

  const count = await prisma.allowance.count({
    where,
    take: pagination ? pagination.take : undefined,
    skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
  });

  const hasMore = pagination
    ? pagination.page * pagination.take < count
    : false;

  return {
    data: (allowances || []).map((allowance) => ({
      ...allowance,
      createdAt: allowance.createdAt.toISOString(),
      updatedAt: allowance.updatedAt.toISOString(),
    })),
    count,
    hasMore,
  };
};
