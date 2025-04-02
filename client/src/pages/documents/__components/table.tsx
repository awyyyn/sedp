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

import { Document } from "@/types";
import { getFileExtension } from "@/lib/constant";

export default function DocumentTable({
	data,
	isLoading = false,
	handleRowClick,
	hasActions = false,
}: {
	data: Document[];
	isLoading?: boolean;
	handleRowClick: (url: string) => void;
	hasActions?: boolean;
}) {
	if (hasActions) {
		return (
			<Table
				removeWrapper
				className="pt-2"
				aria-label="Documents table"
				selectionMode="single">
				<TableHeader>
					<TableColumn>Name</TableColumn>
					<TableColumn>File Type</TableColumn>
					<TableColumn>Type</TableColumn>
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

								<TableCell className="flex items-center gap-2 justify-center">
									<Button
										isIconOnly
										size="sm"
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
										size="sm"
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
		);
	}

	return (
		<Table
			removeWrapper
			className="pt-2"
			aria-label="Documents table"
			selectionMode="single">
			<TableHeader>
				<TableColumn>Name</TableColumn>
				<TableColumn>File Type</TableColumn>
				<TableColumn>Type</TableColumn>
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
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
