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
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSetAtom } from "jotai";

import { DeleteModal } from "../__components";

import { DELETE_EVENT_MUTATION, READ_EVENTS_QUERY } from "@/queries";
import { CalendarEvent, Event, PaginationResult, StudentStatus } from "@/types";
import { FCalendar } from "@/components";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import { eventsAtom } from "@/states";
import { useAuth } from "@/contexts";
import { Gatherings } from "@/lib/constant";
import { Helmet } from "react-helmet";

const statusOptions: StudentStatus[] = [
	"REQUESTING",
	"SCHOLAR",
	"GRADUATED",
	"DISQUALIFIED",
	"ARCHIVED",
];

export const columns = [
	{ name: "TITLE", uid: "title", sortable: true },
	{ name: "DATE", uid: "date" },
	{ name: "TIME", uid: "time" },
	// { name: "STATUS", uid: "status" },
	{ name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
	"title",
	"date",
	"time",
	// "status",
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

export default function EventList() {
	const { role } = useAuth();
	const [rowsPerPage, setRowsPerPage] = useState<string>("25");
	const [page, setPage] = useState(1);
	const [filterValue, setFilterValue] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const setEvents = useSetAtom(eventsAtom);
	const navigate = useNavigate();
	const [toDeleteItem, setToDeleteItem] = useState<Pick<
		Event,
		"id" | "title"
	> | null>(null);
	const [visibleColumns, setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);
	const [deleteEvent, { loading: deletingEvent }] = useMutation(
		DELETE_EVENT_MUTATION
	);

	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "firstName",
		direction: "ascending",
	});
	// const [statusFilter] = useState<Array<SystemUserRole>>([]);
	const [statusFilter, setStatusFilter] = useState<Selection>("all");
	const hasSearchFilter = Boolean(filterValue);

	const { loading, data } = useQuery<{
		events: PaginationResult<Event>;
		calendarEvents: CalendarEvent[];
	}>(READ_EVENTS_QUERY, {
		// nextFetchPolicy: "standby",
		onCompleted: (data) => {
			setEvents(data?.events.data || []);
		},
	});

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const pages = useMemo(() => {
		return data?.events.count
			? Math.ceil(data?.events.count / Number(rowsPerPage))
			: 0;
	}, [rowsPerPage, data?.events.count]);

	const loadingState = loading ? "loading" : "idle";

	const renderCell = useCallback((event: Event, columnKey: React.Key) => {
		const cellValue = event[columnKey as keyof Event];

		switch (columnKey) {
			case "title":
				return <p>{event.title.substring(0, 25)}</p>;

			case "date":
				return formatEventDate(event.startDate, event.endDate);

			case "time":
				return formatEventTime(event.startTime, event.endTime);

			case "actions":
				return (
					<div className="relative flex  justify-center items-center gap-2">
						<Tooltip content="Details">
							<Button
								size="sm"
								isIconOnly
								variant="light"
								as={Link}
								to={`/admin/events/${event.id}`}
								className="text-lg text-default-400 cursor-pointer active:opacity-50">
								<Icon icon="solar:info-square-bold" color="gray" />
							</Button>
						</Tooltip>

						<Tooltip content="Edit Event">
							<Button
								size="sm"
								isIconOnly
								variant="light"
								isDisabled={!Gatherings.includes(role!)}
								as={Link}
								to={`/admin/events/${event.id}/edit`}
								className="text-lg text-default-400  cursor-pointer active:opacity-50">
								<Icon icon="fluent:status-12-filled" color="green" />
							</Button>
						</Tooltip>
						<Tooltip color="danger" content="Delete event">
							<Button
								size="sm"
								isIconOnly
								variant="light"
								isDisabled={!Gatherings.includes(role!)}
								onPress={() => {
									setToDeleteItem(event);
									setOpenModal(true);
								}}
								className="text-lg text-danger cursor-pointer active:opacity-50">
								<Icon icon="solar:trash-bin-minimalistic-bold" color="red" />
							</Button>
						</Tooltip>
					</div>
				);
			default:
				return cellValue?.toString();
		}
	}, []);

	const filteredItems = useMemo(() => {
		let filteredEvents = [...(data?.events.data ?? [])];

		if (hasSearchFilter) {
			setPage(1);
			filteredEvents = filteredEvents.filter((event) => {
				const filterVal = filterValue.toLowerCase();

				return event.title.toLowerCase().includes(filterVal);
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
	}, [data?.events.data, filterValue, statusFilter]);

	const items = useMemo(() => {
		const start = (page - 1) * Number(rowsPerPage);
		const end = start + Number(rowsPerPage);

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = useMemo(() => {
		return [...(items ?? [])].sort((a: Event, b: Event) => {
			const first = a[sortDescriptor.column as keyof Event]!;
			const second = b[sortDescriptor.column as keyof Event]!;
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
									Status
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								onSelectionChange={setStatusFilter}
								selectedKeys={statusFilter}
								closeOnSelect={false}
								aria-label="Table Columns"
								selectionMode="multiple">
								{statusOptions.map((status) => (
									<DropdownItem
										key={status}
										className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize">
										{status.toLowerCase()}
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
				<title>Events | Admin</title>
				<meta
					name="description"
					content="Manage events to engage scholars and provide them with opportunities for learning and growth."
				/>
			</Helmet>
			<Card className="bg-[#A6F3B235] mb-8">
				<CardBody className="pt-8 ">
					<div className="md:px-5 flex justify-between">
						<div className="leading-loose">
							<h1 className="text-xl leading-none font-medium">Events</h1>
							<p className="text-sm leading-loose text-gray-400">
								List of events
							</p>
						</div>

						<Button
							color="success"
							className="text-white/90"
							as={Link}
							isDisabled={!Gatherings.includes(role!)}
							to="/admin/events/add">
							<Icon icon="lets-icons:add-ring-light" width="24" height="24" />
							Add Event
						</Button>
					</div>

					<Tabs
						aria-label="Options"
						classNames={{
							tabList: "mt-5 md:mx-4  bg-emerald-600/5  ",
							cursor: "bg-success ",
							panel: "md:mx-4",
						}}>
						<Tab key="list-table" title="List Table">
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
													<span className="text-sm">Total Events: </span>
													{data?.events.count || 0}
												</p>
												<Select
													classNames={{
														trigger:
															"bg-green-600   group-hover:bg-green-600/95 ",
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
																(data?.events.count || 0) < Number(row.key)
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
						</Tab>
						<Tab key="calendar" title="Calendar">
							<FCalendar
								handlePress={(id) => {
									navigate(`/admin/events/${id}`);
								}}
								type="EVENT"
								events={data?.calendarEvents || []}
							/>
						</Tab>
					</Tabs>
				</CardBody>
			</Card>

			<DeleteModal
				hideNote={false}
				deleteLabel={`Delete event`}
				loading={deletingEvent}
				handleDeletion={async () => {
					try {
						if (!toDeleteItem) return;
						await deleteEvent({
							variables: {
								id: toDeleteItem.id,
							},
							refetchQueries: [READ_EVENTS_QUERY],
						});
						toast.success("Event deleted successfully", {
							description: "The event has been deleted.",
							position: "top-center",
							richColors: true,
						});
						setOpenModal(false);
					} catch (erro) {
						toast.error("Please try again later.", {
							description: "If the problem persists, contact support.",
							position: "top-center",
							richColors: true,
						});
					}
				}}
				open={openModal}
				setOpen={setOpenModal}
				title={"Delete Event"}
				description={"Are you sure you want to delete this event?"}
			/>
		</>
	);
}
