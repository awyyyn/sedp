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
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { Card, CardBody } from "@heroui/card";

import { DeleteModal } from "../__components";

import {
	DELETE_ANNOUNCEMENT_MUTATION,
	READ_ANNOUNCEMENTS_QUERY,
} from "@/queries";
import { Announcement, PaginationResult } from "@/types";
import { useAuth } from "@/contexts";

export const columns = [
	{ name: "TITLE", uid: "title", sortable: true },
	{ name: "CREATED BY", uid: "createdBy", sortable: true },
	{ name: "ACTIONS", uid: "actions" },
];

const rowsPerPageItems = [
	{ key: "25", label: "25" },
	{ key: "50", label: "50" },
	{
		key: "100",
		label: "100",
	},
];

export default function Announcements() {
	const [rowsPerPage, setRowsPerPage] = useState<string>("25");
	const [page, setPage] = useState(1);
	const { role } = useAuth();
	const [filterValue, setFilterValue] = useState("");
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [toDeleteItem, setToDeleteItem] = useState<Announcement | null>(null);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "firstName",
		direction: "ascending",
	});
	const [roleFilter] = useState<Selection>("all");
	const hasSearchFilter = Boolean(filterValue);

	const { loading, data } = useQuery<{
		announcements: PaginationResult<Announcement>;
	}>(READ_ANNOUNCEMENTS_QUERY);

	const [deleteAnnouncement, { loading: deletingAnnouncement }] = useMutation(
		DELETE_ANNOUNCEMENT_MUTATION,
		{
			refetchQueries: [READ_ANNOUNCEMENTS_QUERY],
		}
	);

	const pages = useMemo(() => {
		return data?.announcements.count
			? Math.ceil(data?.announcements.count / Number(rowsPerPage))
			: 0;
	}, [rowsPerPage, data?.announcements.count]);

	const loadingState = loading ? "loading" : "idle";

	const renderCell = useCallback(
		(announcement: Announcement, columnKey: React.Key) => {
			const cellValue = announcement[columnKey as keyof Announcement];

			switch (columnKey) {
				case "actions":
					return (
						<div className="relative flex    justify-center items-center gap-2">
							<Tooltip content="Details">
								<Button
									as={Link}
									isIconOnly
									size="sm"
									variant="light"
									to={`/admin/announcements/${announcement.id}`}
									className="text-lg text-default-400 cursor-pointer active:opacity-50">
									<Icon icon="solar:info-square-bold" color="gray" />
								</Button>
							</Tooltip>
							<Tooltip content="Edit announcement">
								<Button
									as={Link}
									isIconOnly
									isDisabled={
										!["SUPER_ADMIN", "ADMIN_MANAGE_ANNOUNCEMENTS"].includes(
											role!
										)
									}
									size="sm"
									variant="light"
									to={`/admin/announcements/${announcement.id}/edit`}
									className="text-lg text-default-400  cursor-pointer active:opacity-50">
									<Icon icon="fluent:slide-text-edit-28-filled" color="green" />
								</Button>
							</Tooltip>
							<Tooltip color="danger" content="Delete announcement">
								<Button
									isIconOnly
									isDisabled={
										!["SUPER_ADMIN", "ADMIN_MANAGE_ANNOUNCEMENTS"].includes(
											role!
										)
									}
									size="sm"
									variant="light"
									className="text-lg text-danger cursor-pointer active:opacity-50">
									<Icon
										onClick={() => {
											setToDeleteItem(announcement);
											setOpenDeleteModal(true);
										}}
										icon="solar:trash-bin-minimalistic-bold"
										color="red"
									/>
								</Button>
							</Tooltip>
						</div>
					);
				case "createdBy":
					return `${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`;
				default:
					return cellValue?.toString();
			}
		},
		[]
	);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...(data?.announcements.data ?? [])];

		if (hasSearchFilter) {
			setPage(1);
			filteredUsers = filteredUsers.filter((announcement) => {
				const title = announcement.title.toLowerCase();
				const filterVal = filterValue.toLowerCase();

				return title.includes(filterVal);
			});
		}

		// if (
		// 	roleFilter !== "all" &&
		// 	Array.from(roleFilter).length !== roleOptions.length
		// ) {
		// 	filteredUsers = filteredUsers.filter((announcement) => {
		// 		return Array.from(roleFilter).includes(announcement.role);
		// 	});
		// }

		return filteredUsers;
	}, [data?.announcements.data, filterValue, roleFilter]);

	const items = useMemo(() => {
		const start = (page - 1) * Number(rowsPerPage);
		const end = start + Number(rowsPerPage);

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = useMemo(() => {
		return [...(items ?? [])].sort((a: Announcement, b: Announcement) => {
			const first = a[sortDescriptor.column as keyof Announcement]!;
			const second = b[sortDescriptor.column as keyof Announcement]!;
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
				</div>
			</div>
		);
	}, []);

	return (
		<>
			<Card className="bg-[#A6F3B235]">
				<CardBody className="pt-8 ">
					<div className="px-5 flex justify-between">
						<div className="leading-loose">
							<h1 className="text-xl leading-none font-medium">
								Announcements
							</h1>
							<p className="text-sm leading-loose text-gray-400">
								List of announcements
							</p>
						</div>

						<Button
							color="success"
							className="text-white/90"
							as={Link}
							to="/admin/announcements/add"
							isDisabled={
								!["SUPER_ADMIN", "ADMIN_MANAGE_ANNOUNCEMENTS"].includes(role!)
							}>
							<Icon icon="lets-icons:add-ring-light" width="24" height="24" />
							Add Announcement
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
											<span className="text-sm">Total Scholars: </span>
											{data?.announcements.count || 0}
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
														(data?.announcements.count || 0) < Number(row.key)
													}>
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
				handleDeletion={async () => {
					try {
						await deleteAnnouncement({
							variables: {
								id: toDeleteItem?.id,
							},
						});
						toast.success("Announcement deleted successfully", {
							description: "The announcement has been removed.",
							position: "top-center",
							richColors: true,
						});
						setToDeleteItem(null);
						setOpenDeleteModal(false);
					} catch {
						toast.error("Failed to delete announcement", {
							description: "There was an error deleting the announcement.",
							position: "top-center",
							richColors: true,
						});
					}
				}}
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				title="Delete Announcement"
				description={`Are you sure to delete this announcement created by ${toDeleteItem?.createdBy.firstName} ${toDeleteItem?.createdBy.lastName}?`}
				loading={deletingAnnouncement}
			/>
		</>
	);
}
