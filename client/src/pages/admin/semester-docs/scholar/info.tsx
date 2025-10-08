import { Link, useParams, useSearchParams } from "react-router-dom";
import { Selection } from "@react-types/shared";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tooltip } from "@heroui/tooltip";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { Alert } from "@heroui/alert";

import EditModal from "./_components/edit-modal";

import { DocumentTable, PreviewModal } from "@/components";
import { Document, Student } from "@/types";
import {
  READ_SCHOLAR_SEMESTER_DOCUMENTS_QUERY,
  READ_STUDENT_QUERY,
} from "@/queries";
import { getFileExtension, imagesExtensions, semester } from "@/lib/constant";

const getYears = (yearStarted: number, yearLevelJoined: number) => {
  const years = [];

  let plusYear = 0;
  let yearLevel = yearLevelJoined;

  if (yearLevelJoined === 1) {
    plusYear = 4;
  } else if (yearLevelJoined === 2) {
    plusYear = 3;
  } else if (yearLevelJoined === 3) {
    plusYear = 2;
  } else if (yearLevelJoined === 4) {
    plusYear = 1;
  } else if (yearLevelJoined === 5) {
    plusYear = 0;
  }

  for (let i = yearStarted; i <= yearStarted + plusYear; i++) {
    years.push(`${i}-${yearLevel}`);
    yearLevel++;
  }

  return years;
};

