import { useMutation } from "@apollo/client";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Selection } from "@react-types/shared";
import { Dispatch, SetStateAction, useState } from "react";

import {
	READ_STUDENT_QUERY,
	READ_STUDENTS_QUERY,
	UPDATE_STUDENT_MUTATION,
} from "@/queries";
import { Student, StudentStatus } from "@/types";
import { toast } from "sonner";

interface UpdateStatusModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	data: Student;
}

const options = [
	{ key: "SCHOLAR", label: "Scholar" },
	{ key: "GRADUATED", label: "Graduated" },
	{ key: "DISQUALIFIED", label: "DISQUALIFIED" },
];

export default function UpdateStatusModal({
	isOpen,
	setIsOpen,
	data,
}: UpdateStatusModalProps) {
	const [confirm, setConfirm] = useState("");
	const [updateScholarStatus, { loading }] = useMutation(
		UPDATE_STUDENT_MUTATION,
		{
			refetchQueries: [READ_STUDENT_QUERY, READ_STUDENTS_QUERY],
		}
	);
	const [value, setValue] = useState<Selection>(new Set([]));

	const handleDeletion = async () => {
		try {
			console.log(Array.from(value)[0] as StudentStatus, "qqq");
			await updateScholarStatus({
				variables: {
					id: data.id,
					status: Array.from(value)[0] as StudentStatus,
				},
			});
			toast.success("Scholar status updated successfully", {
				description: "The scholar's status has been updated.",
				position: "top-center",
				richColors: true,
			});

			setIsOpen(false);
		} catch (erro) {
			console.log(erro, "qqq");
			toast.error("Failed to update scholar status", {
				description: "There was an error updating the scholar's status.",
				position: "top-center",
				richColors: true,
			});
		}
	};

	return (
		<>
			<Modal
				backdrop="opaque"
				classNames={{
					backdrop:
						"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
				}}
				isOpen={isOpen}
				onOpenChange={setIsOpen}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 pt-5">
								Update Scholar Status
							</ModalHeader>
							<ModalBody className="-mt-5">
								{/* {description && (
									<p className="text-sm text-zinc-500">{description}</p>
								)} */}
								<span className="text-sm">
									Type{" "}
									<Chip radius="sm" className="p-0 " size="sm">
										confirm
									</Chip>{" "}
									to continue
								</span>

								<Select
									selectedKeys={value}
									onSelectionChange={setValue}
									label="Update Status"
									placeholder="Select an status">
									{options.map((option, index) => (
										<SelectItem key={option.key} isDisabled={index === 0}>
											{option.label}
										</SelectItem>
									))}
								</Select>

								<span className="text-sm">
									Type{" "}
									<Chip radius="sm" className="p-0 " size="sm">
										confirm
									</Chip>{" "}
									to continue
								</span>
								<Input
									value={confirm}
									onValueChange={setConfirm}
									placeholder="Type here..."
									description="NOTE: Updating the scholar's status is irreversible and cannot be undone."
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									// isDisabled={loading}
									color="danger"
									onPress={onClose}>
									Close
								</Button>
								<Button
									isLoading={loading}
									color="success"
									isDisabled={
										confirm !== "confirm" || Array.from(value).length === 0
									}
									variant="light"
									onPress={handleDeletion}>
									Update
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
