import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Chip } from "@heroui/chip";
import { format, formatDate } from "date-fns";

import { Transaction } from "@/types";
import {
  formatCurrency,
  formatEventDate,
  formatEventTime,
  getRoleDescription,
} from "@/lib/utils";

interface TransactionDataModalProps {
  isOpen: boolean;
  handleClose: VoidFunction;
  transaction: Transaction;
}

export const TransactionDataModal = ({
  isOpen,
  handleClose,
  transaction,
}: TransactionDataModalProps) => {
  const { onClose } = useDisclosure({
    isOpen,
    onClose: handleClose,
  });

  const renderEntityContent = () => {
    switch (transaction.entity) {
      case "ALLOWANCE":
        if (!transaction.allowance)
          return <p>No allowance details available</p>;

        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Allowance Details</h3>
              <Chip
                color={transaction.allowance.claimed ? "success" : "warning"}
                variant="flat"
              >
                {transaction.allowance.claimed ? "Claimed" : "Unclaimed"}
              </Chip>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {transaction.allowance.totalAmount && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:credit-card" className="text-primary" />
                  <span className="text-sm text-default-600">
                    Total Amount:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(transaction.allowance.totalAmount)}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {transaction.allowance.monthlyAllowance ? (
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:calendar" className="text-primary" />
                    <span className="text-sm text-default-600">Monthly:</span>
                    <span className="font-medium">
                      {formatCurrency(transaction.allowance.monthlyAllowance)}
                    </span>
                  </div>
                ) : null}

                {transaction.allowance.bookAllowance ? (
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:book" className="text-primary" />
                    <span className="text-sm text-default-600">Books:</span>
                    <span className="font-medium">
                      {formatCurrency(transaction.allowance.bookAllowance)}
                    </span>
                  </div>
                ) : null}

                {transaction.allowance.miscellaneousAllowance ? (
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:list" className="text-primary" />
                    <span className="text-sm text-default-600">Misc:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        transaction.allowance.miscellaneousAllowance,
                      )}
                    </span>
                  </div>
                ) : null}

                {transaction.allowance.thesisAllowance ? (
                  <div className="flex items-center justify-between ">
                    <Icon icon="lucide:file-text" className="text-primary" />
                    <span className="text-sm text-default-600">Thesis:</span>
                    <span className="font-medium">
                      {formatCurrency(transaction.allowance.thesisAllowance)}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Icon icon="lucide:calendar" className="text-primary" />
                <span className="text-sm text-default-600">Period:</span>
                <span className="font-medium">
                  {transaction.allowance.month &&
                    `${format(new Date().setMonth(transaction.allowance.month - 1), "MMMM")}`}
                  {transaction.allowance.year &&
                    `, ${transaction.allowance.year}`}
                  {transaction.allowance.semester &&
                    `, Semester ${transaction.allowance.semester}`}
                </span>
              </div>

              {transaction.allowance.claimedAt && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle" className="text-primary" />
                  <span className="text-sm text-default-600">Claimed At:</span>
                  <span className="font-medium">
                    {formatDate(transaction.allowance.claimedAt, "PPpp")}
                  </span>
                </div>
              )}

              {transaction.allowance.student && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:user" className="text-primary" />
                  <span className="text-sm text-default-600">Student:</span>
                  <span className="font-medium">
                    {transaction.allowance.student.firstName}{" "}
                    {transaction.allowance.student.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "MEETING":
        if (!transaction.meeting) return <p>No meeting details available</p>;

        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              {transaction.meeting.title}
            </h3>
            {transaction.meeting.description && (
              <p className="text-default-600">
                {transaction.meeting.description}
              </p>
            )}
            <div className="grid grid-cols-1 gap-2">
              {transaction.meeting.date && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:calendar" className="text-primary" />
                  <span className="text-sm text-default-600">Date:</span>
                  <span className="font-medium">
                    {formatDate(transaction.meeting.date, "PPP")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Icon icon="lucide:clock" className="text-primary" />
                <span className="text-sm text-default-600">Time:</span>
                <span className="font-medium">
                  {formatEventTime(
                    transaction.meeting.startTime,
                    transaction.meeting.endTime,
                  )}
                </span>
              </div>
              {transaction.meeting.location && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:map-pin" className="text-primary" />
                  <span className="text-sm text-default-600">Location:</span>
                  <span className="font-medium">
                    {transaction.meeting.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "LATE_SUBMISSION":
        if (!transaction.lateSubmission)
          return <p>No late submission details available</p>;

        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Late Submission</h3>
              <Chip
                color={
                  transaction.lateSubmission.isApproved
                    ? "success"
                    : transaction.lateSubmission.isApproved === false
                      ? "danger"
                      : "warning"
                }
                variant="flat"
              >
                {transaction.lateSubmission.isApproved
                  ? "Approved"
                  : transaction.lateSubmission.isApproved === false
                    ? "Rejected"
                    : "Pending"}
              </Chip>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:calendar" className="text-primary" />
                <span className="text-sm text-default-600">Period:</span>
                <span className="font-medium">
                  Month{" "}
                  {format(
                    new Date().setMonth(transaction.lateSubmission.month - 1),
                    "MMMM",
                  )}
                  , Year {transaction.lateSubmission.year}
                </span>
              </div>

              {transaction.lateSubmission.reason && (
                <div className="flex items-start gap-2">
                  <Icon icon="lucide:file-text" className="text-primary mt-1" />
                  <div>
                    <span className="text-sm text-default-600">Reason:</span>
                    <p className="mt-1">{transaction.lateSubmission.reason}</p>
                  </div>
                </div>
              )}

              {transaction.lateSubmission.openUntil && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:calendar-clock" className="text-primary" />
                  <span className="text-sm text-default-600">Open Until:</span>
                  <span className="font-medium">
                    {formatDate(transaction.lateSubmission.openUntil, "PPpp")}
                  </span>
                </div>
              )}

              {transaction.lateSubmission.updatedOn && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:refresh-cw" className="text-primary" />
                  <span className="text-sm text-default-600">
                    Last Updated:
                  </span>
                  <span className="font-medium">
                    {formatDate(transaction.lateSubmission.updatedOn, "PPpp")}
                  </span>
                </div>
              )}

              {transaction.lateSubmission.student && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:user" className="text-primary" />
                  <span className="text-sm text-default-600">Student:</span>
                  <span className="font-medium">
                    {transaction.lateSubmission.student.firstName}{" "}
                    {transaction.lateSubmission.student.lastName}
                  </span>
                </div>
              )}

              {transaction.lateSubmission.updatedBy && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:user-check" className="text-primary" />
                  <span className="text-sm text-default-600">Updated By:</span>
                  <span className="font-medium">
                    {transaction.lateSubmission.updatedBy.firstName}{" "}
                    {transaction.lateSubmission.updatedBy.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "EVENT":
        if (!transaction.event) return <p>No event details available</p>;

        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{transaction.event.title}</h3>
            {transaction.event.description && (
              <p className="text-default-600">
                {transaction.event.description}
              </p>
            )}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:calendar-range" className="text-primary" />
                <span className="text-sm text-default-600">Date:</span>
                <span className="font-medium">
                  {formatEventDate(
                    transaction.event.startDate,
                    transaction.event.endDate,
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:clock" className="text-primary" />
                <span className="text-sm text-default-600">Time:</span>
                <span className="font-medium">
                  {formatEventTime(
                    transaction.event.startTime,
                    transaction.event.endTime,
                  )}
                </span>
              </div>
              {transaction.event.location && (
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:map-pin" className="text-primary" />
                  <span className="text-sm text-default-600">Location:</span>
                  <span className="font-medium">
                    {transaction.event.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "ANNOUNCEMENT":
        if (!transaction.announcement)
          return <p>No announcement details available</p>;

        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              {transaction.announcement.title}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:calendar" className="text-primary" />
                <span className="text-sm text-default-600">Published:</span>
                <span className="font-medium">
                  {formatDate(transaction.announcement.createdAt, "PPpp")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="lucide:user" className="text-primary" />
                <span className="text-sm text-default-600">Created By:</span>
                <span className="font-medium">
                  {transaction.announcement.createdBy.firstName}{" "}
                  {transaction.announcement.createdBy.lastName}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Icon icon="lucide:file-text" className="text-primary mt-1" />
                <div>
                  <span className="text-sm text-default-600">Content:</span>
                  <p className="mt-1">{transaction.announcement.content}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <p>No entity details available</p>;
    }
  };

  // Get appropriate icon based on entity type
  const getEntityIcon = () => {
    switch (transaction.entity) {
      case "ALLOWANCE":
        return "lucide:wallet";
      case "MEETING":
        return "lucide:calendar-clock";
      case "LATE_SUBMISSION":
        return "lucide:alert-circle";
      case "EVENT":
        return "lucide:calendar-heart";
      case "ANNOUNCEMENT":
        return "lucide:megaphone";
      default:
        return "lucide:file";
    }
  };

  return (
    transaction && (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-3 ">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                  <Icon
                    icon={getEntityIcon()}
                    className="text-primary-500 text-xl"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-md">Transaction </p>
                  <p className="text-small text-default-500">
                    {formatDate(transaction.createdAt, "PPpp")} •{" "}
                    {transaction.action} {transaction.entity.replace("_", " ")}
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {renderEntityContent()}
                <div className="mt-4 pt-4 border-t border-divider">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:user-check"
                      className="text-default-500"
                    />
                    <span className="text-sm text-default-500">
                      Processed by:
                    </span>
                    <span className="text-sm">
                      {transaction.transactedBy.firstName}{" "}
                      {transaction.transactedBy.lastName} (
                      {getRoleDescription(transaction.transactedBy.role)})
                    </span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
  );
};
