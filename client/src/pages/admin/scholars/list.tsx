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
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import { formatDate } from "date-fns";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/input";
import { Link } from "react-router-dom";
import { lazy } from "react";
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
import { useAtomValue } from "jotai";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";

import UpdateStatusModal from "./__components/update-status";
import { SendNotifModal } from "./__components/send-notif-modal";

import { READ_STUDENTS_QUERY } from "@/queries";
import {
  Scholars as AllowedRoles,
  headingClasses,
  officesOptions as opts,
  schoolOptions,
} from "@/lib/constant";
import { PaginationResult, Student } from "@/types";
import { useAuth } from "@/contexts";
import { scholarsSentNotificationsAtom } from "@/states";

const PDF = lazy(() => import("./__components/pdf"));

const officesOptions = [
  {
    province: "All Offices",
    offices: ["All Offices"],
  },
].concat(opts);

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "ALLOWANCES", uid: "email", sortable: true },
  { name: "MONTHLY DOCS", uid: "phoneNumber", sortable: true },
  {
    name: `${formatDate(Date.now(), "MMMM").toUpperCase()} DOCS`,
    uid: "documents",
    sortable: true,
  },
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
  "documents",
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
  const [school, setSchool] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<string>("25");
  const [page, setPage] = useState(1);
  const { role, office } = useAuth();
  const [filterValue, setFilterValue] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("All Offices");
  const { data: allUsers } = useQuery<{
    students: PaginationResult<Student>;
  }>(READ_STUDENTS_QUERY, {
    variables: {
      school: school || undefined,
      office:
        selectedOffice === "All Offices"
          ? undefined
          : role === "SUPER_ADMIN"
            ? selectedOffice
            : office,
    },
  });
  const [sendNotifToStudent, setSendNotifToStudent] = useState<Student | null>(
    null,
  );
  const alreadySentNotif = useAtomValue(scholarsSentNotificationsAtom);
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
  }>(READ_STUDENTS_QUERY, {
    variables: {
      includeDocs: true,
      school: school || undefined,
      office: selectedOffice === "All Offices" ? undefined : selectedOffice,
    },
  });

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

  const renderCell = useCallback(
    (user: Student, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof Student];

      switch (columnKey) {
        case "name":
          const middleName = user.middleName
            ? ` ${user.middleName[0].toUpperCase()}.`
            : "";

          return <p>{`${user.firstName}${middleName} ${user.lastName}`}</p>;

        case "documents":
          return (
            <p
              className={`${user.documents?.length ? "" : "italic text-gray-500"}`}
            >
              {user.documents?.length
                ? `${user.documents.length} doc(s)`
                : "No Data"}
              {alreadySentNotif.includes(user.id)}
            </p>
          );

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
              {role !== "ADMIN_MANAGE_SCHOLAR" && (
                <Tooltip content="Send Notification for Document Submission">
                  <Button
                    type="button"
                    size="sm"
                    onPress={() => {
                      setSendNotifToStudent(user);
                    }}
                    isIconOnly
                    isDisabled={
                      !!user.documents?.length ||
                      alreadySentNotif.includes(user.id) ||
                      user.status !== "SCHOLAR"
                    }
                    variant="ghost"
                    className="border hover:!bg-none border-none"
                  >
                    {/*<span className="text-lg text-default-400 cursor-pointer active:opacity-50">*/}
                    <Icon
                      icon="streamline-flex:mail-send-email-message-circle-solid"
                      color="green"
                      height={16}
                      width={16}
                    />
                    {/*</span>*/}
                  </Button>
                </Tooltip>
              )}
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
          return (
            <p className="capitalize">{user.status.toLocaleLowerCase()}</p>
          );
        default:
          return cellValue?.toString();
      }
    },
    [alreadySentNotif],
  );

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
              base: "w-full sm:max-w-[24%]",
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
            {role === "SUPER_ADMIN" && (
              <>
                <Select
                  disallowEmptySelection
                  className=" border-none ring-0 outline-none max-w-[200px]  "
                  classNames={{
                    innerWrapper: "",
                    value: "text-black",
                    trigger: "bg-[#a6f3b2] data-[hover=true]:bg-[#a6f3b290]  ",
                    popoverContent:
                      "bg-[#a6f3b2] data-[focus=true]:bg-[#a6f3b2] hover:bg-[#a6f3b2]",
                    selectorIcon: "text-black",
                  }}
                  size="md"
                  // labelPlacement="outside-left"
                  // label="Office"
                  placeholder="Office"
                  color="success"
                  scrollShadowProps={{
                    isEnabled: false,
                  }}
                  selectedKeys={[selectedOffice]}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                >
                  {officesOptions.map((office) => {
                    return (
                      <SelectSection
                        classNames={{
                          heading: `${headingClasses} !bg-[#32753d] !text-white`,
                        }}
                        showDivider
                        title={office.province}
                        key={office.province}
                      >
                        {office.offices.map((office) => (
                          <SelectItem
                            classNames={{
                              base: "data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white",
                            }}
                            key={office}
                          >
                            {office}
                          </SelectItem>
                        ))}
                      </SelectSection>
                    );
                  })}
                </Select>
              </>
            )}
            <Autocomplete
              size="md"
              // label="School Name"
              defaultItems={schoolOptions}
              placeholder="Filter by School"
              variant="bordered"
              classNames={{
                popoverContent: "border-1 bg-[#A6F3B2]  !border-green-600",
              }}
              selectedKey={school}
              onSelectionChange={(e) => {
                setSchool(e as string);
              }}
              className="lg:max-w-[450px]  rounded-xl   bg-[#A6F3B2]  "
            >
              {(item) => (
                <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
              )}
            </Autocomplete>
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
  }, [visibleColumns, statusFilter, school, selectedOffice]);

  const handlePrint = async () => {
    printFn();
  };

  console.log("qqq selected", selectedOffice, school);

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

        {sendNotifToStudent && (
          <SendNotifModal
            isOpen={!!sendNotifToStudent}
            handleClose={() => setSendNotifToStudent(null)}
            student={sendNotifToStudent}
          />
        )}

        <Suspense>
          <PDF
            data={allUsers?.students.data || []}
            office={selectedOffice}
            role={role!}
            toPrintRef={toPrintRef}
            hasFilter={!!school}
            school={school}
          />
        </Suspense>
      </div>
    </>
  );
}
