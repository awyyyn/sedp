import { useQuery } from "@apollo/client";
import { Tab, Tabs } from "@heroui/tabs";
import { Helmet } from "react-helmet";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { useState } from "react";
import { Divider } from "@heroui/divider";
import { Card, CardBody } from "@heroui/card";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

import MiniInfoCard from "./__components/mini-info-card";
import { RecentAnnouncements } from "./__components/announcement";
import ScholarStatusStat from "./__components/scholar-status-stat";
import { UpcomingEvents } from "./__components/upcoming-events";
import RecentTransactions from "./__components/recent-transactions";

import {
  Announcement,
  PaginationResult,
  ReportsByOfficeData,
  Transaction,
} from "@/types";
import { READ_REPORTS_BY_OFFICE_QUERY } from "@/queries";
import { ErrorUI } from "@/components";
import {
  headingClasses,
  officesOptions as opts,
  schoolOptions,
} from "@/lib/constant";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts";

const officesOptions = [
  {
    province: "All Offices",
    offices: ["All Offices"],
  },
].concat(opts);

export default function Dashboard() {
  const [selectedOffice, setSelectedOffice] = useState("All Offices");
  const [schoolName, setSchoolName] = useState("");
  const navigate = useNavigate();
  const { role } = useAuth();
  const { data, loading, error, refetch } = useQuery<{
    reportsByOffice: ReportsByOfficeData;
    announcements: PaginationResult<Announcement>;
    transactions: PaginationResult<Transaction>;
  }>(READ_REPORTS_BY_OFFICE_QUERY, {
    variables: {
      office: selectedOffice === "All Offices" ? undefined : selectedOffice,
      pagination: {
        page: 1,
        take: 5,
      },
      schoolName: schoolName || undefined,
      input: {
        office: selectedOffice === "All Offices" ? undefined : selectedOffice,
        pagination: {
          page: 1,
          take: 10,
        },
      },
    },
  });
  // const {
  //   data: officesData,
  //   loading: officesLoading,
  //   error: officesError,
  //   refetch: refetchOffices,
  // } = useQuery<{
  //   officesReports: OfficesReportData[];
  // }>(READ_OFFICES_REPORTS_QUERY);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Icon
          icon="lucide:loader-2"
          className="w-8 h-8 animate-spin text-gray-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorUI
          onRefresh={() => {
            refetch();
            // refetchOffices();
          }}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Dashboard | Admin</title>
        <meta
          name="description"
          content="View the dashboard to get an overview of scholars, events, and announcements."
        />
      </Helmet>
      <div className=" container  space-y-3 pb-10">
        <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-2">
          <h1 className="text-3xl font-medium">Dashboard</h1>
          <div className="flex gap-2 flex-col md:flex-row">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  size="lg"
                  color="primary"
                  className="px-4 min-w-[120px]"
                >
                  Print Reports
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="scholars"
                  onPress={() => navigate("/admin/scholars")}
                >
                  Scholars Report
                </DropdownItem>
                <DropdownItem
                  key="allowances"
                  onPress={() => navigate("/admin/allowances")}
                >
                  Allowances Report
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Autocomplete
              size="sm"
              label="School Name"
              defaultItems={schoolOptions}
              selectedKey={schoolName}
              inputProps={{
                classNames: {
                  inputWrapper:
                    "bg-[#a6f3b2] data-[hover=true]:bg-[#a6f3b290] data-[focus=true]:bg-[#a6f3b290]",
                },
              }}
              classNames={{
                popoverContent: "bg-[#a6f3b2]  ",

                // selectorButton: " data-[hover=true]:bg-[#a6f3b290]  ",
                // clearButton: " data-[hover=true]:bg-[#a6f3b290]  ",
                // base: "data-[hover=true]:bg-[#a6f3b290]   ",
              }}
              name="schoolName"
              onSelectionChange={(e) => {
                setSchoolName(e as string);
              }}
              className="lg:min-w-[350px]  "
            >
              {(item) => (
                <AutocompleteItem
                  className="!data-[hover=true]:bg-red-400"
                  classNames={{
                    base: "data-[hover=true]:text-white data-[hover=true]:bg-[#1f4e26]",
                  }}
                  key={item.key}
                >
                  {item.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
            {role === "SUPER_ADMIN" && (
              <Select
                disallowEmptySelection
                className=" border-none ring-0 outline-none lg:min-w-[180px]"
                classNames={{
                  innerWrapper: "",
                  value: "text-black",
                  trigger: "bg-[#a6f3b2] data-[hover=true]:bg-[#a6f3b290]  ",
                  popoverContent:
                    "bg-[#a6f3b2] data-[focus=true]:bg-[#a6f3b2] hover:bg-[#a6f3b2]",
                  selectorIcon: "text-black",
                }}
                size="sm"
                label="Office"
                variant="flat"
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
                          key={office}
                          classNames={{
                            base: "data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white",
                          }}
                        >
                          {office}
                        </SelectItem>
                      ))}
                    </SelectSection>
                  );
                })}
              </Select>
            )}
          </div>
        </div>
        <Divider className="my-3" />
        <br />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniInfoCard
            description={`${data?.reportsByOffice.totalActiveScholars} active scholars`}
            icon={
              <Icon
                icon="solar:users-group-two-rounded-broken"
                width="24"
                height="24"
                className="text-gray-500"
              />
            }
            title="Total Scholars"
            value={data?.reportsByOffice.totalScholars || 0}
          />
          <MiniInfoCard
            description={`currently enrolled`}
            icon={
              <Icon
                icon="solar:users-group-two-rounded-broken"
                width="24"
                height="24"
                className="text-gray-500"
              />
            }
            title="Active Scholars"
            value={data?.reportsByOffice.totalActiveScholars || 0}
          />
          <MiniInfoCard
            description={`Completed program`}
            icon={
              <Icon
                icon="solar:users-group-two-rounded-broken"
                width="24"
                height="24"
                className="text-gray-500"
              />
            }
            title="Graduated Scholars"
            value={data?.reportsByOffice.totalGraduatesScholars || 0}
          />
          <MiniInfoCard
            description={`Distributed this year`}
            icon={
              <Icon
                icon="tabler:currency-peso"
                width="24"
                height="24"
                className="text-gray-500"
              />
            }
            title="Total Allowances"
            value={formatCurrency(data?.reportsByOffice.totalAllowance || 0)}
          />
        </div>

        <br />

        <Tabs aria-label="dashbaord tabs" className="">
          <Tab key="overview" title="Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 mb-8">
              <Card className="p-5">
                <div className=" pb-2">
                  <h1 className="leading-5 text-lg font-medium text-muted-foreground">
                    Student Status Distribution
                  </h1>
                  <p className="text-gray-400">Breakdown by current status</p>
                </div>
                <CardBody className="space-y-5">
                  <ScholarStatusStat
                    color="primary"
                    title="SCHOLAR"
                    total={data?.reportsByOffice.totalScholars || 0}
                    value={data?.reportsByOffice.totalActiveScholars || 0}
                  />
                  <ScholarStatusStat
                    color="success"
                    title="GRADUATED"
                    total={data?.reportsByOffice.totalScholars || 0}
                    value={data?.reportsByOffice.totalGraduatesScholars || 0}
                  />
                  <ScholarStatusStat
                    color="warning"
                    title="DISQUALIFIED"
                    total={data?.reportsByOffice.totalScholars || 0}
                    value={data?.reportsByOffice.totalDisqualifiedScholars || 0}
                  />
                </CardBody>
              </Card>
              <Card className="p-5">
                <div className="    pb-2">
                  <h1 className="leading-5 text-lg font-medium text-muted-foreground">
                    Allowance Distribution
                  </h1>
                  <p className="text-gray-400">Breakdown by allowance type</p>
                </div>
                <CardBody className="space-y-5">
                  <ScholarStatusStat
                    isAllowance
                    color="primary"
                    title="Monthly Allowance"
                    total={data?.reportsByOffice.totalAllowance || 0}
                    value={data?.reportsByOffice.totalMonthlyAllowance || 0}
                  />
                  <ScholarStatusStat
                    isAllowance
                    color="success"
                    title="Book Allowance"
                    total={data?.reportsByOffice.totalAllowance || 0}
                    value={data?.reportsByOffice.totalBookAllowance || 0}
                  />
                  <ScholarStatusStat
                    color="secondary"
                    title="Thesis Allowance"
                    isAllowance
                    total={data?.reportsByOffice.totalAllowance || 0}
                    value={data?.reportsByOffice.totalThesisAllowance || 0}
                  />
                  <ScholarStatusStat
                    color="warning"
                    title="Miscellaneous"
                    isAllowance
                    total={data?.reportsByOffice.totalAllowance || 0}
                    value={
                      data?.reportsByOffice.totalMiscellaneousAllowance || 0
                    }
                  />

                  <Divider />
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-lg">Total</h1>
                    <h1 className="font-semibold text-lg">
                      {formatCurrency(
                        data?.reportsByOffice.totalAllowance || 0,
                      )}
                    </h1>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div>
              <div>
                <RecentAnnouncements
                  announcements={data?.announcements.data || []}
                />
              </div>
              <div>
                <UpcomingEvents events={[]} />
              </div>
            </div>
          </Tab>

          <Tab key="transactions" title="Transactions">
            <RecentTransactions transactions={data?.transactions.data || []} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
