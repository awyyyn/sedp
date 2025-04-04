import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { Dispatch, SetStateAction } from "react";

import { Allowance, Student } from "@/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { formatCurrency, formatDate } from "@/lib/utils";
import { months, semester, yearLevels } from "@/lib/constant";

interface ViewAllowanceModalProps {
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
	allowance: Allowance;
	student: Student;
	showStudentInfo?: boolean;
}

export default function ViewAllowanceModal({
	allowance,
	isOpen,
	onOpenChange,
	showStudentInfo = false,
	student,
}: ViewAllowanceModalProps) {
	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			size="2xl"
			onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex px-3 flex-col gap-1">
							{" "}
							<div className="flex justify-between items-center w-full">
								<h2 className="text-xl font-semibold">Allowance Details</h2>
								<Chip
									color={allowance.claimed ? "success" : "warning"}
									variant="flat"
									className="mr-8"
									startContent={
										<Icon
											icon={
												allowance.claimed
													? "lucide:check-circle"
													: "lucide:clock"
											}
											className="w-4 h-4"
										/>
									}>
									{allowance.claimed ? "Claimed" : "Pending"}
								</Chip>
							</div>
						</ModalHeader>
						<ModalBody className="px-6">
							{showStudentInfo && (
								<>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-default-500">Student Name</p>
											<p className="font-medium">
												{student.firstName} {student.lastName}
											</p>
										</div>
										<div>
											<p className="text-sm text-default-500">Email</p>
											<p className="font-medium">{student.email}</p>
										</div>
									</div>
									<Divider />
								</>
							)}

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
								<div>
									<p className="text-sm text-default-500">Year Level</p>
									<p className="font-medium">
										{yearLevels[allowance.yearLevel - 1]}
									</p>
								</div>
								<div>
									<p className="text-sm text-default-500">Year</p>
									<p className="font-medium">{allowance.year}</p>
								</div>
								<div>
									<p className="text-sm text-default-500">Month</p>
									<p className="font-medium">{months[allowance.month - 1]}</p>
								</div>
								<div>
									<p className="text-sm text-default-500">Semester</p>
									<p className="font-medium">
										{semester[allowance.semester - 1]}
									</p>
								</div>
							</div>

							<Divider className="my-4" />

							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-default-500">Monthly Allowance</p>
									<p className="font-medium">
										{formatCurrency(allowance.monthlyAllowance)}
									</p>
								</div>
								<div>
									<p className="text-sm text-default-500">Book Allowance</p>
									<p className="font-medium">
										{formatCurrency(allowance.bookAllowance)}
									</p>
								</div>
								<div>
									<p className="text-sm text-default-500">
										Miscellaneous Allowance
									</p>
									<p className="font-medium">
										{formatCurrency(allowance.miscellaneousAllowance)}
									</p>
								</div>
								<div>
									<p className="text-sm text-default-500">Thesis Allowance</p>
									<p className="font-medium">
										{formatCurrency(allowance.thesisAllowance)}
									</p>
								</div>
							</div>

							<Divider className="my-4" />

							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm text-default-500">Total Amount</p>
									<p className="text-xl font-semibold text-primary-600">
										{formatCurrency(allowance.totalAmount)}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm text-default-500">Claimed Date</p>
									<p className="font-medium">
										{allowance.claimedAt
											? formatDate(allowance.claimedAt)
											: "-"}
									</p>
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
	);
}
