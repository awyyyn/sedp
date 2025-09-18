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
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Card, CardBody } from "@heroui/card";
import { useReactToPrint } from "react-to-print";
import { Helmet } from "react-helmet";

import UpdateStatusModal from "./__components/update-status";

import { READ_STUDENTS_QUERY } from "@/queries";
import logo from "@/assets/sedp-mfi.e31049f.webp";
import { Scholars as AllowedRoles } from "@/lib/constant";
import { PaginationResult, Student } from "@/types";
import { useAuth } from "@/contexts";

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "ALLOWANCES", uid: "email", sortable: true },
  { name: "MONTHLY DOCS", uid: "phoneNumber", sortable: true },
  { name: "SEMESTER DOCS", uid: "address" },
  { name: "ACTIONS", uid: "actions" },
];

const columnsWithoutDocs = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "ALLOWANCES", uid: "email", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "email",
  "phoneNumber",
  "address",
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
  const { role } = useAuth();
  const [filterValue, setFilterValue] = useState("");
  const { data: allUsers } = useQuery<{
    students: PaginationResult<Student>;
  }>(READ_STUDENTS_QUERY);

  const [openModal, setOpenModal] = useState(false);

  const [toUpdateScholar] = useState<Student | null>(null);
  const toPrintRef = useRef<HTMLDivElement>(null);
  const printFn = useReactToPrint({
    contentRef: toPrintRef,
    documentTitle: "Allowance List",
  });
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
    students: PaginationResult<Student>;
  }>(READ_STUDENTS_QUERY);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return (
      role !== "ADMIN_MANAGE_SCHOLAR" ? columns : columnsWithoutDocs
    ).filter((column) => Array.from(visibleColumns).includes(column.uid));
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

      case "email":
        return (
          <Button
            size="sm"
            as={Link}
            variant="light"
            state={{ scholar: user }}
            to={`/admin/scholars/${user.id}/allowance-history`}
          >
            Allowances
          </Button>
        );

      case "phoneNumber":
        return role !== "ADMIN_MANAGE_SCHOLAR" ? (
          <Button
            size="sm"
            variant="light"
            as={Link}
            state={{ scholar: user }}
            to={`/admin/scholars/${user.id}/monthly-docs`}
          >
            Monthly Docs
          </Button>
        ) : null;
      case "address":
        return role !== "ADMIN_MANAGE_SCHOLAR" ? (
          <Button
            size="sm"
            as={Link}
            variant="light"
            state={{ scholar: user }}
            to={`/admin/scholars/${user.id}/semester-docs`}
          >
            Semester Docs
          </Button>
        ) : null;
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Tooltip content="Details">
              <Link to={`/admin/scholars/${user.id}`}>
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <Icon icon="solar:info-square-bold" color="gray" />
                </span>
              </Link>
            </Tooltip>
            {/* {!user.statusUpdatedAt && (
							<Tooltip content="Update Status">
								<Button
									size="sm"
									isIconOnly
									variant="light"
									isDisabled={!AllowedRoles.includes(role!)}
									onPress={() => {
										setToUpdateScholar(user);
										setOpenModal(true);
									}}
									className="text-lg text-default-400  cursor-pointer active:opacity-50">
									<Icon icon="fluent:status-12-filled" color="green" />
								</Button>
							</Tooltip>
						)} */}
            {/* <Tooltip color="danger" content="Delete announcement">
							<span className="text-lg text-danger cursor-pointer active:opacity-50">
								<Icon icon="solar:trash-bin-minimalistic-bold" color="red" />
							</span>
						</Tooltip> */}
          </div>
        );
      case "status":
        return <p className="capitalize">{user.status.toLocaleLowerCase()}</p>;
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
                {(role !== "ADMIN_MANAGE_SCHOLAR"
                  ? columns
                  : columnsWithoutDocs
                ).map((column) => (
                  <DropdownItem
                    className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize"
                    key={column.uid}
                  >
                    {column.name.toLowerCase()}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [visibleColumns, statusFilter]);

  const handlePrint = async () => {
    printFn();
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Scholars | Admin</title>
        <meta
          name="description"
          content="View and manage scholars in the admin panel."
        />
      </Helmet>
      <div className="relative ">
        <Card className="bg-[#A6F3B235]">
          <CardBody className="pt-8 ">
            <div className="px-5 flex justify-between">
              <div className="leading-loose">
                <h1 className="text-xl leading-none font-medium">Scholar</h1>
                <p className="text-sm leading-loose text-gray-400">
                  List of scholars
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <Button
                  color="success"
                  className="text-white/90"
                  as={Link}
                  isDisabled={!AllowedRoles.includes(role!)}
                  to="/admin/scholars/add"
                >
                  <Icon
                    icon="lets-icons:add-ring-light"
                    width="24"
                    height="24"
                  />
                  Add Scholar
                </Button>
                <Button
                  color="primary"
                  onPress={handlePrint}
                  className="text-white/90"
                >
                  <Icon width="20" height="20" icon="fluent:print-16-regular" />
                  Print
                </Button>
              </div>
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
                        {data?.students.count || 0}
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
                              (data?.students.count || 0) < Number(row.key)
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
                // items={sortedItems ?? []}
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
        {toUpdateScholar && (
          <UpdateStatusModal
            isOpen={openModal}
            setIsOpen={setOpenModal}
            data={toUpdateScholar}
          />
        )}

        {allUsers?.students.data && allUsers?.students.data.length > 0 && (
          <div ref={toPrintRef} className="hidden print:block print:m-[0.75in]">
            <div className="w-full bg-white overflow-hidden">
              <div className="bg-yellow-100 py-10 relative flex justify-center items-center  px-4 border-b">
                <img
                  src={logo}
                  className="h-24 w-24 absolute left-3 rounded-full items-center mix-blend-multiply"
                  alt="sedp logo"
                />
                <div>
                  <h2 className="text-center font-semibold">
                    Scholarship Program
                  </h2>
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
                    </tr>
                  </thead>
                  <tbody className="text-xs bo print:text-xs">
                    {allUsers.students.data.map(
                      (scholar: any, index: number) => {
                        return (
                          <tr
                            key={scholar.id}
                            className="print:break-inside-avoid"
                          >
                            <td className="border border-gray-300 px-1 py-1 text-center">
                              {index + 1}
                            </td>
                            <td className="px-1 py-1 max-w-xs truncate">
                              {scholar.lastName}, {scholar.firstName}
                            </td>
                            <td className="px-1 py-1 text-center">
                              {scholar.yearLevel}
                            </td>
                            <td className="px-1 py-1 max-w-xs truncate">
                              {scholar.course}
                            </td>
                            <td className="px-1 py-1 max-w-xs truncate">
                              {scholar.schoolName}
                            </td>
                          </tr>
                        );
                      },
                    )}

                    {/* <tr className="print:break-inside-avoid">
										<td
											colSpan={3}
											className="border border-gray-300 px-1 py-1 text-right font-medium">
											Total Scholars:
										</td>
										<td className="border border-gray-300 px-1 py-1 text-right font-bold">
											{allUsers.students.count}
										</td>
									</tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
