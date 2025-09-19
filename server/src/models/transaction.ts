import { Transaction, Prisma } from "@prisma/client";
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
  transactedById,
}: TransactionPaginationArgs = {}): Promise<PaginationResult<Transaction>> => {
  let where: Prisma.TransactionWhereInput = {};

  if (action) where.action = action;

  if (entity) where.entity = entity;

  if (transactedById) where.transactedById = transactedById;

  const transactions = await prisma.transaction.findMany({
    where,
    take: pagination ? pagination.take : undefined,
    skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
  });

  const count = await prisma.transaction.count({ where });

  return {
    data: transactions,
    hasMore: pagination ? pagination.page * pagination.take < count : false,
    count,
  };
};
