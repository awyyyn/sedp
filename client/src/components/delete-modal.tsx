import { Dispatch, SetStateAction, useState } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";

import { deleteSystemUserMutation } from "@/queries";
interface DeleteModalProps {
	type?: "scholar" | "system-user";
	isOpen: boolean;
	setState: Dispatch<SetStateAction<boolean>>;
	email: string;
	id: string;
	setSystemUsersState: (id: string) => void;
}

export default function DeleteModal({
	type = "system-user",
	setSystemUsersState,
	isOpen,
	setState,
	email,
	id,
}: DeleteModalProps) {
	const [emailConfirmation, setEmailConfirmation] = useState("");
	const [deleteUser, { loading }] = useMutation(deleteSystemUserMutation, {
		refetchQueries: [],
	});

	const handleSubmit = async () => {
		try {
			await deleteUser({ variables: { id } });
			setSystemUsersState(id);
			toast.success("Deleted Successfully", {
				position: "top-center",
				richColors: true,
			});
			setState(false);
		} catch (error) {
			toast.error((error as Error).message, {
				position: "top-center",
				richColors: true,
			});
		}
	};

	return (
		<Modal
			backdrop="opaque"
			classNames={{
				backdrop:
					"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
			}}
			isOpen={isOpen}
			onOpenChange={setState}>
			<ModalContent className="">
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 pt-5">
							Confirm Deletion
						</ModalHeader>
						<ModalBody className="-mt-5">
							<p className="text-sm text-zinc-500">
								Are you sure you want to delete this system user? This action
								cannot be undone.
							</p>
							<span className="text-sm">
								Type{" "}
								<Chip radius="sm" className="p-0 " size="sm">
									{email}
								</Chip>{" "}
								to confirm
							</span>
							<Input
								value={emailConfirmation}
								onValueChange={setEmailConfirmation}
								placeholder="Type here..."
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<Button
								isDisabled={emailConfirmation !== email || !emailConfirmation}
								isLoading={loading}
								color="primary"
								onPress={handleSubmit}>
								{!loading
									? type === "scholar"
										? "Delete Scholar"
										: "Delete System User"
									: "Deleting..."}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
