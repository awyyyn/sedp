import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useSetAtom } from "jotai";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";

import { Student } from "@/types";
import { scholarsSentNotificationsAtom } from "@/states";
import { CREATE_SCHOLAR_NOTIFICATION_MUTATION } from "@/queries";

interface SendNotifModalProps {
  isOpen: boolean;
  handleClose: VoidFunction;
  student: Student;
}

export const SendNotifModal = ({
  isOpen,
  handleClose,
  student,
}: SendNotifModalProps) => {
  const setSentNotifications = useSetAtom(scholarsSentNotificationsAtom);
  const [sendNotification, { loading }] = useMutation(
    CREATE_SCHOLAR_NOTIFICATION_MUTATION,
  );
  const { onClose } = useDisclosure({
    isOpen,
    onClose: handleClose,
  });

  const handleSubmit = async () => {
    try {
      await sendNotification({
        variables: {
          type: "OTHER",
          title: "Submission Reminder",
          message: `Please remember to submit your requirements for the month of ${new Date().toLocaleString("default", { month: "long" })}.`,
          link: `/my-documents/monthly?active=${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
          receiverId: student.id,
        },
      });

      setSentNotifications((prev) => [...prev, student.id]);
      handleClose();
      toast.success("Notification sent successfully", {
        description: `A submission notification has been sent to ${student.firstName} ${student.lastName}.`,
        duration: 5000,
        richColors: true,
        position: "top-center",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to send notification", {
        description:
          (error as Error).message || "An unexpected error occurred.",
        duration: 5000,
        richColors: true,
        position: "top-center",
      });
    }
  };

  return (
    student && (
      <Modal
        isDismissable={!loading}
        isOpen={isOpen}
        onClose={!loading ? onClose : undefined}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Send a submission notification
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to send a submission notification to{" "}
                  <span className="font-bold">
                    {student.firstName} {student.lastName}
                  </span>
                  ?
                </p>
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
                  Send Notification
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
  );
};
