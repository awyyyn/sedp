import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { useState } from "react";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { ViewAllowanceModal } from "./view-allowance-detail";

import { Allowance, Student } from "@/types";
import { months } from "@/lib/constant";
import { formatCurrency } from "@/lib/utils";

export function MonthsTable({
  data,
  isLoading = false,
  studentUser,
}: {
  data: Allowance[];
  isLoading?: boolean;
  studentUser: Student;
}) {
  const [viewAllowanceModal, setViewAllowanceModal] = useState(false);
  const [viewAllowance, setViewAllowance] = useState<Allowance | null>(null);

  const allowanceData = [...(data || [])].sort((a, b) => a.month - b.month);

  return (
    <>
      <Table removeWrapper className="pt-2 px-0.5" aria-label="Documents table">
        <TableHeader>
          <TableColumn>Month</TableColumn>
          <TableColumn>Allowance</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn className="text-center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent="No documents found"
          loadingContent={<Spinner label="Loading..." />}
          isLoading={isLoading}
        >
          {(allowanceData || []).map((allowance) => {
            return (
              <TableRow
                onClick={() => {}}
                className="cursor-pointer"
                key={allowance.id}
              >
                <TableCell>{months[allowance.month - 1]}</TableCell>
                <TableCell>{formatCurrency(allowance.totalAmount)}</TableCell>
                <TableCell>
                  <Chip
                    className="text-white"
                    color={allowance.claimed ? "success" : "primary"}
                  >
                    {allowance.claimed
                      ? "Claimed"
                      : "Eligible to Claim Allowance"}
                  </Chip>
                </TableCell>
                <TableCell className="flex justify-center">
                  <Tooltip content="View Details">
                    <Button
                      isIconOnly
                      size="sm"
                      onPress={() => {
                        setViewAllowance(allowance);
                        setViewAllowanceModal(true);
                      }}
                      variant="light"
                      className="  "
                    >
                      <Icon
                        icon="material-symbols:info-rounded"
                        width="16"
                        height="16"
                      />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {studentUser && viewAllowance && (
        <ViewAllowanceModal
          allowance={viewAllowance}
          isOpen={viewAllowanceModal}
          onOpenChange={setViewAllowanceModal}
          student={studentUser}
        />
      )}
    </>
  );
}
