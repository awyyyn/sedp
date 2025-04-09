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
import { READ_SCHOLAR_SEMESTER_DOCUMENTS_QUERY } from "@/queries";
import { getFileExtension, imagesExtensions, semester } from "@/lib/constant";
const getYears = (yearStarted: number) => {
	const years = [];

	for (let i = yearStarted; i <= yearStarted + 4; i++) {
		years.push(i);
	}

	return years;
};

export default function StudentSemesterFiles() {
	const { scholarId } = useParams();
	const { state }: { state: { scholar: Student } } = useLocation();
	const scholar = state.scholar;
	const createdAt = !isNaN(Number(scholar.createdAt))
		? Number(scholar.createdAt)
		: scholar.createdAt;
	const year = new Date(createdAt).getFullYear();
	const [yearFilter, setYearFilter] = useState<Selection>(new Set([year]));
	const [semesterFilter, setSemesterFilter] = useState<Selection>(new Set([1]));
	const [previewModal, onPreviewModalChange] = useState(false);
	const [toPreview, setToPreview] = useState<string | null>(null);
	const { loading, error, data, refetch } = useQuery<{
		documents: Document[];
	}>(READ_SCHOLAR_SEMESTER_DOCUMENTS_QUERY, {
		variables: {
			scholarId: scholarId,
			semester: Number(Array.from(semesterFilter)[0]),
			schoolYear: `${Number(Array.from(yearFilter)[0])}-${Number(Array.from(yearFilter)[0]) + 1}`,
			monthlyDocument: false,
		},
	});

	useEffect(() => {
		if (!error) {
			refetch({
				scholarId: scholarId,
				year: Number(Array.from(yearFilter)[0]),
				semester: Number(Array.from(semesterFilter)[0]),
				monthlyDocument: false,
			});
		}
	}, [yearFilter, semesterFilter]);

	if (!scholarId && !scholar)
		return <Navigate to={`/admin/semester-submissions`} />;

	const yearStarted = new Date(
		!isNaN(Number(scholar.createdAt))
			? Number(scholar.createdAt)
			: scholar.createdAt
	).getFullYear();

	const years = getYears(yearStarted);

	const selectedMonth = Number(Array.from(semesterFilter)[0]);
	// const selectedYear = Number(Array.from(yearFilter)[0]);

	return (
		<div className="container mx-auto  py-5">
			<div className="flex-col md:flex-row flex  justify-between items-center ">
				<div>
					<h1 className="text-2xl">
						{scholar.firstName} {scholar.lastName}&apos;s <span>files</span>
					</h1>
					<p className="md:max-w-2xl text-sm text-default-400">
						The list below displays the files submitted by the student for the
						semester submission process. Please click on a file to view more
						details.
					</p>
				</div>
				<div className=" w-full md:w-auto py-4 md:py-0 flex gap-2 items-center">
					{/* {data?.allowance ? (
						<Button onPress={() => setViewAllowanceModal(true)}>
							View
							<span className="hidden md:block">Allowance</span>
						</Button>
					) : (
						checkIfPreviousMonth(selectedMonth, selectedYear) && (
							<>
								<Button
									className="bg-[#A6F3B2]"
									isDisabled={!Documents.includes(role!)}
									onPress={() => setGenerateModal(true)}>
									Generate
									<span className="hidden md:block">Allowance</span>
								</Button>
							</>
						)
					)} */}

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
								S.Y. {yearFilter} - {Number(Array.from(yearFilter)[0]) + 1}
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
									{year} - {year + 1}
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
								{semester[selectedMonth - 1]}
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							// onSelectionChange={(year) => {
							// 	if (!year) return;
							// 	setYearFilter(Number(year.currentKey));
							// }}
							disallowEmptySelection
							onSelectionChange={setSemesterFilter}
							selectedKeys={semesterFilter}
							aria-label="Year Filter"
							selectionMode="single">
							{[1, 2, 3].map((year) => (
								<DropdownItem
									key={year}
									className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize">
									{semester[year - 1]}
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

			{/* {data?.allowance && viewAllowanceModal && (
				<ViewAllowanceModal
					allowance={data.allowance}
					isOpen={viewAllowanceModal}
					onOpenChange={setViewAllowanceModal}
					student={scholar}
				/>
			)} */}
		</div>
	);
}
