import { useQuery } from "@apollo/client";
import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	SortDescriptor,
	Selection,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useReactToPrint } from "react-to-print";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Card, CardBody } from "@heroui/card";
import { formatDate, setMonth, setYear } from "date-fns";
import { Chip } from "@heroui/chip";

import ClaimModal from "../__components/claim-modal";

import logo from "@/assets/sedp-mfi.e31049f.webp";
import { ViewAllowanceModal } from "@/components";
import { READ_ALLOWANCES_QUERY } from "@/queries";
import {
	Allowance,
	AllowanceWithStudent,
	PaginationResult,
	Student,
} from "@/types";
import { Documents, months, semester } from "@/lib/constant";
import { checkIfPreviousMonth, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts";
import { Helmet } from "react-helmet";

export const columns = [
	{ name: "NAME", uid: "name", sortable: true },
	{ name: "YEAR LEVEL", uid: "yearLevel" },
	{ name: "SCHOOL", uid: "school" },
	{ name: "AMOUNT", uid: "amount" },
	{ name: "STATUS", uid: "status" },
	// { name: "STATUS", uid: "status" },
	{ name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
	"name",
	"yearLevel",
	"school",
	"status",
	"amount",
	"actions",
];

const rowsPerPageItems = [
	{ key: "25", label: "25" },
	{ key: "50", label: "50" },
	{
		key: "100",
		label: "100",
	},
];

const currentYear = new Date().getFullYear() + 2;
const years = Array.from({ length: currentYear - 2015 + 1 }, (_, i) =>
	(2015 + i).toString()
);

export default function AllowanceList() {
	const [rowsPerPage, setRowsPerPage] = useState<string>("25");
	const [page, setPage] = useState(1);
	const [filterValue, setFilterValue] = useState("");
	const [toUpdate, setToUpdate] = useState<AllowanceWithStudent | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);
	const [toView, setToView] = useState<AllowanceWithStudent | null>(null);
	const [visibleColumns, setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);
	const toPrintRef = useRef<HTMLDivElement>(null);
	const printFn = useReactToPrint({
		contentRef: toPrintRef,
		documentTitle: "Allowance List",
	});
	const { role } = useAuth();
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "firstName",
		direction: "ascending",
	});
	// const [statusFilter] = useState<Array<SystemUserRole>>([]);
	const [statusFilter] = useState<Selection>("all");
	const [yearFilter, setYearFilter] = useState<Selection>(
		new Set([String(new Date().getFullYear())])
	);
	const [monthFilter, setMonthFilter] = useState<Selection>(
		new Set([String(new Date().getMonth() + 1)])
	);
	const hasSearchFilter = Boolean(filterValue);

	const { loading, data } = useQuery<{
		allowances: PaginationResult<Allowance & { student: Student }>;
	}>(READ_ALLOWANCES_QUERY, {
		variables: {
			month: Number(Array.from(monthFilter)[0]),
			year: Number(Array.from(yearFilter)[0]),
			includeStudent: true,
		},
	});

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const pages = useMemo(() => {
		return data?.allowances.count
			? Math.ceil(data?.allowances.count / Number(rowsPerPage))
			: 0;
	}, [rowsPerPage, data?.allowances.count]);

	const loadingState = loading ? "loading" : "idle";

	const selectedMonth = Number(Array.from(monthFilter)[0]);
	const selectedYear = Number(Array.from(yearFilter)[0]);

	const renderCell = useCallback(
		(allowance: Allowance & { student: Student }, columnKey: React.Key) => {
			const cellValue = allowance[columnKey as keyof Allowance];
			const student = allowance.student;

			switch (columnKey) {
				case "name":
					return <p>{`${student.firstName} ${student.lastName}`}</p>;

				// case "date":
				// 	return formatDate(allowance.date, "MMMM dd, yyyy");

				// case "time":
				// 	return formatEventTime(allowance.startTime, allowance.endTime);
				case "status":
					return (
						<Chip
							className="text-white"
							color={allowance.claimed ? "success" : "danger"}>
							{allowance.claimed ? "Claimed" : "Not Claimed"}
						</Chip>
					);

				case "school":
					return <p>{allowance.student.schoolName}</p>;

				case "amount":
					return formatCurrency(allowance.totalAmount);

				case "actions":
					return (
						<div className="relative flex  justify-center items-center gap-2">
							<Tooltip content="View Details">
								<Button
									size="sm"
									isIconOnly
									onPress={() => {
										setToView(allowance);
										setViewModal(true);
									}}
									variant="light"
									className="text-lg text-default-400 cursor-pointer active:opacity-50">
									<Icon icon="solar:info-square-bold" color="gray" />
								</Button>
							</Tooltip>
							{checkIfPreviousMonth(selectedMonth, selectedYear) &&
								!allowance.claimed && (
									<Tooltip content="Mark as Claimed">
										<Button
											onPress={() => {
												setToUpdate(allowance);
												setOpenModal(true);
											}}
											isDisabled={!Documents.includes(role!)}
											size="sm"
											isIconOnly
											variant="light"
											className="text-lg text-default-400  cursor-pointer active:opacity-50">
											<Icon icon="heroicons:check-circle-solid" color="green" />
										</Button>
									</Tooltip>
								)}
						</div>
					);
				default:
					return cellValue?.toString();
			}
		},
		[selectedYear, selectedMonth]
	);

	const filteredItems = useMemo(() => {
		let filteredEvents = [...(data?.allowances.data ?? [])];

		if (hasSearchFilter) {
			setPage(1);
			filteredEvents = filteredEvents.filter((allowance) => {
				const filterVal = filterValue.toLowerCase();

				return (
					allowance.student.firstName.toLowerCase().includes(filterVal) ||
					allowance.student.lastName.toLowerCase().includes(filterVal)
				);
			});
		}

		// if (
		// 	statusFilter !== "all" &&
		// 	Array.from(statusFilter).length !== statusOptions.length
		// ) {
		// 	filteredEvents = filteredEvents.filter((user) => {
		// 		return Array.from(statusFilter).includes(user.);
		// 	});
		// }

		return filteredEvents;
	}, [data?.allowances.data, filterValue, statusFilter]);

	const items = useMemo(() => {
		const start = (page - 1) * Number(rowsPerPage);
		const end = start + Number(rowsPerPage);

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = useMemo(() => {
		return [...(items ?? [])].sort((a: Allowance, b: Allowance) => {
			const first = a[sortDescriptor.column as keyof Allowance]!;
			const second = b[sortDescriptor.column as keyof Allowance]!;
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, items]);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col w-full ">
				<div className="flex justify-between flex-wrap sm:flex-nowrap gap-3 items-end">
					<Input
						isClearable
						classNames={{
							base: "w-full sm:max-w-[44%]",
							input: " placeholder:text-[#1f4e26]/60",
							inputWrapper: "border-1 bg-[#A6F3B2]  !border-green-600",
						}}
						placeholder="Search by title..."
						size="md"
						startContent={<Icon icon="icon-park-solid:search" />}
						// value={filterValue}
						variant="bordered"
						onClear={() => setFilterValue("")}
						onValueChange={setFilterValue}
					/>
					<div className="flex gap-3 justify-between md:justify-end w-full">
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
									{formatDate(
										setMonth(
											new Date(),
											Number(Array.from(monthFilter)[0]) - 1
										),
										"MMMM"
									)}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								onSelectionChange={setMonthFilter}
								selectedKeys={monthFilter}
								aria-label="Table Columns"
								disallowEmptySelection
								selectionMode="single">
								{months.map((month, index) => (
									<DropdownItem
										key={index + 1}
										className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize">
										{month}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
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
									{formatDate(
										setYear(new Date(), Number(Array.from(yearFilter)[0])),
										"yyyy"
									)}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								onSelectionChange={setYearFilter}
								selectedKeys={yearFilter}
								aria-label="Table Columns"
								disallowEmptySelection
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
							<DropdownTrigger className=" flex bg-[#A6F3B2]">
								<Button
									endContent={
										<Icon
											icon="mynaui:chevron-down-solid"
											width="24"
											height="24"
										/>
									}
									variant="flat">
									Columns
								</Button>
							</DropdownTrigger>

							<DropdownMenu
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								disallowEmptySelection
								onSelectionChange={setVisibleColumns}>
								{columns.map((column) => (
									<DropdownItem
										className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize"
										key={column.uid}>
										{column.name.toLowerCase()}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	}, [visibleColumns, statusFilter, yearFilter, monthFilter]);

	const handlePrint = useCallback(() => {
		printFn();
	}, [printFn]);

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Allowance Management</title>
				<meta
					name="description"
					content="Manage and review allowance records for students."
				/>
			</Helmet>
			<Card className="bg-[#A6F3B235] mb-8">
				<CardBody className="pt-8 ">
					<div className="md:px-5 flex justify-between">
						<div className="leading-loose">
							<h1 className="text-xl leading-none font-medium">
								Allowance Management
							</h1>
							<p className="text-sm leading-loose text-gray-400">
								Review and manage allowance records
							</p>
						</div>
						<Button
							isDisabled={data?.allowances.data.length === 0}
							onPress={handlePrint}
							color="primary">
							<Icon width="20" height="20" icon="fluent:print-16-regular" />
							Print
						</Button>
					</div>
					<Table
						classNames={{
							wrapper: "bg-transparent ",
						}}
						className=" "
						sortDescriptor={sortDescriptor}
						onSortChange={setSortDescriptor}
						aria-label="Example table with custom cells"
						shadow="none"
						bottomContentPlacement="outside"
						topContent={topContent}
						bottomContent={
							pages > 0 ? (
								<div className="flex w-full  justify-between  flex-wrap">
									<Pagination
										isCompact
										showControls
										// showControls={pages > 3}
										// showShadow
										color="primary"
										classNames={{
											// base: "bg-[#A6F3B2]",
											cursor: "bg-green-600",
										}}
										page={page}
										isDisabled={hasSearchFilter}
										total={pages}
										onChange={setPage}
									/>
									<div className="flex gap-3 items-center">
										<p className="min-w-[100px] inline  ">
											<span className="text-sm">Total Meetings: </span>
											{data?.allowances.count || 0}
										</p>
										<Select
											classNames={{
												trigger: "bg-green-600   group-hover:bg-green-600/95 ",
												value: " !text-white",
											}}
											className="max-w-[200px] text-white w-[100px] inline "
											items={rowsPerPageItems}
											selectedKeys={[rowsPerPage.toString()]}
											onSelectionChange={(v) => {
												if (
													!!v &&
													v.currentKey?.toString()! !== rowsPerPage &&
													v.currentKey?.toString()! !== undefined
												) {
													setRowsPerPage(v.currentKey?.toString()!);
												}
											}}>
											{rowsPerPageItems.map((row) => (
												<SelectItem
													color="success"
													key={row.key}
													className="data-[hover=true]:text-white data-[selected=true]:text-white data-[focus=true]:text-white data-[focus-visible=true]:text-white data-[hover=true]:bg-green-600   data-[selected=true]:bg-green-600"
													isReadOnly={
														(data?.allowances.count || 0) < Number(row.key)
													}>
													{row.label}
												</SelectItem>
											))}
										</Select>
									</div>
								</div>
							) : null
						}>
						<TableHeader columns={headerColumns}>
							{(column) => (
								<TableColumn
									className="bg-[#A6F3B2]"
									allowsSorting={column.sortable}
									key={column.uid}
									align={column.uid === "actions" ? "center" : "start"}>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody
							emptyContent={"No rows to display."}
							loadingContent={<Spinner />}
							loadingState={loadingState}
							items={sortedItems ?? []}>
							{(item) => (
								<TableRow key={`${item.id}`}>
									{(columnKey) => (
										<TableCell className="min-w-[140px]">
											{renderCell(item, columnKey)}
										</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			{toUpdate && (
				<ClaimModal
					allowance={toUpdate}
					isOpen={openModal}
					onOpenChange={setOpenModal}
				/>
			)}
			{toView && (
				<ViewAllowanceModal
					isOpen={viewModal}
					allowance={toView as Allowance}
					student={toView.student}
					onOpenChange={setViewModal}
					showStudentInfo
				/>
			)}

			{data?.allowances.data && data?.allowances.data.length > 0 && (
				<div ref={toPrintRef} className="hidden print:block print:m-[0.75in]">
					<div className="w-full bg-white overflow-hidden">
						<div className="bg-yellow-100 py-8 relative flex justify-center items-center  px-4 border-b">
							<img
								src={logo}
								className="h-24 w-24 absolute left-3 rounded-full items-center mix-blend-multiply"
								alt="sedp logo"
							/>
							<div>
								<h2 className="text-center font-semibold">
									{semester[data.allowances.data[0].semester]}
								</h2>
								<p className="text-center text-sm">
									{months[data.allowances.data[0].month]}{" "}
									{data.allowances.data[0].year}
								</p>
							</div>
						</div>

						<div className="w-full overflow-visible print:overflow-visible">
							<table className="w-full border-collapse text-sm print:text-xs">
								<thead>
									<tr>
										<th className="bg-blue-200 font-normal border border-gray-300 px-1 py-1 text-xs print:text-xs">
											NO.
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
											SCHOLAR&apos;S NAME
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 px-1 py-1 text-xs print:text-xs">
											YR
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
											COURSE
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
											SCHOOL
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
											Monthly Allowance
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
											Misc. Allowance
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
											Book Allowance
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
											Thesis Allowance
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
											TOTAL
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
											Sign
										</th>
										<th className="bg-blue-200 font-normal border border-gray-300 px-1 py-1 text-xs print:text-xs text-center">
											Date
										</th>
									</tr>
								</thead>
								<tbody className="text-xs bo print:text-xs">
									{data.allowances.data.map((allowance, index) => {
										const student = allowance.student;

										return (
											<tr
												key={allowance.id}
												className="print:break-inside-avoid">
												<td className="border border-gray-300 px-1 py-1 text-center">
													{index + 1}
												</td>
												<td className="px-1 py-1 max-w-xs truncate">
													{student.lastName}, {student.firstName}
												</td>
												<td className="px-1 py-1 text-center">
													{allowance.yearLevel}
												</td>
												<td className="px-1 py-1 max-w-xs truncate">
													{student.course}
												</td>
												<td className="px-1 py-1 max-w-xs truncate">
													{student.schoolName}
												</td>
												<td className="px-1 py-1 text-right">
													{allowance.monthlyAllowance?.toFixed(2)}
												</td>
												<td className="px-1 py-1 text-right">
													{allowance.miscellaneousAllowance?.toFixed(2) || ""}
												</td>
												<td className="px-1 py-1 text-right">
													{allowance.bookAllowance?.toFixed(2) || ""}
												</td>
												<td className="px-1 py-1 text-right">
													{allowance.thesisAllowance?.toFixed(2) || ""}
												</td>
												<td className="px-1 py-1 text-right font-medium">
													{allowance.totalAmount?.toFixed(2)}
												</td>
												<td className="px-1 py-1 min-w-[60px]">{/* */}</td>
												<td className="px-1 py-1 min-w-[60px]">{/* */}</td>
											</tr>
										);
									})}

									<tr className="print:break-inside-avoid">
										<td
											colSpan={9}
											className="border border-gray-300 px-1 py-1 text-right font-medium">
											Total:
										</td>
										<td className="border border-gray-300 px-1 py-1 text-right font-bold">
											{formatCurrency(
												data.allowances.data.reduce(
													(sum, item) => sum + (item.totalAmount || 0),
													0
												)
											)}
										</td>
										<td
											colSpan={2}
											className="border border-gray-300 px-1 py-1">
											{/*  */}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
