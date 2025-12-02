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
import { Helmet } from "react-helmet";
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
import { formatDate } from "date-fns";

import { DeleteModal } from "../__components";

import { DELETE_MEETING_MUTATION, READ_MEETINGS_QUERY } from "@/queries";
import { CalendarEvent, Meeting, PaginationResult } from "@/types";
import { FCalendar } from "@/components";
import { formatEventTime } from "@/lib/utils";
import { Gatherings } from "@/lib/constant";
import { useAuth } from "@/contexts";

export const columns = [
  { name: "TITLE", uid: "title", sortable: true },
  { name: "DATE", uid: "date" },
  { name: "TIME", uid: "time" },
  // { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["title", "date", "time", "actions"];

const rowsPerPageItems = [
  { key: "25", label: "25" },
  { key: "50", label: "50" },
  {
    key: "100",
    label: "100",
  },
];

export default function MeetingList() {
  const { role } = useAuth();
  const [rowsPerPage, setRowsPerPage] = useState<string>("25");
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [toDeleteItem] = useState<Pick<Meeting, "id" | "title"> | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [deleteMeeting, { loading: deletingEvent }] = useMutation(
    DELETE_MEETING_MUTATION,
  );

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "firstName",
    direction: "ascending",
  });
  // const [statusFilter] = useState<Array<SystemUserRole>>([]);
  const [statusFilter] = useState<Selection>("all");
  const hasSearchFilter = Boolean(filterValue);

  const { loading, data } = useQuery<{
    meetings: PaginationResult<Meeting>;
    calendarMeetings: CalendarEvent[];
  }>(READ_MEETINGS_QUERY, {});

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const pages = useMemo(() => {
    return data?.meetings.count
      ? Math.ceil(data?.meetings.count / Number(rowsPerPage))
      : 0;
  }, [rowsPerPage, data?.meetings.count]);

  const loadingState = loading ? "loading" : "idle";

  const renderCell = useCallback((meeting: Meeting, columnKey: React.Key) => {
    const cellValue = meeting[columnKey as keyof Meeting];

    switch (columnKey) {
      case "title":
        return <p>{meeting.title.substring(0, 25)}</p>;

      case "date":
        return formatDate(meeting.date, "MMMM dd, yyyy");

      case "time":
        return formatEventTime(meeting.startTime, meeting.endTime);

      case "actions":
        return (
          <div className="relative flex  justify-center items-center gap-2">
            <Tooltip content="Details">
              <Button
                size="sm"
                isIconOnly
                variant="light"
                as={Link}
                to={`/admin/meetings/${meeting.id}`}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <Icon icon="solar:info-square-bold" color="gray" />
              </Button>
            </Tooltip>

            <Tooltip content="Edit Meeting">
              <Button
                size="sm"
                isIconOnly
                variant="light"
                as={Link}
                isDisabled={!Gatherings.includes(role!)}
                to={`/admin/meetings/${meeting.id}/edit`}
                className="text-lg text-default-400  cursor-pointer active:opacity-50"
              >
                <Icon icon="fluent:status-12-filled" color="green" />
              </Button>
            </Tooltip>
            {/*<Tooltip color="danger" content="Delete meeting">
              <Button
                size="sm"
                isIconOnly
                variant="light"
                isDisabled={!Gatherings.includes(role!)}
                onPress={() => {
                  setToDeleteItem(meeting);
                  setOpenModal(true);
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <Icon icon="solar:trash-bin-minimalistic-bold" color="red" />
              </Button>
            </Tooltip>*/}
          </div>
        );
      default:
        return cellValue?.toString();
    }
  }, []);

  const filteredItems = useMemo(() => {
    let filteredEvents = [...(data?.meetings.data ?? [])];

    if (hasSearchFilter) {
      setPage(1);
      filteredEvents = filteredEvents.filter((meeting) => {
        const filterVal = filterValue.toLowerCase();

        return meeting.title.toLowerCase().includes(filterVal);
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
  }, [data?.meetings.data, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * Number(rowsPerPage);
    const end = start + Number(rowsPerPage);

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...(items ?? [])].sort((a: Meeting, b: Meeting) => {
      const first = a[sortDescriptor.column as keyof Meeting]!;
      const second = b[sortDescriptor.column as keyof Meeting]!;
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
              }}
            >
              <DropdownTrigger className="hidden sm:flex bg-[#A6F3B2]">
                <Button
                  endContent={
                    <Icon
                      icon="mynaui:chevron-down-solid"
                      width="24"
                      height="24"
                    />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                disallowEmptySelection
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem
                    className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize"
                    key={column.uid}
                  >
                    {column.name.toLowerCase()}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* <Dropdown
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
						</Dropdown> */}
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
        <title>Meetings | Admin</title>
        <meta
          name="description"
          content="Manage your meetings efficiently with our admin page. View, add, edit, and delete meetings seamlessly. Stay organized and keep track of all your scheduled gatherings."
        />
      </Helmet>
      <Card className="bg-[#A6F3B235] mb-8">
        <CardBody className="pt-8 ">
          <div className="md:px-5 flex justify-between">
            <div className="leading-loose">
              <h1 className="text-xl leading-none font-medium">Meetings</h1>
              <p className="text-sm leading-loose text-gray-400">
                List of meetings
              </p>
            </div>

            <Button
              color="success"
              className="text-white/90"
              as={Link}
              isDisabled={!Gatherings.includes(role!)}
              to="/admin/activities/meetings/add"
            >
              <Icon icon="lets-icons:add-ring-light" width="24" height="24" />
              Add Meeting
            </Button>
          </div>

          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "mt-5 md:mx-4  bg-emerald-600/5  ",
              cursor: "bg-success ",
              panel: "md:mx-4",
            }}
          >
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
                          <span className="text-sm">Total Meetings: </span>
                          {data?.meetings.count || 0}
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
                          }}
                        >
                          {rowsPerPageItems.map((row) => (
                            <SelectItem
                              color="success"
                              key={row.key}
                              className="data-[hover=true]:text-white data-[selected=true]:text-white data-[focus=true]:text-white data-[focus-visible=true]:text-white data-[hover=true]:bg-green-600   data-[selected=true]:bg-green-600"
                              isReadOnly={
                                (data?.meetings.count || 0) < Number(row.key)
                              }
                            >
                              {row.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  ) : null
                }
              >
                <TableHeader columns={headerColumns}>
                  {(column) => (
                    <TableColumn
                      className="bg-[#A6F3B2]"
                      allowsSorting={column.sortable}
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  emptyContent={"No rows to display."}
                  loadingContent={<Spinner />}
                  loadingState={loadingState}
                  items={sortedItems ?? []}
                >
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
                  navigate(`/admin/meetings/${id}`);
                }}
                type="MEETING"
                events={data?.calendarMeetings || []}
              />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      <DeleteModal
        hideNote={false}
        deleteLabel={`Delete meeting`}
        loading={deletingEvent}
        handleDeletion={async () => {
          try {
            if (!toDeleteItem) return;
            await deleteMeeting({
              variables: {
                id: toDeleteItem.id,
              },
              refetchQueries: [READ_MEETINGS_QUERY],
            });
            toast.success("Meeting deleted successfully", {
              description: "The meeting has been deleted.",
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
        title={"Delete Meeting"}
        description={"Are you sure you want to delete this meeting?"}
      />
    </>
  );
}
