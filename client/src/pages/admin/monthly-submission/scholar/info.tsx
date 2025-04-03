import { Navigate, useLocation, useParams } from "react-router-dom";
import { Selection } from "@react-types/shared";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { DocumentTable, PreviewModal } from "@/components";
import { Document, Student } from "@/types";
import { READ_DOCUMENTS_QUERY } from "@/queries";
import { getFileExtension, imagesExtensions } from "@/lib/constant";

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

const getYears = (yearStarted: number) => {
	const years = [];

	for (let i = yearStarted; i <= yearStarted + 5; i++) {
		years.push(i);
	}

	return years;
};

export default function StudentFiles() {
	const { scholarId } = useParams();
	const { state }: { state: { scholar: Student } } = useLocation();
	const scholar = state.scholar;
	const [yearFilter, setYearFilter] = useState<Selection>(
		new Set([new Date().getFullYear()])
	);
	const [monthFilter, setMonthFilter] = useState<Selection>(
		new Set([new Date().getMonth() + 1])
	);
	const [previewModal, onPreviewModalChange] = useState(false);
	const [toPreview, setToPreview] = useState<string | null>(null);
	const { loading, error, data, refetch } = useQuery<{ documents: Document[] }>(
		READ_DOCUMENTS_QUERY,
		{
			variables: {
				scholarId: scholarId,
				year: Number(Array.from(yearFilter)[0]),
				month: Number(Array.from(monthFilter)[0]),
			},
		}
	);

	useEffect(() => {
		if (!error) {
			refetch({
				scholarId: scholarId,
				year: Number(Array.from(yearFilter)[0]),
				month: Number(Array.from(monthFilter)[0]),
			});
		}
	}, [yearFilter, monthFilter]);

	if (!scholarId && !scholar)
		return <Navigate to={`/admin/monthly-submissions`} />;

	const yearStarted = new Date(
		!isNaN(Number(scholar.createdAt))
			? Number(scholar.createdAt)
			: scholar.createdAt
	).getFullYear();

	const years = getYears(yearStarted);

	return (
		<div className="container mx-auto px-5 md:px-0 py-5">
			<div className="flex justify-between items-center ">
				<div>
					<h1 className="text-2xl">
						{scholar.firstName} {scholar.lastName}&apos;s <span>files</span>
					</h1>
					<p className="md:max-w-2xl text-sm text-default-400">
						The list below displays the files submitted by the student for the
						monthly submission process. Please click on a file to view more
						details.
					</p>
				</div>
				<div className="flex gap-2 items-center">
					<Dropdown
						classNames={{
							content: "bg-[#A6F3B2]",
						}}>
						<DropdownTrigger className="hidden sm:flex bg-[#A6F3B2]">
							<Button
								endContent={
									<Icon
										icon="mynaui:chevron-down-solid"
										width="24"
										height="24"
									/>
								}
								size="md"
								variant="flat">
								Year {yearFilter}
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							// onSelectionChange={(year) => {
							// 	if (!year) return;
							// 	setYearFilter(Number(year.currentKey));
							// }}
							onSelectionChange={setYearFilter}
							selectedKeys={yearFilter}
							aria-label="Year Filter"
							selectionMode="single">
							{years.map((year) => (
								<DropdownItem
									key={year}
									className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize">
									{year}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
					<Dropdown
						classNames={{
							content: "bg-[#A6F3B2]",
						}}>
						<DropdownTrigger className="hidden sm:flex bg-[#A6F3B2]">
							<Button
								endContent={
									<Icon
										icon="mynaui:chevron-down-solid"
										width="24"
										height="24"
									/>
								}
								size="md"
								variant="flat">
								{Array.from(monthFilter).length === 0 && "Month"}{" "}
								{months[Number(Array.from(monthFilter)[0]) - 1]}
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							// onSelectionChange={(year) => {
							// 	if (!year) return;
							// 	setYearFilter(Number(year.currentKey));
							// }}
							disallowEmptySelection
							onSelectionChange={setMonthFilter}
							selectedKeys={monthFilter}
							aria-label="Year Filter"
							selectionMode="single">
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((year) => (
								<DropdownItem
									key={year}
									className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize">
									{months[year - 1]}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			<div className="px-0.5">
				<DocumentTable
					data={data?.documents || []}
					isLoading={loading}
					handleRowClick={(url) => {
						onPreviewModalChange(true);
						setToPreview(url);
					}}
				/>
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
			</div>
			{(data?.documents || []).length > 0 && (
				<div className="absolute bottom-0 left-0 right-0 bg-white p-5 md:px-10 flex justify-between items-center">
					{/*  */}
					<h3>Total expenses:</h3>
					<h2 className="text-2xl font-bold">0.0</h2>
				</div>
			)}
		</div>
	);
}
