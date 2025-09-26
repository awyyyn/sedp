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
import { Helmet } from "react-helmet";
import { Spinner } from "@heroui/spinner";
import { useCallback, useMemo, useState } from "react";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { Tooltip } from "@heroui/tooltip";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Card, CardBody } from "@heroui/card";
import { format } from "date-fns";

import { ToUpdateModal } from "./__components/to-update-modal";

import { LATE_SUBMISSION_REQUESTS_QUERY } from "@/queries";
import { MonthlyLateSubmitter, PaginationResult } from "@/types";

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "MONTH", uid: "month" },
  { name: "YEAR", uid: "year" },
  { name: "REASON", uid: "reason" },
  { name: "REQUESTED AT", uid: "requestedAt" },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "month",
  "year",
  "requestedAt",
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

export default function Page() {
  const [rowsPerPage, setRowsPerPage] = useState<string>("25");
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [toUpdate, setToUpdate] = useState<null | {
    approve: boolean;
    request: MonthlyLateSubmitter;
  }>(null);

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "firstName",
    direction: "ascending",
  });
  // const [statusFilter] = useState<Array<SystemUserRole>>([]);
  const [statusFilter] = useState<Selection>("all");
  const hasSearchFilter = Boolean(filterValue);

  const { loading, data } = useQuery<{
    requests: PaginationResult<MonthlyLateSubmitter>;
  }>(LATE_SUBMISSION_REQUESTS_QUERY, {});

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const pages = useMemo(() => {
    return data?.requests.count
      ? Math.ceil(data?.requests.count / Number(rowsPerPage))
      : 0;
  }, [rowsPerPage, data?.requests.count]);

  const loadingState = loading ? "loading" : "idle";

  const renderCell = useCallback(
    (request: MonthlyLateSubmitter, columnKey: React.Key) => {
      const cellValue = request[columnKey as keyof MonthlyLateSubmitter];

      switch (columnKey) {
        case "name":
          return `${request.student.firstName} ${request.student.lastName}`;

        case "month":
          return format(new Date().setMonth(request.month - 1), "MMMM");

        case "requestedAt":
          return format(new Date(request.createdAt), "MMM dd, yyyy");

        case "actions":
          return (
            <div className="relative flex  justify-center items-center gap-1">
              <Tooltip content="Reject">
                <Button
                  size="sm"
                  isIconOnly
                  variant="light"
                  color="danger"
                  onPress={() => {
                    setToUpdate({ approve: false, request });
                  }}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <Icon icon="carbon:close-filled" color="red" />
                </Button>
              </Tooltip>
              <Tooltip content="Approve">
                <Button
                  size="sm"
                  isIconOnly
                  variant="light"
                  color="success"
                  onPress={() => {
                    setToUpdate({ approve: true, request });
                  }}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <Icon icon="duo-icons:approved" color="green" />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue?.toString();
      }
    },
    [],
  );

  const filteredItems = useMemo(() => {
    let filteredEvents = [...(data?.requests.data ?? [])];

    // if (
    // 	statusFilter !== "all" &&
    // 	Array.from(statusFilter).length !== statusOptions.length
    // ) {
    // 	filteredEvents = filteredEvents.filter((user) => {
    // 		return Array.from(statusFilter).includes(user.);
    // 	});
    // }

    return filteredEvents;
  }, [data?.requests.data, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * Number(rowsPerPage);
    const end = start + Number(rowsPerPage);

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...(items ?? [])].sort(
      (a: MonthlyLateSubmitter, b: MonthlyLateSubmitter) => {
        const first = a[sortDescriptor.column as keyof MonthlyLateSubmitter]!;
        const second = b[sortDescriptor.column as keyof MonthlyLateSubmitter]!;
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      },
    );
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
        <title>Late Requests | Admin</title>
        <meta name="description" content="Manage late submission requests" />
      </Helmet>
      <Card className="bg-[#A6F3B235] mb-8">
        <CardBody className="pt-8 ">
          <div className="md:px-5 flex justify-between">
            <div className="leading-loose">
              <h1 className="text-xl leading-none font-medium">
                Monthly Late Submission Requests
              </h1>
              <p className="text-sm leading-loose text-gray-400">
                Manage late submission requests here.
              </p>
            </div>

            {/*<Button
              color="success"
              className="text-white/90"
              as={Link}
              isDisabled={!Gatherings.includes(role!)}
              to="/admin/meetings/add"
            >
              <Icon icon="lets-icons:add-ring-light" width="24" height="24" />
              Add Meeting
            </Button>*/}
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
                      {data?.requests.count || 0}
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
                      }}
                    >
                      {rowsPerPageItems.map((row) => (
                        <SelectItem
                          color="success"
                          key={row.key}
                          className="data-[hover=true]:text-white data-[selected=true]:text-white data-[focus=true]:text-white data-[focus-visible=true]:text-white data-[hover=true]:bg-green-600   data-[selected=true]:bg-green-600"
                          isReadOnly={
                            (data?.requests.count || 0) < Number(row.key)
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
        </CardBody>
      </Card>
      {toUpdate?.request && (
        <ToUpdateModal
          approve={toUpdate.approve}
          handleClose={() => {
            setToUpdate(null);
          }}
          request={toUpdate?.request}
        />
      )}
    </>
  );
}
