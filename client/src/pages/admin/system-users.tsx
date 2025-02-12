import { useQuery } from "@apollo/client";
import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	SortDescriptor,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { useCallback, useMemo, useState } from "react";
import { Pagination } from "@heroui/pagination";
import { Chip, ChipProps } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Link } from "@heroui/link";
import { useAtom } from "jotai";

import { client } from "@/main";
import { systemUsersQuery } from "@/queries";
import { PaginationResult, SystemUser } from "@/types";
import { SendRegistrationModal } from "@/components";
import DeleteModal from "@/components/delete-modal";
import { systemUsersAtom } from "@/states";

export const columns = [
	{ name: "NAME", uid: "name", sortable: true },
	{ name: "EMAIL", uid: "email", sortable: true },
	{ name: "PHONE", uid: "phoneNumber", sortable: true },
	{ name: "ADDRESS", uid: "address" },
	{ name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
	VERIFIED: "success",
	UNVERIFIED: "warning",
	DELETED: "danger",
};

const statusOptions: { label: string; value: string }[] = [
	{ label: "all", value: "ALL" },
	{ label: "Verified", value: "VERIFIED" },
	// { label: "Deleted", value: "DELETED" },
	{ label: "Unverified", value: "UNVERIFIED" },
];

const rowsPerPageItems = [
	{ key: "25", label: "25" },
	{ key: "50", label: "50" },
	{
		key: "100",
		label: "100",
	},
];

export default function SystemUsers() {
	const [deleteModal, setDeleteModal] = useState(false);
	const [systemUsersState, setSystemUsersState] = useAtom(systemUsersAtom);
	const [rowsPerPage, setRowsPerPage] = useState<string>("25");
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [filterValue, setFilterValue] = useState("");
	const [toDeleteItem, setToDeleteItem] = useState<Pick<
		SystemUser,
		"id" | "email"
	> | null>(null);

	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "firstName",
		direction: "ascending",
	});
	const [statusFilter, setStatusFilter] = useState("ALL");
	const hasSearchFilter = Boolean(filterValue);

	const { loading } = useQuery<{
		systemUsers: PaginationResult<SystemUser>;
	}>(systemUsersQuery, {
		client: client,
		variables: {
			// pagination: {
			// 	take: Number(rowsPerPage),
			// 	page: page,
			// },
			// filterValue: filterValue ?? null,
			// status: statusFilter ?? null,
		},
		ssr: true,
		onCompleted: (data) => {
			setTotal(data.systemUsers.count);
			setSystemUsersState((p) => [...p, ...data.systemUsers.data]);
		},
	});

	const pages = useMemo(() => {
		return total ? Math.ceil(total / Number(rowsPerPage)) : 0;
	}, [total, rowsPerPage]);

	const loadingState = loading ? "loading" : "idle";

	const renderCell = useCallback((user: SystemUser, columnKey: React.Key) => {
		const cellValue = user[columnKey as keyof SystemUser];

		switch (columnKey) {
			case "name":
				const middleName = user.middleName
					? ` ${user.middleName[0].toUpperCase()}.`
					: "";

				return <p>{`${user.firstName}${middleName} ${user.lastName}`}</p>;

			case "role":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-sm capitalize">
							{cellValue?.toString()}
						</p>
						<p className="text-bold text-sm capitalize text-default-400">
							{/* {user.team} */}
						</p>
					</div>
				);
			case "address":
				return (
					<p>
						{user.address.street}, {user.address.city}
					</p>
					// <Chip
					// 	className="capitalize"
					// 	color={statusColorMap[user.status]}
					// 	size="sm"
					// 	variant="flat">
					// 	{cellValue?.toString()}
					// </Chip>
				);
			case "actions":
				return (
					<div className="relative flex  justify-center items-center gap-2">
						<Tooltip content="Details">
							<Link href={`/system-users/${user.id}`}>
								<span className="text-lg text-default-400 cursor-pointer active:opacity-50">
									<Icon icon="solar:info-square-bold" color="gray" />
								</span>
							</Link>
						</Tooltip>
						{/* <Tooltip content="Edit user">
							<span className="text-lg text-default-400  cursor-pointer active:opacity-50">
								<Icon icon="solar:clapperboard-edit-bold" color="green" />
							</span>
						</Tooltip> */}
						<Tooltip color="danger" content="Delete user">
							<span className="text-lg text-danger cursor-pointer active:opacity-50">
								<Icon
									onClick={() => {
										setDeleteModal(true);
										setToDeleteItem(user);
									}}
									icon="solar:trash-bin-2-bold"
								/>
							</span>
						</Tooltip>
					</div>
				);
			case "phoneNumber":
				return <p>+63 {cellValue?.toString()}</p>;
			default:
				return cellValue?.toString();
		}
	}, []);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...(systemUsersState ?? [])];

		if (hasSearchFilter) {
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

		if (statusFilter !== "ALL") {
			filteredUsers = filteredUsers.filter((user) => {
				return user.status === statusFilter;
			});
		}

		return filteredUsers;
	}, [systemUsersState, filterValue, statusFilter]);

	const items = useMemo(() => {
		const start = (page - 1) * Number(rowsPerPage);
		const end = start + Number(rowsPerPage);

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = useMemo(() => {
		return [...(items ?? [])].sort((a: SystemUser, b: SystemUser) => {
			const first =
				sortDescriptor.column === "name"
					? a["firstName"]
					: a[sortDescriptor.column as keyof SystemUser]!;
			const second =
				sortDescriptor.column === "name"
					? b["firstName"]
					: b[sortDescriptor.column as keyof SystemUser]!;
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
							inputWrapper: "border-1",
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
						{/* <Dropdown>
							<DropdownTrigger className="">
								<Button
									endContent={<Icon icon="mynaui:chevron-down-solid" />}
									size="md"
									variant="flat">
									Status
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								onSelectionChange={(v) => {
									if (v.currentKey) {
										setStatusFilter(v.currentKey.toString());
									}
								}}
								disallowEmptySelection
								aria-label="Table Columns"
								defaultSelectedKeys={[statusFilter]}
								selectionMode="single">
								{statusOptions.map((status) => (
									<DropdownItem key={status.value} className={`capitalize `}>
										{status.label}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown> */}

						{/* 
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={<ChevronDownIcon className="text-small" />}
									size="sm"
									variant="flat">
									Columns
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								onSelectionChange={setVisibleColumns}>
								{columns.map((column) => (
									<DropdownItem key={column.uid} className="capitalize">
										{capitalize(column.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown> */}
						<SendRegistrationModal type="admin" />
					</div>
				</div>
			</div>
		);
	}, []);

	return (
		<>
			<div className="px-5">
				<div className="leading-loose">
					<h1 className="text-xl leading-none font-medium">System Users</h1>
					<p className="text-sm leading-loose text-gray-400">
						List of system users
					</p>
				</div>
			</div>
			<Table
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
								showControls={pages > 3}
								showShadow
								color="primary"
								page={page}
								isDisabled={hasSearchFilter}
								total={pages}
								onChange={(page) => {
									// fetchMore({
									// 	variables: {
									// 		pagination: {
									// 			page: page,
									// 			take: Number(rowsPerPage),
									// 		},
									// 		filterValue: filterValue ?? null,
									// 		status: statusFilter ?? null,
									// 	},
									// });
									setPage(page);
								}}
							/>
							<div className="flex gap-3 items-center">
								<p className="min-w-[100px] inline  ">
									<span className="text-sm">Total Users: </span>
									{total}
								</p>
								<Select
									className="max-w-[200px] w-[100px] inline"
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
											key={row.key}
											isReadOnly={total < Number(row.key)}
											isDisabled={total < Number(row.key)}
											classNames={{
												// wrapper: "read-only:hover:bg-red-400",
												base: "read-only:hover:bg-white read-only:focus:bg-yellow-500",
											}}
											className="read-only:text-gray-400  read-only:hover:text-gray-400">
											{row.label}
										</SelectItem>
									))}
								</Select>
							</div>
						</div>
					) : null
				}>
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
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

			{deleteModal && toDeleteItem && (
				<DeleteModal
					setSystemUsersState={(id) => {
						setSystemUsersState((prev) =>
							prev.filter((user) => user.id !== id)
						);
						setTotal((p) => p - 1);
					}}
					id={toDeleteItem.id}
					email={toDeleteItem.email}
					isOpen={deleteModal}
					setState={setDeleteModal}
				/>
			)}
		</>
	);
}
