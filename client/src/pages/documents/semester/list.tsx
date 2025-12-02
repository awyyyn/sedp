import { useState } from "react";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "sonner";

import { FileTree } from "../../../components/file-tree";
import ErrorFetching from "../__components/error-fetch";

import { useAuth } from "@/contexts";
import { Document, FileTreeItem, SystemUserRole } from "@/types";
import {
  CREATE_ADMIN_NOTIFICATION_MUTATION,
  READ_DOCUMENTS_QUERY,
} from "@/queries";
import { DocumentTable, PreviewModal } from "@/components";
import { getFileExtension, imagesExtensions } from "@/lib/constant";

const semester = [
  "1st Semester",
  "2nd Semester",
  // "3rd Semester"
];

export const generateFolders = (
  date: string,
  yearLevelJoined: number,
): FileTreeItem[] => {
  // const subDate = sub(new Date(date), { years: yearLevel });
  const yearStarted = new Date(date).getFullYear();
  const items: FileTreeItem[] = [];

  let yearIndex = yearLevelJoined;
  let plusYear = 0;

  if (yearLevelJoined === 1) {
    plusYear = 5;
  } else if (yearLevelJoined === 2) {
    plusYear = 4;
  } else if (yearLevelJoined === 3) {
    plusYear = 3;
  } else if (yearLevelJoined === 4) {
    plusYear = 2;
  } else if (yearLevelJoined === 5) {
    plusYear = 1;
  }

  for (let year = yearStarted; year < yearStarted + plusYear; year++) {
    items.push({
      id: year.toString(),
      name: `${year}-${year + 1}`,
      type: "folder",
      // disabled: year < yearLevelJoined,
      // disabled: year > yearStarted || year > new Date().getFullYear() + 1,
      children: semester.map((sem, index) => ({
        id: `${yearIndex}-${year}-${index + 1}`,
        name: sem,
        type: "file",
        children: [],
      })),
    });

    yearIndex++;
  }

  return items;
};

function showUploadButton(
  activeFileId: string,
  yearLevel: number,
  semester: number,
) {
  const selectedYearLevel = Number(activeFileId.split("-")[0]);
  const selectedSem = Number(activeFileId.split("-")[2]);

  if (
    selectedYearLevel !== yearLevel &&
    selectedYearLevel === yearLevel + 1 &&
    selectedSem === 1 &&
    semester > 1
  ) {
    return selectedSem === 1;
  }

  return selectedYearLevel === yearLevel && selectedSem > semester;
}

