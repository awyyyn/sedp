import { useQuery } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import { Tab, Tabs } from "@heroui/tabs";
import { Helmet } from "react-helmet";

import { ErrorUI, MonthsTable } from "@/components";
import { READ_ALLOWANCES_QUERY } from "@/queries";
import { Allowance, PaginationResult } from "@/types";

export default function ScholarAllowances() {
  const params = useParams();
  const { state } = useLocation();

  const { data, error, loading, refetch } = useQuery<{
    allowances: PaginationResult<Allowance>;
  }>(READ_ALLOWANCES_QUERY, {
    variables: {
      studentId: params.scholarId,
      includeStudent: true,
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
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
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold ">Allowance History</h1>
          <p className="text-gray-600 mb-4">
            Here you can view the allowance history for the selected scholar (
            {`${state.scholar.lastName}, ${state.scholar.firstName}`}).
          </p>
        </div>
        <Tabs>
          {Object.entries(groupedByYear).map(([year, allowances]) => (
            <Tab key={year} title={year} className="bg-white dark:bg-gray-800">
              <MonthsTable data={allowances} studentUser={state.scholar} />
            </Tab>
          ))}
        </Tabs>
      </div>
    </>
  );
}
