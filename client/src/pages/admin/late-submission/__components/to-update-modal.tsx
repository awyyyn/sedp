import { useMutation } from "@apollo/client";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";

import {
  APPROVE_LATE_SUBMISSION_REQUEST_MUTATION,
  LATE_SUBMISSION_REQUESTS_QUERY,
} from "@/queries";
import { MonthlyLateSubmitter } from "@/types";
import { toast } from "sonner";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";

interface ToUpdateModalProps {
  approve: boolean;
  handleClose: () => void;
  request: MonthlyLateSubmitter | null;
}

export const ToUpdateModal = ({
  approve,
  handleClose,
  request,
}: ToUpdateModalProps) => {
  const { onClose, isOpen } = useDisclosure({
    isOpen: !!request,
    onClose: handleClose,
  });
  const [updateRequestMutation, { loading }] = useMutation(
    APPROVE_LATE_SUBMISSION_REQUEST_MUTATION,
  );
  const [openUntil, setOpenUntil] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!request) throw new Error("No request found");

    try {
      await updateRequestMutation({
        variables: {
          approve,
          requestId: request.id,
          openUntil,
        },
        refetchQueries: [LATE_SUBMISSION_REQUESTS_QUERY],
      });
      handleClose();
      toast.success(
        `Request has been ${approve ? "approved" : "denied"} successfully.`,
        {
          duration: 5000,
          richColors: true,
          position: "top-center",
        },
      );
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.", {
        description:
          (error as Error).message || "An unexpected error occurred.",
        duration: 5000,
        richColors: true,
        position: "top-center",
      });
    }
  };

  return (
    request && (
      <Modal
        isDismissable={!loading}
        isOpen={isOpen}
        onClose={!loading ? onClose : undefined}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {approve ? "Approve Request" : "Deny Request"}
              </ModalHeader>
              <ModalBody>
                <p className="">
                  <span className="font-thin">Reason for late submission:</span>{" "}
                  {request.reason}
                </p>
                <p className="font-thin">
                  Are you sure you want to {approve ? "approve" : "deny"} the
                  late submission request for{" "}
                  <span className="font-bold">
                    {request.student.firstName} {request.student.lastName}
                  </span>
                  ?
                </p>
                {approve && (
                  <Select
                    onSelectionChange={(val) => {
                      if (val.anchorKey) {
                        setOpenUntil(val.anchorKey);
                      }
                    }}
                    size="sm"
                    className=""
                    label="Open submission until:"
                  >
                    <SelectItem key="7d">1 Week</SelectItem>
                    <SelectItem key="14d">2 Week</SelectItem>
                    <SelectItem key="21d">3 Week</SelectItem>
                    <SelectItem key="1m">1 Month</SelectItem>
                  </Select>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  isDisabled={loading}
                  variant={approve ? "light" : "solid"}
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  isLoading={loading}
                  color={approve ? "primary" : "primary"}
                  onPress={handleSubmit}
                  variant={approve ? "solid" : "light"}
                >
                  {approve ? "Approve" : "Deny"} Request
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
  );
};
