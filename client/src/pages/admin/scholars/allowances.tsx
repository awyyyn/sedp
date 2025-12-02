import { useQuery } from "@apollo/client";
import { Link, useLocation, useParams } from "react-router-dom";
import { Tab, Tabs } from "@heroui/tabs";
import { Helmet } from "react-helmet";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";

import { ErrorUI, MonthsTable } from "@/components";
import {
  READ_ALLOWANCES_QUERY,
  READ_ALLOWANCES_W_USER_INFO_QUERY,
} from "@/queries";
import { Allowance, PaginationResult, Student } from "@/types";
import { useAtom, useSetAtom } from "jotai";
import { studentAtom } from "@/states";

export default function ScholarAllowances() {
  const params = useParams();
  const setStudent = useSetAtom(studentAtom);
  const { data, error, loading, refetch } = useQuery<{
    allowances: PaginationResult<Allowance>;
    student: Student;
  }>(READ_ALLOWANCES_W_USER_INFO_QUERY, {
    variables: {
      studentId: params.scholarId,
      id: params.scholarId,
    },
    onCompleted: (data) => {
      if (data.student) {
        setStudent(data.student);
      }
    },
  });

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-3 w-[35rem]" />
          </div>
        </div>
        <Divider className="my-5" />

        <div className="flex gap-2">
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-14 rounded-lg" />
        </div>
        <div className="space-y-3 mt-4">
          <Skeleton className="h-8 rounded-lg w-full" />
          <Skeleton className="h-8 rounded-lg w-full" />
          <Skeleton className="h-8 rounded-lg w-full" />
          <Skeleton className="h-8 rounded-lg w-full" />
          <Skeleton className="h-8 rounded-lg w-full" />
        </div>
      </div>
    );
  }

  if (error || !data?.student) {
    return (
      <div className="min-h-[calc(100dvh-25dvh)] flex items-center justify-center">
        <ErrorUI
          onRefresh={async () => {
            await refetch({
              studentId: params.scholarId,
            });
          }}
        />
      </div>
    );
  }

  const groupedByYear = (data?.allowances.data || []).reduce<
    Record<number, Allowance[]>
  >((acc, allowance) => {
    const year = allowance.year;

    if (!acc[year]) acc[year] = [];

    acc[year].push(allowance);

    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Scholar Allowances | Admin</title>
        <meta
          name="description"
          content="View the allowance history for a scholar in the admin panel."
        />
      </Helmet>
      <div className="mt-5">
        <div className=" flex items-center gap-2">
          <div className="">
            <p className="text-gray-600 ">
              Here you can view the allowance history for the selected scholar (
              {`${data.student.lastName}, ${data.student.firstName}`}).
            </p>
          </div>
        </div>
        <Divider className="my-5" />
        {Object.entries(groupedByYear).length > 0 ? (
          <Tabs>
            {Object.entries(groupedByYear).map(([year, allowances]) => (
              <Tab
                key={year}
                title={year}
                className="bg-white dark:bg-gray-800"
              >
                <MonthsTable data={allowances} studentUser={data.student} />
              </Tab>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[70dvh]">
            <Icon
              icon="mage:file-question-mark-fill"
              width="96"
              height="96"
              style={{ color: "#888" }}
            />
            <p className="mt-4 text-gray-600">No allowances found.</p>
          </div>
        )}
      </div>
    </>
  );
}
