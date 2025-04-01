import { useState } from "react";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatDate } from "date-fns";
import { useLazyQuery } from "@apollo/client";

import { FileTree } from "./__components/file-tree";

import { useAuth } from "@/contexts";
import { FileTreeItem } from "@/types";
import { READ_ANNOUNCEMENTS_QUERY } from "@/queries";

const semester = ["1st Semester", "2nd Semester", "3rd Semester"];

export const generateFolders = (date: string): FileTreeItem[] => {
	const currentYear = new Date(date).getFullYear();
	const items: FileTreeItem[] = [];

	for (let year = currentYear; year < currentYear + 5; year++) {
		items.push({
			id: year.toString(),
			name: `${year}-${year + 1}`,
			type: "folder",
			disabled: year > currentYear || year > 2025 + 1,
			children: semester.map((sem, index) => ({
				id: `${year}-${index + 1}`,
				name: sem,
				type: "file",
				children: [],
			})),
		});
	}

	return items;
};

export default function Semester() {
	const { studentUser } = useAuth();
	const [activeFileId, setActiveFileId] = useState<string>();

	const [fetchDocuments, { loading, error }] = useLazyQuery(
		READ_ANNOUNCEMENTS_QUERY
	);
	const handleFileSelect = (fileId: string) => {
		setActiveFileId(fileId);
	};

	return (
		<div className="px-5 container mx-auto md:px-0">
			<div className="">
				<div className="text-2xl font-semibold">Semester Documents</div>
				<div className="text-sm text-gray-500">
					Here you can view and manage your semester documents.
				</div>
			</div>

			<div className=" mt-5 relative">
				<div className="md:absolute relative px-2 md:top-0 md:left-0   md:w-[200px] md:max-w-[200px]">
					<h1>School Year </h1>
					<p className="text-sm mb-2 text-gray-500">
						Select a semester to view documents.{" "}
						{activeFileId && semester[Number(activeFileId.split("-")[1]) - 1]}
					</p>
					<FileTree
						activeFileId={activeFileId}
						onFileSelect={handleFileSelect}
						items={generateFolders(
							studentUser?.createdAt || new Date().toISOString()
						)}
					/>
				</div>
				<div className="md:ml-[210px] w-full md:w-[calc(100%-210px)]    mt-5 md:mt-0  ">
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
									{semester[Number(activeFileId.split("-")[1]) - 1]} of S.Y.{" "}
									{Number(activeFileId.split("-")[0])}-
									{Number(activeFileId.split("-")[0]) + 1}
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

									<Button color="primary" onPress={() => {}}>
										Upload Document
									</Button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
