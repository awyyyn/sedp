import { TransactionAction, TransactionEntity } from "@prisma/client";
import { GraphQLError } from "graphql";
import { readTransactions } from "../../models/index.js";

interface TransactionInput {
  entity?: TransactionEntity;
  action?: TransactionAction;
  transactedById?: string;
  pagination?: {
    take: number;
    page: number;
  };
}

export const transactionsResolver = async (
  _: never,
  { input }: { input: TransactionInput },
) => {
  try {
    return await readTransactions(input);
  } catch (err) {
    console.log(err);
    throw new GraphQLError(
      (err as GraphQLError)?.message || "Internal Server Error!",
    );
  }
};
