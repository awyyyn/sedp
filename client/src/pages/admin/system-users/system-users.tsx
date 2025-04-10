import { useMutation, useQuery } from "@apollo/client";
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
import { Tooltip } from "@heroui/tooltip";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useSetAtom } from "jotai";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Card, CardBody } from "@heroui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { DeleteModal } from "../__components";

import { systemUsersQuery, UPDATE_SYSTEM_USER_MUTATION } from "@/queries";
import { PaginationResult, SystemUser, SystemUserRole } from "@/types";
import { systemUsersAtom } from "@/states";
import { getRoleDescription } from "@/lib/utils";

const roleOptions: SystemUserRole[] = [
	"SUPER_ADMIN",
	"ADMIN_MANAGE_DOCUMENTS",
	"ADMIN_MANAGE_GATHERINGS",
	"ADMIN_MANAGE_SCHOLAR",
	"ADMIN_VIEWER",
];

export const columns = [
	{ name: "NAME", uid: "name", sortable: true },
	{ name: "EMAIL", uid: "email", sortable: true },
	{ name: "PHONE", uid: "phoneNumber", sortable: true },
	{ name: "ADDRESS", uid: "address" },
	{ name: "ACCESS", uid: "access" },
	{ name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
	"name",
	"email",
	"phoneNumber",
	"address",
	"access",
	"status",
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

export default function SystemUsers() {
	const [deleteModal, setDeleteModal] = useState(false);
	const setSystemUsersState = useSetAtom(systemUsersAtom);
	const [rowsPerPage, setRowsPerPage] = useState<string>("25");
	const [page, setPage] = useState(1);
	const [filterValue, setFilterValue] = useState("");
	const [toDeleteItem, setToDeleteItem] = useState<SystemUser | null>(null);
	const [visibleColumns, setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);

	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "firstName",
		direction: "ascending",
	});
	// const [roleFilter] = useState<Array<SystemUserRole>>([]);
	const [roleFilter, setRoleFilter] = useState<Selection>("all");
	const hasSearchFilter = Boolean(filterValue);

	const { loading, data } = useQuery<{
		systemUsers: PaginationResult<SystemUser>;
	}>(systemUsersQuery);
	const [updateSystemUserStatus, { loading: updatingSystemUser }] = useMutation(
		UPDATE_SYSTEM_USER_MUTATION,
		{
			refetchQueries: [systemUsersQuery],
		}
	);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const pages = useMemo(() => {
		setSystemUsersState(data?.systemUsers.data || []);

		return data?.systemUsers.count
			? Math.ceil(data?.systemUsers.count / Number(rowsPerPage))
			: 0;
	}, [rowsPerPage, data?.systemUsers.count]);

	const loadingState = loading ? "loading" : "idle";

	const renderCell = useCallback((user: SystemUser, columnKey: React.Key) => {
		const cellValue = user[columnKey as keyof SystemUser];

		switch (columnKey) {
			case "name":
				const middleName = user.middleName
					? ` ${user.middleName[0].toUpperCase()}.`
					: "";

				return <p>{`${user.firstName}${middleName} ${user.lastName}`}</p>;

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
			case "access":
				return getRoleDescription(user.role);
			case "actions":
				return (
					<div className="relative flex  justify-center items-center gap-2">
						<Tooltip content="View Full Details">
							<Button
								size="sm"
								variant="light"
								isIconOnly
								as={Link}
								className="text-lg text-default-400 cursor-pointer active:opacity-50"
								to={`/admin/system-users/${user.id}`}>
								<Icon icon="solar:info-square-bold" color="gray" />
							</Button>
						</Tooltip>
						<Tooltip content="Update Status">
							<Button
								size="sm"
								variant="light"
								isIconOnly
								as={Link}
								to={`/admin/announcements/${user.id}/edit`}
								className="text-lg text-default-400  cursor-pointer active:opacity-50">
								<Icon icon="fluent:slide-text-edit-28-filled" color="green" />
							</Button>
						</Tooltip>
						<Tooltip
							color="danger"
							content={`${user.status === "DELETED" ? "Unblock" : "Block"} System User`}>
							<Button
								size="sm"
								variant="light"
								isIconOnly
								onPress={() => {
									setToDeleteItem(user);
									setDeleteModal(true);
								}}
								className="text-lg text-danger cursor-pointer active:opacity-50">
								<Icon
									icon={`${user.status === "DELETED" ? "gg:unblock" : "gg:block"}`}
									color="red"
									height={20}
									width={20}
								/>
							</Button>
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
		let filteredUsers = [...(data?.systemUsers.data ?? [])];

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
			roleFilter !== "all" &&
			Array.from(roleFilter).length !== roleOptions.length
		) {
			filteredUsers = filteredUsers.filter((user) => {
				return Array.from(roleFilter).includes(user.role);
			});
		}

		return filteredUsers;
	}, [data?.systemUsers.data, filterValue, roleFilter]);

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
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
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
									<DropdownItem key={column.uid} className="capitalize">
										{column.name.toLowerCase()}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
						<Dropdown>
							<DropdownTrigger className="">
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
									Access
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								onSelectionChange={setRoleFilter}
								selectedKeys={roleFilter}
								closeOnSelect={false}
								aria-label="Table Columns"
								selectionMode="multiple">
								{roleOptions.map((status) => (
									<DropdownItem key={status} className={`capitalize `}>
										{getRoleDescription(status)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	}, [roleFilter, visibleColumns]);

	return (
		<>
			<Card className="bg-[#A6F3B235]">
				<CardBody className="pt-8 ">
					<div className="px-5 flex justify-between">
						<div className="leading-loose">
							<h1 className="text-xl leading-none font-medium">System Users</h1>
							<p className="text-sm leading-loose text-gray-400">
								List of system users
							</p>
						</div>

						<Button as={Link} to="/admin/system-users/add">
							<Icon icon="lets-icons:add-ring-light" width="24" height="24" />
							Add System User
						</Button>
					</div>
					<Table
						classNames={{
							wrapper: "bg-transparent",
						}}
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
											<span className="text-sm">Total Users: </span>
											{data?.systemUsers.count || 0}
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
														(data?.systemUsers.count || 0) < Number(row.key)
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

			<DeleteModal
				deleteLabel={`${toDeleteItem?.status === "DELETED" ? "Unblock" : "Block"} `}
				loading={updatingSystemUser}
				handleDeletion={async () => {
					try {
						if (!toDeleteItem) return;
						await updateSystemUserStatus({
							variables: {
								values: {
									id: toDeleteItem.id,
									status:
										toDeleteItem.status === "DELETED"
											? toDeleteItem.verifiedAt
												? "VERIFIED"
												: "UNVERIFIED"
											: "DELETED",
								},
							},
						});
						toast.success(
							toDeleteItem.status === "DELETED"
								? "System user status updated successfully"
								: "System user status reverted successfully",
							{
								description:
									toDeleteItem.status === "DELETED"
										? "The system user's status has been updated."
										: "The system user's status has been reverted.",
								position: "top-center",
								richColors: true,
							}
						);
						setDeleteModal(false);
					} catch (erro) {
						toast.error("Please try again later.", {
							description: "If the problem persists, contact support.",
							position: "top-center",
							richColors: true,
						});
					}
				}}
				open={deleteModal}
				setOpen={setDeleteModal}
				hideNote={toDeleteItem?.status === "DELETED"}
				title={
					toDeleteItem?.status === "DELETED"
						? "Unblock System User"
						: "Delete System User"
				}
				description={
					toDeleteItem?.status === "DELETED"
						? "Are you sure you want to unblock this system user?"
						: "Are you sure you want to delete this system user?"
				}
			/>
		</>
	);
}
