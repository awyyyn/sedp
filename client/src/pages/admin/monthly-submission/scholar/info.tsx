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
import { getMonth, getYear, subMonths } from "date-fns";

import GenerateAllowance from "../../__components/generate-allowance";
import ViewAllowanceModal from "../../__components/view-allowance-detail";

import { DocumentTable, PreviewModal } from "@/components";
import { Allowance, Document, Student } from "@/types";
import { READ_SCHOLAR_DOCUMENTS_QUERY } from "@/queries";
import { getFileExtension, imagesExtensions, months } from "@/lib/constant";
import { formatCurrency } from "@/lib/utils";

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
		new Set([new Date().getMonth()])
	);
	const [generateModal, setGenerateModal] = useState(false);
	const [viewAllowanceModal, setViewAllowanceModal] = useState(false);
	const [previewModal, onPreviewModalChange] = useState(false);
	const [toPreview, setToPreview] = useState<string | null>(null);
	const { loading, error, data, refetch } = useQuery<{
		documents: Document[];
		allowance: Allowance;
	}>(READ_SCHOLAR_DOCUMENTS_QUERY, {
		variables: {
			scholarId: scholarId,
			studentId: scholarId,
			month: Number(Array.from(monthFilter)[0]),
			year: Number(Array.from(yearFilter)[0]),
			allowanceYear2: Number(Array.from(yearFilter)[0]),
			allowanceMonth2: Number(Array.from(monthFilter)[0]),
		},
	});

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

	const selectedMonth = Number(Array.from(monthFilter)[0]);
	const selectedYear = Number(Array.from(yearFilter)[0]);

	const checkIfPreviousMonth = (
		selectedMonth: number,
		selectedYear: number
	) => {
		const currentDate = new Date("2026-01-01");
		const currentMonth = currentDate.getMonth() + 1; // Convert from 0-indexed to 1-indexed
		const currentYear = currentDate.getFullYear();

		const currentDateObj = new Date(currentYear, currentMonth, 1); // months are 0-based

		// Subtract 1 month from the current date to get the previous month
		const previousMonthDate = subMonths(currentDateObj, 1);

		// Get the month and year of the previous month
		const previousMonth = getMonth(previousMonthDate) + 1; // months are 0-based in JS, so we add 1
		const previousYear = getYear(previousMonthDate);

		// Check if the selected month and year match the previous month and year
		return selectedMonth === previousMonth && selectedYear === previousYear;
	};

	return (
		<div className="container mx-auto  py-5">
			<div className="flex-col md:flex-row flex  justify-between items-center ">
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
				<div className=" w-full md:w-auto py-4 md:py-0 flex gap-2 items-center">
					{data?.allowance ? (
						<Button onPress={() => setViewAllowanceModal(true)}>
							View
							<span className="hidden md:block">Allowance</span>
						</Button>
					) : (
						checkIfPreviousMonth(selectedMonth, selectedYear) && (
							<>
								{monthFilter}
								<Button onPress={() => setGenerateModal(true)}>
									Generate
									<span className="hidden md:block">Allowance</span>
								</Button>
							</>
						)
					)}

					<Dropdown
						classNames={{
							content: "bg-[#A6F3B2]",
						}}>
						<DropdownTrigger className=" flex bg-[#A6F3B2]">
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
						<DropdownTrigger className="  bg-[#A6F3B2]">
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
				<>
					<div className="absolute bottom-0 left-0 right-0 bg-white p-5 md:px-10 flex justify-between items-center">
						{/*  */}
						<h3>Total expenses:</h3>
						<h2 className="text-2xl font-bold">
							{formatCurrency(
								data?.documents
									? data.documents.reduce(
											(acc, curr) => acc + (curr.amount || 0),
											0
										)
									: 0
							)}
						</h2>
					</div>
					{generateModal && (
						<GenerateAllowance
							isOpen={generateModal}
							onOpenChange={setGenerateModal}
							scholar={scholar}
							documents={data?.documents.filter((doc) => doc.amount) || []}
							month={Number(Array.from(monthFilter)[0])}
							year={Number(Array.from(yearFilter)[0])}
						/>
					)}
				</>
			)}
			{data?.allowance && viewAllowanceModal && (
				<ViewAllowanceModal
					allowance={data.allowance}
					isOpen={viewAllowanceModal}
					onOpenChange={setViewAllowanceModal}
					student={scholar}
				/>
			)}
		</div>
	);
}