export default function StudentSemesterFiles() {
  const { scholarId } = useParams();
  const [searchParams] = useSearchParams();
  // const { state }: { state: { scholar: Student } } = useLocation();
  // const scholar = state.scholar;

  // const createdAt = !isNaN(Number(scholar.createdAt))
  // 	? Number(scholar.createdAt)
  // 	: scholar.createdAt;
  // const year = new Date(createdAt).getFullYear();
  const { data: studentData } = useQuery<{ student: Student }>(
    READ_STUDENT_QUERY,
    {
      variables: {
        id: scholarId,
      },
    },
  );
  const [yearFilter, setYearFilter] = useState<Selection>(
    new Set([
      searchParams.get("year") ? `${searchParams.get("year")}` : "none",
    ]),
  );
  const [semesterFilter, setSemesterFilter] = useState<Selection>(
    new Set([searchParams.get("semester") || 1]),
  );
  const { loading, data } = useQuery<{
    documents: Document[];
  }>(READ_SCHOLAR_SEMESTER_DOCUMENTS_QUERY, {
    variables: {
      scholarId: scholarId,
      semester: Number(Array.from(semesterFilter)[0]),
      schoolYear: !isNaN(
        Number(String(Array.from(yearFilter)[0]).split("-")[0]),
      )
        ? `${Number(Array.from(yearFilter)[0])}-${Number(Array.from(yearFilter)[0]) + 1}`
        : null,
      monthlyDocument: false,
    },
  });

  const [previewModal, onPreviewModalChange] = useState(false);
  const [toPreview, setToPreview] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(
    searchParams.get("yearLevel") ? `${searchParams.get("yearLevel")}` : null,
  );

  if (!studentData?.student) return;

  // useEffect(() => {
  // 	if (!error) {
  // 		refetch({
  // 			scholarId: scholarId,
  // 			schoolYear: !isNaN(Number(Array.from(yearFilter)[0]))
  // 				? `${Number(Array.from(yearFilter)[0])}-${Number(Array.from(yearFilter)[0]) + 1}`
  // 				: null,
  // 			semester: Number(Array.from(semesterFilter)[0]),
  // 			monthlyDocument: false,
  // 		});
  // 	}
  // }, [yearFilter, semesterFilter]);

  const scholar = studentData.student;

  const yearStarted = new Date(
    !isNaN(Number(scholar.createdAt))
      ? Number(scholar.createdAt)
      : scholar.createdAt,
  ).getFullYear();

  const years = getYears(yearStarted, studentData.student.yearLevelJoined);

  const selectedSemester = Number(Array.from(semesterFilter)[0]);
  // const selectedYear = Number(Array.from(yearFilter)[0]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Scholar Semester Document | Admin</title>
        <meta
          name="description"
          content="View the semester documents submitted by a scholar in the admin panel."
        />
      </Helmet>
      <div className="container mx-auto  py-5">
        <div className="flex-col md:flex-row flex  justify-between items-center ">
          <div className="flex items-center gap-2">
            <Tooltip content="Back">
              <Button
                variant="solid"
                color="primary"
                as={Link}
                to="/admin/scholars"
                className=" "
                isIconOnly
              >
                <Icon
                  icon="iconamoon:arrow-left-2-bold"
                  width="24"
                  height="24"
                />
              </Button>
            </Tooltip>
            <div>
              <h1 className="text-2xl">
                {scholar.firstName} {scholar.lastName}&apos;s <span>files</span>
              </h1>
              <p className="md:max-w-2xl text-sm text-default-400">
                The list below displays the files submitted by the student for
                the semester submission process. Please click on a file to view
                more details.
              </p>
            </div>
          </div>
          <div className=" w-full md:w-auto py-4 md:py-0 flex gap-2 items-center">
            <Dropdown
              classNames={{
                content: "bg-[#A6F3B2]",
              }}
            >
              <DropdownTrigger className=" flex bg-[#A6F3B2]">
                <Button
                  endContent={
                    <Icon
                      icon="mynaui:chevron-down-solid"
                      width="24"
                      height="24"
                    />
                  }
                  size="md"
                  variant="flat"
                >
                  {isNaN(Number(Array.from(yearFilter)[0]))
                    ? "Select School Year"
                    : `S.Y. ${Number(Array.from(yearFilter)[0])} - ${Number(Array.from(yearFilter)[0]) + 1}`}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                // onSelectionChange={(year) => {
                // 	if (!year) return;
                // 	setYearFilter(Number(year.currentKey));
                // }}
                onSelectionChange={(key) => {
                  if (!key) return;

                  const keyString = Array.from(key)[0].toString().split("-")[0];
                  const keySet = new Set([keyString]);

                  setSelectedYear(Array.from(key)[0].toString().split("-")[1]);
                  setYearFilter(keySet);
                }}
                selectedKeys={yearFilter}
                aria-label="Year Filter"
                selectionMode="single"
              >
                {years.map((year) => (
                  <DropdownItem
                    key={year}
                    className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize"
                  >
                    {Number(year.split("-")[0])} -{" "}
                    {Number(year.split("-")[0]) + 1}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown
              classNames={{
                content: "bg-[#A6F3B2]",
              }}
            >
              <DropdownTrigger className="  bg-[#A6F3B2]">
                <Button
                  endContent={
                    <Icon
                      icon="mynaui:chevron-down-solid"
                      width="24"
                      height="24"
                    />
                  }
                  size="md"
                  variant="flat"
                >
                  {semester[selectedSemester - 1]}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                // onSelectionChange={(year) => {
                // 	if (!year) return;
                // 	setYearFilter(Number(year.currentKey));
                // }}
                disallowEmptySelection
                onSelectionChange={setSemesterFilter}
                selectedKeys={semesterFilter}
                aria-label="Year Filter"
                selectionMode="single"
              >
                {[1, 2, 3].map((year) => (
                  <DropdownItem
                    key={year}
                    className="data-[focus=true]:!bg-[#1f4e26] data-[focus=true]:!text-white capitalize"
                  >
                    {semester[year - 1]}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        {scholar.status === "GRADUATED" && (
          <Alert
            className="my-2  "
            color="success"
            variant="flat"
            title={`This is a graduated scholar.`}
          />
        )}
        <div className="relative px-0.5">
          {isNaN(Number(Array.from(yearFilter)[0])) && (
            <div className="absolute min-h-[300px] top-0 left-0 backdrop-blur-sm flex justify-center items-center  z-10 h-full w-full">
              <h1 className="text-2xl font-semibold text-gray-800">
                Select a School Year to Fetch Documents
              </h1>
            </div>
          )}
          <DocumentTable
            data={data?.documents || []}
            isLoading={loading}
            handleRowClick={(url) => {
              onPreviewModalChange(true);
              setToPreview(url);
            }}
          />
          {toPreview && (
            <PreviewModal
              src={toPreview}
              type={
                imagesExtensions.includes(getFileExtension(toPreview) || "png")
                  ? `image`
                  : `document`
              }
              isOpen={previewModal}
              onOpenChange={onPreviewModalChange}
            />
          )}
        </div>

        {!isNaN(Number(Array.from(yearFilter)[0])) &&
          (Number(selectedYear) > scholar.yearLevel ||
            (Number(selectedYear) === scholar.yearLevel &&
              selectedSemester > scholar.semester)) &&
          (data?.documents.length || 0) > 0 &&
          scholar.status === "SCHOLAR" && (
            <div className="absolute bottom-0 left-0 right-0 bg-white p-5 md:px-10 flex justify-between items-center">
              <EditModal
                scholar={scholar}
                semester={selectedSemester}
                yearLevel={Number(selectedYear)}
              />
            </div>
          )}
      </div>
    </>
  );
}
