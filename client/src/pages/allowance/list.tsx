import { useEffect, useState } from "react";
import { formatDate } from "date-fns";
import { useQuery } from "@apollo/client";
import { Button } from "@heroui/button";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Helmet } from "react-helmet";

import ErrorFetching from "../documents/__components/error-fetch";

import { READ_ALLOWANCES_QUERY } from "@/queries";
import { useAuth } from "@/contexts";
import { Allowance, FileTreeItem, PaginationResult } from "@/types";
import { PreviewModal, FileTree, MonthsTable } from "@/components";
import { getFileExtension, imagesExtensions } from "@/lib/constant";

export const generateFolders = (
	date: string,
	yearLevelJoined: number
): FileTreeItem[] => {
	const selectedYear = new Date(date).getFullYear();
	const currentYear = new Date().getFullYear();
	const items: FileTreeItem[] = [];

	let plusYear = 0;
	let yearLevel = yearLevelJoined;

	if (yearLevel === 1) {
		plusYear = 5;
	} else if (yearLevel === 2) {
		plusYear = 4;
	} else if (yearLevel === 3) {
		plusYear = 3;
	} else if (yearLevel === 4) {
		plusYear = 2;
	} else if (yearLevel === 5) {
		plusYear = 1;
	}

	for (let year = selectedYear; year < selectedYear + plusYear; year++) {
		items.push({
			id: year.toString(),
			name: `${year}`,
			type: "file",
			disabled: year > currentYear,
		});
	}

	return items;
};

export default function MyAllowanceList() {
	const [searchParams] = useSearchParams();
	const { studentUser } = useAuth();
	const qYear = searchParams.get("year");

	const [activeFileId, setActiveFileId] = useState<string>(qYear || "");
	const { loading, error, refetch, data } = useQuery<{
		allowances: PaginationResult<Allowance>;
	}>(READ_ALLOWANCES_QUERY, {
		variables: {
			year: Number(activeFileId),
		},
	});
	const [previewModal, onPreviewModalChange] = useState(false);
	const [toPreview] = useState<string | null>(null);

	const handleFileSelect = async (fileId: string) => {
		setActiveFileId(fileId);
	};

	useEffect(() => {
		(async () => {
			if (qYear) {
				setActiveFileId(qYear);
			}
		})();
	}, [qYear]);

	const handleRefetch = async () => {
		await refetch({
			variables: {
				year: Number(activeFileId),
			},
		});
	};

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Scholar Allowance List | SEDP</title>
				<meta
					name="description"
					content="View and manage your scholar allowances for the SEDP scholarship program."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<div className="px-5 container mx-auto md:px-0 max-h-screen pt-24 overflow-hidden">
				<div className="">
					<div className="text-2xl font-semibold">Scholar Allowance List</div>
					<div className="text-sm text-gray-500">
						Here you can view and manage your scholar allowances.
					</div>
				</div>

				<div className=" mt-5 max-h-[calc(100dvh-5dvh)]     overflow-y-auto relative md:flex">
					<div className="md:sticky overflow-auto  relative px-2 md:top-0 md:left-0   md:w-[200px] md:max-w-[200px]">
						<div className="sticky z-20 py-2 bg-white/5 scroll-py-32 top-0 backdrop-blur-md">
							<h1>Folders </h1>
							<p className="text-sm mb-2 text-gray-500">
								Select a year to view allowances.{" "}
								{formatDate(new Date(`${activeFileId}-01`), "yyyy")}
							</p>
						</div>
						<FileTree
							activeFileId={activeFileId}
							onFileSelect={handleFileSelect}
							items={generateFolders(
								studentUser?.createdAt || new Date().toISOString(),
								studentUser?.yearLevelJoined!
							)}
						/>
					</div>
					<div className="md:ml-[s210px] relative w-full md:w-[calc(100%-210px)]   mt-5 md:mt-0  overflow-hidden ">
						{!activeFileId ? (
							<div className="flex items-center min-h-[calc(100dvh-50dvh)] justify-center w-full h-full">
								<p className="text-2xl font-semibold text-gray-500">
									Select a folder.
								</p>
							</div>
						) : error ? (
							<ErrorFetching handleRefetch={handleRefetch} />
						) : (
							<>
								<div className="absolute p-2 flex max-h-[80px] justify-between md:p-4 top-0 left-0 w-full  bg-primary  bg-opacity-5 backdrop-blur-md   z-10">
									<h1 className="text-lg  md:text-2xl md:p-2 font-semibold text-gray-500">
										Allowances for{" "}
										{formatDate(new Date(`${activeFileId}-01`), "yyyy")}
									</h1>
									<div className="flex flex-col items-end md:flex-row gap-2">
										<Button
											className={`${loading ? "animate-spin" : ""}`}
											isDisabled={loading}
											onPress={handleRefetch}
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
									</div>
								</div>
								<div className="overflow-y-auto   max-h-[calc(100dvh-50dvh)] md:min-h-[calc(100dvh-25dvh)] pb-20 pt-[60px] md:pt-[85px]">
									<MonthsTable
										studentUser={studentUser!}
										isLoading={loading}
										data={data?.allowances.data || []}
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
