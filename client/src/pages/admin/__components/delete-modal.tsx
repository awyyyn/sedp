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
import { Dispatch, SetStateAction, useState } from "react";

interface DeleteModalProps {
	open: boolean;
	title: string;
	description?: string;
	handleDeletion: VoidFunction;
	loading: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	deleteLabel?: string;
	hideNote: boolean;
}

export function DeleteModal({
	open,
	setOpen,
	title,
	description,
	handleDeletion,
	loading,
	deleteLabel = "Delete",
	hideNote = false,
}: DeleteModalProps) {
	const [confirm, setConfirm] = useState("");

	return (
		<>
			<Modal
				backdrop="opaque"
				classNames={{
					backdrop:
						"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
				}}
				isOpen={open}
				onOpenChange={setOpen}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 pt-5">
								{title}
							</ModalHeader>
							<ModalBody className="-mt-5">
								{description && (
									<p className="text-sm text-zinc-500">{description}</p>
								)}
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
									placeholder="Type 'confirm' here..."
									description={
										!hideNote &&
										"NOTE: Deleting this data is a permanent action and cannot be undone."
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button isDisabled={loading} color="danger" onPress={onClose}>
									Close
								</Button>
								<Button
									isLoading={loading}
									isDisabled={confirm !== "confirm"}
									variant="light"
									onPress={handleDeletion}>
									{deleteLabel}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
