import { sendSystemUserRegistrationMutation } from "@/queries";
import { SystemUserRole } from "@/types";
import { useMutation } from "@apollo/client";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import { useState } from "react";
import { toast } from "sonner";

interface SendRegistrationModalProps {
	type?: "user" | "admin";
}

export function SendRegistrationModal({
	type = "user",
}: SendRegistrationModalProps) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [values, setValues] = useState<{ email: string; role: SystemUserRole }>(
		{ email: "", role: "ADMIN_MANAGE_SCHOLAR" }
	);
	const [error, setError] = useState("");

	const [sendEmail, { loading }] = useMutation(
		sendSystemUserRegistrationMutation
	);

	const handleSubmit = async () => {
		try {
			await sendEmail({
				variables: values,
			});
			onClose();
			toast.success("Registration link sent successfully", {
				position: "top-center",
				richColors: true,
			});
		} catch (err) {
			setError((err as Error).message);
		}
	};

	return (
		<>
			<Button
				onPress={onOpen}
				className="bg-foreground text-background"
				// endContent={<PlusIcon />}
				size="md">
				Add {type === "user" ? "Student" : "System User"}
			</Button>
			{isOpen && (
				<Modal
					backdrop="opaque"
					classNames={{
						backdrop:
							"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
					}}
					isOpen={isOpen}
					onOpenChange={onOpenChange}>
					<ModalContent className="">
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1 pt-5">
									Send Registration Link
								</ModalHeader>
								<ModalBody className="-mt-5">
									<p className="text-sm text-zinc-500">
										Please enter the email address of the user you would like to
										send the registration link to. They will receive an email
										with instructions on how to complete their registration.
									</p>
									<Input
										className=""
										radius="sm"
										placeholder="Email Address"
										type="email"
										value={values.email}
										isInvalid={!!error}
										errorMessage={error}
										onValueChange={(value) => {
											setValues({ ...values, email: value });
											if (
												!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
											) {
												setError("Invalid email address");
											} else if (value === "") {
												setError("Email address is required");
											} else {
												setError("");
											}
										}}
									/>
									<div className="flex gap-2">
										<Checkbox
											size="sm"
											name="type"
											isSelected={values.role === "SUPER_ADMIN"}
											onValueChange={() => {
												setValues({ ...values, role: "SUPER_ADMIN" });
											}}>
											Full Access
										</Checkbox>
										<Checkbox
											size="sm"
											name="type"
											isSelected={values.role === "ADMIN_MANAGE_SCHOLAR"}
											onValueChange={() =>
												setValues({ ...values, role: "ADMIN_MANAGE_SCHOLAR" })
											}>
											 Manage Scholars
										</Checkbox>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
										Close
									</Button>
									<Button
										isDisabled={values.email === "" || !!error}
										isLoading={loading}
										color="primary"
										onPress={handleSubmit}>
										{loading ? "Sending..." : "Send Registration Link"}
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			)}
		</>
	);
}
