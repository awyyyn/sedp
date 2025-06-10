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
import { useCallback, useMemo, useState } from "react";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Card, CardBody } from "@heroui/card";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { READ_STUDENTS_QUERY } from "@/queries";
import { PaginationResult, Student } from "@/types";
import { yearLevels } from "@/lib/constant";

export const columns = [
	{ name: "NAME", uid: "name", sortable: true },
	{ name: "YEAR", uid: "year", sortable: true },
	{ name: "SCHOOL NAME", uid: "schoolName", sortable: true },
	{ name: "PROGRAM", uid: "program" },
];

const INITIAL_VISIBLE_COLUMNS = [
	"name",
	"year",
	"schoolName",
	"program",
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

export default function Scholars() {
	const [rowsPerPage, setRowsPerPage] = useState<string>("25");
	const [page, setPage] = useState(1);
	const [filterValue, setFilterValue] = useState("");
	const navigate = useNavigate();
	const [visibleColumns, setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);

	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "firstName",
		direction: "ascending",
	});

	// const [statusFilter] = useState<Array<SystemUserRole>>([]);
	const [statusFilter, setStatusFilter] = useState<Selection>("all");
	const hasSearchFilter = Boolean(filterValue);

	const { loading, data } = useQuery<{
		students: PaginationResult<Student>;
	}>(READ_STUDENTS_QUERY, {
		variables: {
			status: "SCHOLAR",
		},
	});

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const pages = useMemo(() => {
		return data?.students.count
			? Math.ceil(data?.students.count / Number(rowsPerPage))
			: 0;
	}, [rowsPerPage, data?.students.count]);

	const loadingState = loading ? "loading" : "idle";

	const renderCell = useCallback((user: Student, columnKey: React.Key) => {
		const cellValue = user[columnKey as keyof Student];

		switch (columnKey) {
			case "name":
				const middleName = user.middleName
					? ` ${user.middleName[0].toUpperCase()}.`
					: "";

				return <p>{`${user.firstName}${middleName} ${user.lastName}`}</p>;

			case "year":
				return <p>{user.yearLevel} </p>;

			case "program":
				return <p>{user.course}</p>;

			default:
				return cellValue?.toString();
		}
	}, []);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...(data?.students.data ?? [])];

		if (hasSearchFilter) {
			setPage(1);
			filteredUsers = filteredUsers.filter((user) => {
				const firstName = user.firstName.toLowerCase();
				const lastName = user.lastName.toLowerCase();

				const fullName = `${firstName} ${lastName}`;
				const filterVal = filterValue.toLowerCase();

				return (
					firstName.includes(filterVal) ||
					lastName.toLowerCase().includes(filterVal) ||
					fullName.includes(filterVal)
				);
			});
		}

		if (
			statusFilter !== "all" &&
			Array.from(statusFilter).length !== yearLevels.length
		) {
			filteredUsers = filteredUsers.filter((user) => {
				return Array.from(statusFilter).includes(user.yearLevel.toString());
			});
		}

		return filteredUsers;
	}, [data?.students.data, filterValue, statusFilter]);

	const items = useMemo(() => {
		const start = (page - 1) * Number(rowsPerPage);
		const end = start + Number(rowsPerPage);

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = useMemo(() => {
		return [...(items ?? [])].sort((a: Student, b: Student) => {
			const first =
				sortDescriptor.column === "name"
					? a["firstName"]
					: a[sortDescriptor.column as keyof Student]!;
			const second =
				sortDescriptor.column === "name"
					? b["firstName"]
					: b[sortDescriptor.column as keyof Student]!;
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
						placeholder="Search by name..."
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
							<DropdownTrigger className="hidden sm:flex bg-[#A6F3B2]">
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
									Year Level
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								onSelectionChange={setStatusFilter}
								selectedKeys={statusFilter}
								closeOnSelect={false}
								aria-label="Table Columns"
								selectionMode="multiple">
								{yearLevels.map((yearLevel, index) => (
									<DropdownItem
										key={index + 1}
										className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize">
										{yearLevel}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	}, [visibleColumns, statusFilter]);

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Monthly Submissions | Admin</title>
				<meta
					name="description"
					content="Overview of scholars and their submitted documents."
				/>
			</Helmet>

			<Card className="bg-[#A6F3B235]">
				<CardBody className="pt-8 ">
					<div className="px-5 flex justify-between">
						<div className="leading-loose">
							<h1 className="text-xl leading-none font-medium">
								Scholarship Submissions
							</h1>
							<p className="text-sm leading-loose text-gray-400">
								Overview of scholars and their submitted documents.
							</p>
						</div>
					</div>
					<Table
						classNames={{
							wrapper: "bg-transparent",
						}}
						selectionMode="single"
						sortDescriptor={sortDescriptor}
						onSortChange={setSortDescriptor}
						aria-label="Example table with custom cells"
						shadow="none"
						bottomContentPlacement="outside"
						topContent={topContent}
						bottomContent={
							pages > 0 ? (
								<div className="flex w-full  justify-between px-5 flex-wrap">
									<Pagination
										isCompact
										showControls
										color="primary"
										classNames={{
											cursor: "bg-green-600",
										}}
										page={page}
										isDisabled={hasSearchFilter}
										total={pages}
										onChange={setPage}
									/>
									<div className="flex gap-3 items-center">
										<p className="min-w-[100px] inline  ">
											<span className="text-sm">Total Scholars: </span>
											{data?.students.count || 0}
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
														(data?.students.count || 0) < Number(row.key)
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
							// items={sortedItems ?? []}
							items={sortedItems ?? []}>
							{(item) => (
								<TableRow
									key={`${item.id}`}
									onClick={() => {
										navigate(`/admin/monthly-submissions/${item.id}`, {
											state: { scholar: item },
										});
									}}>
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
		</>
	);
}
