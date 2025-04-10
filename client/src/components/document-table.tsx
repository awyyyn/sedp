import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";

import { Document } from "@/types";
import { getFileExtension } from "@/lib/constant";
import { formatCurrency } from "@/lib/utils";
import { DeleteModal } from "@/pages/admin/__components";
import { DELETE_DOCUMENT_MUTATION } from "@/queries";
import { Link } from "react-router-dom";

export function DocumentTable({
	data,
	isLoading = false,
	handleRowClick,
	hasActions = false,
	showAmount = false,
}: {
	data: Document[];
	showAmount?: boolean;
	isLoading?: boolean;
	handleRowClick: (url: string) => void;
	hasActions?: boolean;
}) {
	const [deleteModal, setDeleteModal] = useState(false);
	const [toDelete, setToDelete] = useState<Document | null>(null);
	const [deleteDocument, { loading: deletingDocument }] = useMutation(
		DELETE_DOCUMENT_MUTATION
	);

	if (hasActions) {
		const handleDelete = async () => {
			try {
				if (!toDelete) return;
				await deleteDocument({
					variables: {
						id: toDelete.id,
					},
				});
				toast.success("Document deleted successfully", {
					description: "Document deleted successfully",
					position: "top-center",
					richColors: true,
				});
			} catch (err) {
				toast.error("Something went wrong!", {
					description: "Error deleting document",
					position: "top-center",
					richColors: true,
				});
			}
		};

		return (
			<>
				<Table
					removeWrapper
					className="pt-2"
					aria-label="Documents table"
					selectionMode="single">
					<TableHeader>
						<TableColumn>Name</TableColumn>
						<TableColumn>File Type</TableColumn>
						<TableColumn>Type</TableColumn>
						<TableColumn className={`${!showAmount && "hidden"}`}>
							Amount
						</TableColumn>
						<TableColumn className="text-center">Action</TableColumn>
					</TableHeader>
					<TableBody
						emptyContent="No documents found"
						loadingContent={<Spinner label="Loading..." />}
						isLoading={isLoading}>
						{data.map((doc) => {
							const exe = getFileExtension(doc.documentUrl);

							return (
								<TableRow
									onClick={() => {
										if (deletingDocument) return;
										handleRowClick(doc.documentUrl);
									}}
									className="cursor-pointer"
									key={doc.id}>
									<TableCell className="max-w-[120px] min-w-[120px]   ">
										<p className="truncate">{doc.documentName}</p>
									</TableCell>
									<TableCell>{exe?.toUpperCase()}</TableCell>
									<TableCell className="capitalize">
										{(doc.docType === "OTHER"
											? doc.otherType
											: doc.docType
										)?.toLowerCase()}
									</TableCell>
									<TableCell className={`${!showAmount && "hidden"}`}>
										{formatCurrency(doc.amount)}
									</TableCell>

									<TableCell className="flex items-center gap-2 justify-center">
										<Button
											isIconOnly
											size="sm"
											as={Link}
											to={`/my-documents/monthly/${doc.id}/edit`}
											state={{
												document: doc,
												month: doc.month,
												year: doc.year,
											}}
											isDisabled={deletingDocument}
											// variant="bordered"
											color="primary">
											<Icon
												icon="hugeicons:pencil-edit-02"
												width="16"
												height="16"
											/>
										</Button>
										<Button
											isIconOnly
											isDisabled={deletingDocument}
											size="sm"
											onPress={() => {
												setToDelete(doc);
												setDeleteModal(true);
											}}
											// variant="bordered"
											color="danger">
											<Icon icon="hugeicons:delete-01" width="16" height="16" />
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				{toDelete && (
					<DeleteModal
						handleDeletion={handleDelete}
						loading={false}
						open={deleteModal}
						setOpen={setDeleteModal}
						title="Delete Document"
						deleteLabel="Delete Document"
						description="Are you sure you want to delete this document? This action cannot be undone."
					/>
				)}
			</>
		);
	}

	return (
		<>
			<Table
				removeWrapper
				className="pt-2"
				aria-label="Documents table"
				selectionMode="single">
				<TableHeader>
					<TableColumn>Name</TableColumn>
					<TableColumn>File Type</TableColumn>
					<TableColumn>Type</TableColumn>
					<TableColumn className={`${!showAmount && "hidden"}`}>
						Amount
					</TableColumn>
				</TableHeader>
				<TableBody
					emptyContent="No documents found"
					loadingContent={<Spinner label="Loading..." />}
					isLoading={isLoading}>
					{data.map((doc) => {
						const exe = getFileExtension(doc.documentUrl);

						return (
							<TableRow
								onClick={() => handleRowClick(doc.documentUrl)}
								className="cursor-pointer"
								key={doc.id}>
								<TableCell>{doc.documentName}</TableCell>
								<TableCell>{exe?.toUpperCase()}</TableCell>
								<TableCell className="capitalize">
									{(doc.docType === "OTHER"
										? doc.otherType
										: doc.docType
									)?.toLowerCase()}
								</TableCell>
								<TableCell className={`${!showAmount && "hidden"}`}>
									{formatCurrency(doc.amount)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</>
	);
}
