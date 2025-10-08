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
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Card, CardBody } from "@heroui/card";
import { Helmet } from "react-helmet";
import { format } from "date-fns";

import { SystemUserModal } from "../__components";

import { TransactionDataModal } from "./_components/transaction-data-modal";

// import logo from "@/assets/sedp-mfi.e31049f.webp";
import { getTransactionMessage } from "@/lib/utils";
import { READ_TRANSACTIONS_QUERY } from "@/queries";
import {
  PaginationResult,
  SystemUser,
  Transaction,
  TransactionEntity,
} from "@/types";

export const columns = [
  { name: "ACTION", uid: "action", sortable: false },
  { name: "DESCRIPTION", uid: "description", sortable: false },
  { name: "DATA", uid: "entity", sortable: false },
  {
    name: "TRANSACTED BY",
    uid: "transactedBy",
    sortable: false,
  },

  { name: "Date", uid: "createdAt", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = [
  "action",
  "entity",
  "description",
  "id",
  "createdAt",
  "transactedBy",
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
  const [entity, setEntity] = useState<Selection>(new Set([]));
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<SystemUser | null>(null);
  // const toPrintRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<null | Transaction>(null);
  // const printFn = useReactToPrint({
  //   contentRef: toPrintRef,
  //   documentTitle: "Allowance List",
  // });
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "ascending",
  });
  // const [statusFilter] = useState<Array<SystemUserRole>>([]);
  const [statusFilter] = useState<Selection>("all");

  const { loading, data } = useQuery<{
    transactions: PaginationResult<Transaction>;
  }>(READ_TRANSACTIONS_QUERY);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const pages = useMemo(() => {
    return data?.transactions.count
      ? Math.ceil(data?.transactions.count / Number(rowsPerPage))
      : 0;
  }, [rowsPerPage, data?.transactions.count]);

  const loadingState = loading ? "loading" : "idle";

  const renderCell = useCallback(
    (transaction: Transaction, columnKey: React.Key) => {
      const cellValue = transaction[columnKey as keyof Transaction];

      switch (columnKey) {
        case "action":
          return (
            <p>
              {getTransactionMessage(transaction.action, transaction.entity)}
            </p>
          );

        case "transactedBy":
          return (
            <Button
              onPress={() => setUser(transaction.transactedBy)}
              size="sm"
              variant="ghost"
              className="outline-none border-none "
            >
              {transaction.transactedBy.firstName}{" "}
              {transaction.transactedBy.lastName}
            </Button>
          );

        case "entity":
          return (
            <Button
              onPress={() => setModal(transaction)}
              size="sm"
              variant="flat"
              color="primary"
            >
              View Data
            </Button>
          );

        case "createdAt":
          return `${format(new Date(transaction.createdAt), "MMM dd, yyyy")} at ${format(new Date(transaction.createdAt), "h:mm a")}`;

        default:
          return cellValue?.toString();
      }
    },
    [],
  );

  const filteredItems = useMemo(() => {
    let filteredTransactoins = [...(data?.transactions.data ?? [])];

    const toFilterEntity = Array.from(entity)[0] || null;

    if (entity !== "all" && toFilterEntity) {
      filteredTransactoins = filteredTransactoins.filter(
        (transaction) => transaction.entity === toFilterEntity,
      );
    }

    return filteredTransactoins;
  }, [data?.transactions.data, statusFilter, entity]);

  const items = useMemo(() => {
    const start = (page - 1) * Number(rowsPerPage);
    const end = start + Number(rowsPerPage);

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...(items ?? [])].sort((a: Transaction, b: Transaction) => {
      const first = a[sortDescriptor.column as keyof Transaction]!;
      const second = b[sortDescriptor.column as keyof Transaction]!;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col w-full ">
        <div className="flex justify-between flex-wrap sm:flex-nowrap gap-3 items-end">
          {/*<Input
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
            // onClear={() => setFilterValue("")}
            // onValueChange={setFilterValue}
          />*/}
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
                  Entity
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={entity}
                selectionMode="single"
                disallowEmptySelection={false}
                onSelectionChange={setEntity}
              >
                {Object.values(TransactionEntity).map((column) => (
                  <DropdownItem
                    className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize"
                    key={column}
                  >
                    {column.toLowerCase().replace("_", " ")}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
          </div>
        </div>
      </div>
    );
  }, [visibleColumns, statusFilter, entity]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Transactions | Admin</title>
        <meta
          name="description"
          content="View transactions only. No management or CRUD operations available."
        />
      </Helmet>
      <div className="relative ">
        <Card className="bg-[#A6F3B235]">
          <CardBody className="pt-8 ">
            <div className="px-5 flex justify-between">
              <div className="leading-loose">
                <h1 className="text-xl leading-none font-medium">
                  Transactions
                </h1>
                <p className="text-sm leading-loose text-gray-400">
                  List of transactions
                </p>
              </div>

              {/*<div className="flex gap-3 items-center">
                <Button
                  color="primary"
                  onPress={handlePrint}
                  className="text-white/90"
                >
                  <Icon width="20" height="20" icon="fluent:print-16-regular" />
                  Print
                </Button>
              </div>*/}
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
                      // isDisabled={hasSearchFilter}
                      total={pages}
                      onChange={setPage}
                    />
                    <div className="flex gap-3 items-center">
                      <p className="min-w-[100px] inline  ">
                        <span className="text-sm">Total Scholars: </span>
                        {data?.transactions.count || 0}
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
                              (data?.transactions.count || 0) < Number(row.key)
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

        {
          //   allUsers?.students.data && allUsers?.students.data.length > 0 && (
          //   <div ref={toPrintRef} className="hidden print:block print:m-[0.75in]">
          //     <div className="w-full bg-white overflow-hidden">
          //       <div className="bg-yellow-100 py-10 relative flex justify-center items-center  px-4 border-b">
          //         <img
          //           src={logo}
          //           className="h-24 w-24 absolute left-3 rounded-full items-center mix-blend-multiply"
          //           alt="sedp logo"
          //         />
          //         <div>
          //           <h2 className="text-center font-semibold">
          //             Scholarship Program
          //           </h2>
          //         </div>
          //       </div>
          //       <div className="w-full overflow-visible print:overflow-visible">
          //         <table className="w-full border-collapse text-sm print:text-xs">
          //           <thead>
          //             <tr>
          //               <th className="bg-blue-200 font-normal border border-gray-300 px-1 py-1 text-xs print:text-xs">
          //                 NO.
          //               </th>
          //               <th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
          //                 SCHOLAR&apos;S NAME
          //               </th>
          //               <th className="bg-blue-200 font-normal border border-gray-300 px-1 py-1 text-xs print:text-xs">
          //                 YR
          //               </th>
          //               <th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
          //                 COURSE
          //               </th>
          //               <th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
          //                 SCHOOL
          //               </th>
          //             </tr>
          //           </thead>
          //           <tbody className="text-xs bo print:text-xs">
          //             {allUsers.students.data.map(
          //               (scholar: any, index: number) => {
          //                 return (
          //                   <tr
          //                     key={scholar.id}
          //                     className="print:break-inside-avoid"
          //                   >
          //                     <td className="border border-gray-300 px-1 py-1 text-center">
          //                       {index + 1}
          //                     </td>
          //                     <td className="px-1 py-1 max-w-xs truncate">
          //                       {scholar.lastName}, {scholar.firstName}
          //                     </td>
          //                     <td className="px-1 py-1 text-center">
          //                       {scholar.yearLevel}
          //                     </td>
          //                     <td className="px-1 py-1 max-w-xs truncate">
          //                       {scholar.course}
          //                     </td>
          //                     <td className="px-1 py-1 max-w-xs truncate">
          //                       {scholar.schoolName}
          //                     </td>
          //                   </tr>
          //                 );
          //               },
          //             )}
          //           </tbody>
          //         </table>
          //       </div>
          //     </div>
          //   </div>
          // )
        }
        <SystemUserModal user={user} handleClose={() => setUser(null)} />
        {modal && (
          <TransactionDataModal
            transaction={modal}
            handleClose={() => setModal(null)}
            isOpen={!!modal}
          />
        )}
      </div>
    </>
  );
}
