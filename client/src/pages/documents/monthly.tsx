import { useState } from "react";
import { formatDate } from "date-fns";
import { useLazyQuery } from "@apollo/client";
import { Button } from "@heroui/button";

import { FileTree } from "./__components/file-tree";

import { READ_ANNOUNCEMENTS_QUERY } from "@/queries";
import { useAuth } from "@/contexts";
import { FileTreeItem } from "@/types";
import { Icon } from "@iconify/react/dist/iconify.js";

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

	const handleFileSelect = (fileId: string) => {
		setActiveFileId(fileId);
	};

	const [fetchDocuments, { loading, error }] = useLazyQuery(
		READ_ANNOUNCEMENTS_QUERY
	);

	return (
		<div className="px-5 container mx-auto md:px-0">
			<div className="">
				<div className="text-2xl font-semibold">Monthly Documents</div>
				<div className="text-sm text-gray-500">
					Here you can view and manage your monthly documents.
				</div>
			</div>

			<div className=" mt-5 relative">
				<div className="md:absolute relative px-2 md:top-0 md:left-0   md:w-[200px] md:max-w-[200px]">
					<h1>Folders </h1>
					<p className="text-sm mb-2 text-gray-500">
						Select a month to view documents.{" "}
						{formatDate(new Date(`${activeFileId}-01`), "MMM yyyy	")}
					</p>
					<FileTree
						activeFileId={activeFileId}
						onFileSelect={handleFileSelect}
						items={generateFolders(
							studentUser?.createdAt || new Date().toISOString()
						)}
					/>
				</div>
				<div className="md:ml-[210px] w-full md:w-[calc(100%-210px)]   mt-5 md:mt-0  ">
					{!activeFileId ? (
						<div className="flex items-center min-h-[calc(100dvh-50dvh)] justify-center w-full h-full">
							<p className="text-2xl font-semibold text-gray-500">
								Select a folder.
							</p>
						</div>
					) : loading ? (
						<div className="text-2xl font-semibold text-gray-500">
							Loading documents...
						</div>
					) : (
						<>
							<div className="sticky p-2 flex justify-between md:p-4 top-0 left-0 w-full h-full bg-primary  bg-opacity-5 backdrop-blur-md   z-10">
								<h1 className="text-2xl p-2 font-semibold text-gray-500">
									Documents for{" "}
									{formatDate(new Date(`${activeFileId}-01`), "MMMM yyyy")}
								</h1>
								<div className="flex flex-col md:flex-row gap-2">
									<Button className="" isIconOnly variant="light" radius="full">
										<Icon
											className={``}
											icon="solar:refresh-circle-linear"
											width="24"
											height="24"
										/>
									</Button>
									{`${currentYear}-${currentMonth}` === activeFileId && (
										<Button color="primary" onPress={() => {}}>
											Upload Document
										</Button>
									)}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
