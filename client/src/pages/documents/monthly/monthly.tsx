import { useState } from "react";
import { formatDate } from "date-fns";
import { useLazyQuery } from "@apollo/client";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

import { FileTree } from "../__components/file-tree";
import DocumentTable from "../__components/table";

import { READ_DOCUMENTS_QUERY } from "@/queries";
import { useAuth } from "@/contexts";
import { Document, FileTreeItem } from "@/types";
import { PreviewModal } from "@/components";
import { getFileExtension, imagesExtensions } from "@/lib/constant";

export const generateFolders = (date: string): FileTreeItem[] => {
	const currentYear = new Date(date).getFullYear();
	const items: FileTreeItem[] = [];

	// Create the month folders dynamically
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	for (let year = currentYear; year < currentYear + 5; year++) {
		items.push({
			id: year.toString(),
			name: `${year}`,
			type: "folder",
			disabled: year > currentYear,
			children: months.map((month, index) => ({
				id: `${year}-${index + 1}`,
				name: month,
				type: "file",
				children: [],
			})),
		});
	}

	return items;
};

export default function Monthly() {
	const { studentUser } = useAuth();
	const [activeFileId, setActiveFileId] = useState<string>();
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
	const [data, setData] = useState<Document[]>([]);
	const [fetchDocuments, { loading, error }] =
		useLazyQuery(READ_DOCUMENTS_QUERY);
	const [previewModal, onPreviewModalChange] = useState(false);
	const [toPreview, setToPreview] = useState<string | null>(null);

	const handleFileSelect = async (fileId: string) => {
		setActiveFileId(fileId);
		const { data } = await fetchDocuments({
			variables: {
				month: Number(fileId.split("-")[1]),
				year: Number(fileId.split("-")[0]),
			},
		});

		setData(data.documents || []);
	};

	return (
		<>
			<div className="px-5 container mx-auto md:px-0">
				<div className="">
					<div className="text-2xl font-semibold">Monthly Documents</div>
					<div className="text-sm text-gray-500">
						Here you can view and manage your monthly documents.
					</div>
				</div>

				<div className=" mt-5 max-h-[calc(100dvh-35dvh)]   overflow-y-auto relative md:flex">
					<div className="md:sticky overflow-auto  relative px-2 md:top-0 md:left-0   md:w-[200px] md:max-w-[200px]">
						<div className="sticky z-20 py-2 bg-white/5 scroll-py-32 top-0 backdrop-blur-md">
							<h1>Folders </h1>
							<p className="text-sm mb-2 text-gray-500">
								Select a month to view documents.{" "}
								{formatDate(new Date(`${activeFileId}-01`), "MMM yyyy	")}
							</p>
						</div>
						<FileTree
							activeFileId={activeFileId}
							onFileSelect={handleFileSelect}
							items={generateFolders(
								studentUser?.createdAt || new Date().toISOString()
							)}
						/>
					</div>
					<div className="md:ml-[s210px] max-h-[80px] relative w-full md:w-[calc(100%-210px)]   mt-5 md:mt-0  ">
						{!activeFileId ? (
							<div className="flex items-center min-h-[calc(100dvh-50dvh)] justify-center w-full h-full">
								<p className="text-2xl font-semibold text-gray-500">
									Select a folder.
								</p>
							</div>
						) : error ? (
							<div className="text-2xl font-semibold text-gray-500">
								Error fetching documents.
							</div>
						) : (
							<>
								<div className="sticky p-2 flex justify-between md:p-4 top-0 left-0 w-full h-full bg-primary  bg-opacity-5 backdrop-blur-md   z-10">
									<h1 className="text-2xl p-2 font-semibold text-gray-500">
										Documents for{" "}
										{formatDate(new Date(`${activeFileId}-01`), "MMMM yyyy")}
									</h1>
									<div className="flex flex-col md:flex-row gap-2">
										<Button
											className=""
											isIconOnly
											variant="light"
											radius="full">
											<Icon
												className={``}
												icon="solar:refresh-circle-linear"
												width="24"
												height="24"
											/>
										</Button>
										{`${currentYear}-${currentMonth}` === activeFileId && (
											<Button
												as={Link}
												to={`/my-documents/monthly/upload`}
												color="primary"
												state={{
													month: activeFileId.split("-")[1],
													year: activeFileId.split("-")[0],
												}}>
												Upload Document
											</Button>
										)}
									</div>
								</div>
								<div>
									<DocumentTable
										handleRowClick={(url) => {
											onPreviewModalChange(true);
											setToPreview(url);
										}}
										hasActions={
											`${currentYear}-${currentMonth}` === activeFileId
										}
										data={data || []}
										isLoading={loading}
									/>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			{toPreview && (
				<PreviewModal
					src={toPreview}
					type={
						imagesExtensions.includes(getFileExtension(toPreview) || "png")
							? `image`
							: "document"
					}
					isOpen={previewModal}
					onOpenChange={onPreviewModalChange}
				/>
			)}
		</>
	);
}
