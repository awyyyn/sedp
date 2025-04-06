import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { useState } from "react";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { ViewAllowanceModal } from "./view-allowance-detail";

import { Allowance } from "@/types";
import { months } from "@/lib/constant";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts";

export function MonthsTable({
	data,
	isLoading = false,
}: {
	data: Allowance[];
	isLoading?: boolean;
}) {
	const [viewAllowanceModal, setViewAllowanceModal] = useState(false);
	const [viewAllowance, setViewAllowance] = useState<Allowance | null>(null);
	const { studentUser } = useAuth();

	return (
		<>
			<Table removeWrapper className="pt-2 px-0.5" aria-label="Documents table">
				<TableHeader>
					<TableColumn>Month</TableColumn>
					<TableColumn>Allowance</TableColumn>
					<TableColumn>Status</TableColumn>
					<TableColumn className="text-center">Actions</TableColumn>
				</TableHeader>
				<TableBody
					emptyContent="No documents found"
					loadingContent={<Spinner label="Loading..." />}
					isLoading={isLoading}>
					{data.map((allowance) => {
						return (
							<TableRow
								onClick={() => {}}
								className="cursor-pointer"
								key={allowance.id}>
								<TableCell>{months[allowance.month]}</TableCell>
								<TableCell>{formatCurrency(allowance.totalAmount)}</TableCell>
								<TableCell>
									<Chip
										className="text-white"
										color={allowance.claimed ? "success" : "primary"}>
										{allowance.claimed
											? "Claimed"
											: "Eligible to Claim Allowance"}
									</Chip>
								</TableCell>
								<TableCell className="flex justify-center">
									<Tooltip content="View Details">
										<Button
											isIconOnly
											size="sm"
											onPress={() => {
												setViewAllowance(allowance);
												setViewAllowanceModal(true);
											}}
											variant="light"
											className="  ">
											<Icon
												icon="material-symbols:info-rounded"
												width="16"
												height="16"
											/>
										</Button>
									</Tooltip>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			{studentUser && viewAllowance && (
				<ViewAllowanceModal
					allowance={viewAllowance}
					isOpen={viewAllowanceModal}
					onOpenChange={setViewAllowanceModal}
					student={studentUser}
				/>
			)}
		</>
	);
}