export default function Semester() {
  const { studentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultActiveField = searchParams.get("active") || "";
  const [activeFileId, setActiveFileId] = useState<string>(defaultActiveField);
  // const [data, setData] = useState<Document[]>([]);
  // const [fetchDocuments, { loading }] = useLazyQuery(READ_DOCUMENTS_QUERY, {
  // 	fetchPolicy: "no-cache",
  // });
  const { loading, refetch, error, data } = useQuery<{ documents: Document[] }>(
    READ_DOCUMENTS_QUERY,
    {
      fetchPolicy: "no-cache",
      variables: {
        monthlyDocument: false,
        semester: Number(activeFileId.split("-")[2]),
        schoolYear: `${activeFileId.split("-")[1]}-${Number(activeFileId.split("-")[1]) + 1}`,
        scholarId: studentUser?.id,
      },
    },
  );
  const [previewModal, onPreviewModalChange] = useState(false);
  const [toPreview, setToPreview] = useState<string | null>(null);
  const [sendNotification, { loading: sendingNotif }] = useMutation(
    CREATE_ADMIN_NOTIFICATION_MUTATION,
  );
  const [sentNotification, setSentNotification] = useState(false);

  const handleFileSelect = async (fileId: string) => {
    setActiveFileId(fileId);
  };

  const handleSendNotification = async () => {
    try {
      await sendNotification({
        variables: {
          type: "SEMESTER_DOCUMENT",
          link: `/admin/semester-submissions/${studentUser?.id!}?year=${activeFileId!.split("-")[1]}&semester=${Number(activeFileId!.split("-")[2])}&yearLevel=${activeFileId!.split("-")[0]}`,
          message: "A scholar has submitted documents for review.",
          title: "Document Review Request",
          role: "ADMIN_MANAGE_DOCUMENTS" as SystemUserRole,
        },
      });

      setSentNotification(true);
      toast.success("Notification sent successfully.", {
        duration: 5000,
        richColors: true,
        description: "Admin has been notified.",
      });
    } catch (error) {
      toast.error("Failed to send notification.", {
        duration: 5000,
        richColors: true,
        description: "Please try again later.",
      });
    }
  };

  const handleRefetch = async () => {
    await refetch({
      variables: {
        monthlyDocument: false,
        semester: Number(activeFileId.split("-")[2]),
        schoolYear: `${activeFileId.split("-")[1]}-${Number(activeFileId.split("-")[1]) + 1}`,
      },
    });
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Semester Documents | SEDP</title>
        <meta
          name="description"
          content="View and manage your semester documents for the SEDP scholarship program."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="px-5 container mx-auto md:px-0">
        <div className="">
          <div className="text-2xl font-semibold">Semester Documents</div>
          <div className="text-sm text-gray-500">
            Here you can view and manage your semester documents.
          </div>
        </div>

        <div className=" mt-5 relative">
          <div className="md:absolute relative px-2 md:top-0 md:left-0   md:w-[200px] md:max-w-[200px]">
            <h1>School Year </h1>
            <p className="text-sm mb-2 text-gray-500">
              Select a semester to view documents.{" "}
              {activeFileId && semester[Number(activeFileId.split("-")[1]) - 1]}
            </p>
            <FileTree
              activeFileId={activeFileId}
              onFileSelect={handleFileSelect}
              items={generateFolders(
                studentUser?.createdAt || new Date().toISOString(),
                studentUser?.yearLevelJoined!,
              )}
              isDisabled={sendingNotif}
            />
          </div>
          <div className="md:ml-[210px] w-full md:w-[calc(100%-210px)]    mt-5 md:mt-0  ">
            {!activeFileId ? (
              <div className="flex items-center min-h-[calc(100dvh-50dvh)] justify-center w-full h-full">
                <p className="text-2xl font-semibold text-gray-500">
                  Select a folder.
                </p>
              </div>
            ) : error ? (
              <ErrorFetching handleRefetch={handleRefetch} />
            ) : (
              <>
                <div className="sticky p-2 flex justify-between md:p-4 top-0 left-0 w-full h-full bg-primary  bg-opacity-5 backdrop-blur-md   z-10">
                  <h1 className="text-2xl p-2 font-semibold text-gray-500">
                    Documents for{" "}
                    {semester[Number(activeFileId.split("-")[2]) - 1]} of S.Y.{" "}
                    {Number(activeFileId.split("-")[1])}-
                    {Number(activeFileId.split("-")[1]) + 1}
                  </h1>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button
                      className=""
                      isIconOnly
                      onPress={handleRefetch}
                      variant="light"
                      radius="full"
                    >
                      <Icon
                        className={``}
                        icon="solar:refresh-circle-linear"
                        width="24"
                        height="24"
                      />
                    </Button>
                    {showUploadButton(
                      activeFileId,
                      studentUser?.yearLevel!,
                      studentUser?.semester!,
                    ) && (
                      <>
                        {data?.documents &&
                          data.documents.length > 0 &&
                          !sentNotification && (
                            <Button
                              isLoading={sendingNotif}
                              color="success"
                              className="text-white"
                              onPress={handleSendNotification}
                            >
                              Send Notification to Admin
                            </Button>
                          )}
                        <Button
                          isDisabled={sendingNotif}
                          as={Link}
                          to="upload"
                          color="primary"
                          state={{
                            semester: activeFileId.split("-")[2],
                            year: activeFileId.split("-")[1],
                            yearLevel: activeFileId.split("-")[0],
                          }}
                        >
                          Upload Document
                        </Button>
                      </>
                    )}
                  </div>
                </div>{" "}
                <div className="overflow-y-auto max-h-[calc(100dvh-30dvh)] pb-20 ">
                  <DocumentTable
                    handleRowClick={(url) => {
                      onPreviewModalChange(true);
                      setToPreview(url);
                    }}
                    isLoading={loading}
                    data={data?.documents || []}
                    // isLoading={loading || isLoading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {toPreview && (
        <PreviewModal
          src={toPreview}
          type={
            imagesExtensions.includes(getFileExtension(toPreview) || "png")
              ? `image`
              : "document"
          }
          isOpen={previewModal}
          onOpenChange={onPreviewModalChange}
        />
      )}
    </>
  );
}
