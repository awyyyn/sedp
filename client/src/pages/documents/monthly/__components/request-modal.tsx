import { useMutation } from "@apollo/client";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { formatDate } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

import { LATE_SUBMISSION_REQUEST_MUTATION } from "@/queries";

interface RequestModalProps {
  data: {
    year: number;
    month: number;
  } | null;
  onClose: () => void;
}

export const RequestModal = ({
  data,
  onClose: handleClose,
}: RequestModalProps) => {
  const { onClose, isOpen } = useDisclosure({
    isOpen: !!data,
    onClose: handleClose,
  });
  const [reason, setReason] = useState("");
  const [requestLateSubmission, { loading }] = useMutation(
    LATE_SUBMISSION_REQUEST_MUTATION,
  );

  const handleSubmit = async () => {
    if (!data) return;

    try {
      await requestLateSubmission({
        variables: {
          month: data.month,
          year: data.year,
          reason: reason.trim() || "",
        },
      });
      toast.success("Late submission requested successfully.", {
        duration: 5000,
        position: "top-right",
        description: "Your request has been submitted.",
        richColors: true,
      });
      onClose();
    } catch (error) {
      toast.error("Failed to request late submission. Please try again.", {
        duration: 5000,
        position: "top-right",
        description:
          (error as Error).message || "An unexpected error occurred.",
      });
    }
  };

  return (
    data && (
      <Modal
        isDismissable={!loading}
        isOpen={isOpen}
        onClose={!loading ? onClose : undefined}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Request Late Submission
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <p>
                    Are you sure you want to request for late submission for{" "}
                    {formatDate(
                      new Date().setFullYear(data.year, data.month - 1),
                      "MMMM yyyy",
                    )}
                  </p>

                  <Textarea
                    isClearable
                    label="Reason"
                    placeholder="Reason for late submission..."
                    variant="bordered"
                    color="primary"
                    value={reason}
                    onValueChange={setReason}
                    onClear={() => setReason("")}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  isDisabled={loading}
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  isLoading={loading}
                  color="primary"
                  onPress={handleSubmit}
                >
                  Request
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
  );
};
