import { TransactionEntityActionColorMap } from "@/constants";
import { Transaction } from "@/types";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatDate, formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <Card>
      <CardBody className="p-5">
        <div className="">
          <h1 className="leading-5 text-lg font-semibold">
            Recent Transactions
          </h1>
          <p className="text-gray-400">Latest system activities and changes</p>
        </div>

        <div className="space-y-5 mt-5">
          {transactions?.length > 0 ? (
            <>
              {transactions?.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-start gap-2 p-5 border rounded-2xl"
                >
                  <div>
                    <Avatar
                      name={`${tx.transactedBy.firstName.charAt(0)}${tx.transactedBy.lastName.charAt(0)}`}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex gap-2">
                      <Chip
                        size="sm"
                        className="text-white rounded-lg"
                        color={TransactionEntityActionColorMap[tx.action]}
                      >
                        {tx.action}
                      </Chip>
                      <Chip
                        variant="bordered"
                        size="sm"
                        className="rounded-lg   border-1"
                        color={TransactionEntityActionColorMap[tx.action]}
                      >
                        {tx.entity}
                      </Chip>
                    </div>
                    <p className="text-sm">{tx.description}</p>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span>by {tx.transactedBy.firstName}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(tx.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                as={Link}
                variant="light"
                to="/admin/transactions"
                className="w-full"
              >
                <Icon
                  icon="tabler:align-box-left-middle-filled"
                  width="20"
                  height="20"
                />
                View All Transactions
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
