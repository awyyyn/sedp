import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { formatDate, setMonth } from "date-fns";

import { AllowanceWithStudent } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import {
	READ_ALLOWANCES_QUERY,
	UPDATE_ALLOWANCE_STATUS_MUTATION,
} from "@/queries";

interface ClaimModalProps {
	allowance: AllowanceWithStudent;
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function ClaimModal({
	allowance,
	isOpen,
	onOpenChange,
}: ClaimModalProps) {
	const [confirmationText, setConfirmationText] = useState("");
	const [updateAllowanceClaim, { loading }] = useMutation(
		UPDATE_ALLOWANCE_STATUS_MUTATION
	);

	const handleConfirm = async () => {
		if (confirmationText !== "confirm") return;

		try {
			await updateAllowanceClaim({
				variables: {
					id: allowance.id,
					claimed: true,
				},
				refetchQueries: [READ_ALLOWANCES_QUERY],
			});

			onOpenChange(false);
			toast.success("Allowance claim confirmed", {
				description: "The allowance has been successfully claimed.",
				position: "top-center",
				richColors: true,
				duration: 5000,
			});
		} catch (error) {
			toast.error("Failed to confirm allowance claim", {
				description: "Please try again later.",
				position: "top-center",
				richColors: true,
				duration: 5000,
			});
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			size="sm"
			isDismissable={false}
			onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Confirm Allowance Claim
						</ModalHeader>
						<ModalBody>
							<p className="mb-4">
								You are about to confirm the allowance for the following
								student:
							</p>
							<div className="mb-4">
								<div className="flex items-center justify-between">
									<p>Student Name:</p>
									<p className="font-bold">
										{`${allowance.student.firstName} ${allowance.student.lastName}`}
									</p>
								</div>
								<div className="flex items-center justify-between">
									<p>Allowance Amount:</p>
									<p className="font-bold">
										{formatCurrency(allowance.totalAmount)}
									</p>
								</div>

								<div className="flex items-center justify-between">
									<p>Allowance Date:</p>
									<p className="font-bold">
										{formatDate(
											setMonth(new Date(), allowance.month - 1).setFullYear(
												allowance.year
											),
											"MMMM yyyy"
										)}
									</p>
								</div>
							</div>
							<p className="mb-2">
								To proceed, type <strong>confirm</strong> in the box below:
							</p>
							<Input
								placeholder="Type `confirm` to proceed"
								value={confirmationText}
								readOnly={loading}
								onChange={(e) => setConfirmationText(e.target.value)}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								disabled={loading}
								variant="light"
								onPress={onClose}>
								Cancel
							</Button>
							<Button
								color="primary"
								onPress={handleConfirm}
								isDisabled={loading || confirmationText !== "confirm"}>
								Confirm
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
