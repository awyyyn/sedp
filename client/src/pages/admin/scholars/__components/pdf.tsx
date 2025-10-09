import { useEffect, useState } from "react";

import logo from "@/assets/sedp-mfi.e31049f.webp";
import { groupBySchool } from "@/lib/utils";
import { Student, StudentStatus, SystemUserRole } from "@/types";
import { useAuth } from "@/contexts";

interface PDFProps {
  toPrintRef: React.RefObject<HTMLDivElement>;
  role: SystemUserRole | "STUDENT";
  data: Student[];
  hasFilter?: boolean;
  office: string;
  school: string;
}

const StatusBGMap: Record<StudentStatus, string> = {
  DISQUALIFIED: "bg-yellow-300",
  GRADUATED: "bg-green-400",
  ARCHIVED: "",
  REQUESTING: "",
  SCHOLAR: "",
};

export default function PDF({
  toPrintRef,
  role,
  hasFilter,
  data,
  office,
  school,
}: PDFProps) {
  const [students, setStudents] = useState<
    Record<string, Student[]> | Student[]
  >([]);
  const { office: adminOffice } = useAuth();

  useEffect(() => {
    if (hasFilter) {
      setStudents(data);
    } else {
      const groupedData = groupBySchool(data);

      setStudents(groupedData);
    }
  }, [hasFilter, data]);

  return (
    <div
      ref={toPrintRef}
      //
      className="hidden print:block print:m-[0.75in]"
    >
      <div className="w-full bg-white overflow-hidden">
        <div className="bg-yellow-100 py-10 relative flex justify-center items-center  px-4 border-b">
          <img
            src={logo}
            className="h-24 w-24 absolute left-3 rounded-full items-center mix-blend-multiply"
            alt="sedp logo"
          />
          <div>
            <h2 className="text-center font-semibold">Scholarship Program</h2>
            <div className="text-sm    text-black/80 flex gap-2 items-center justify-center">
              {!hasFilter ? (
                <span>List of SEDP Scholars</span>
              ) : (
                <>
                  <span>
                    {role === "SUPER_ADMIN"
                      ? !office
                        ? "All Offices"
                        : office
                      : adminOffice}
                  </span>
                  {school && (
                    <>
                      <span>•</span>
                      <span>{school}</span>
                    </>
                  )}
                </>
              )}
            </div>
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
                {Array.isArray(students) && (
                  <th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
                    SCHOOL
                  </th>
                )}
                {role === "SUPER_ADMIN" && (
                  <th className="bg-blue-200 font-normal border border-gray-300 text-center py-1 text-xs print:text-xs">
                    OFFICE
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-xs bo print:text-xs">
              {Array.isArray(students)
                ? data.map((scholar: Student, index: number) => {
                    return (
                      <tr key={scholar.id} className="print:break-inside-avoid">
                        <td className="border border-gray-300 px-1 py-1 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 max-w-xs truncate">
                          {scholar.lastName}, {scholar.firstName}
                        </td>
                        <td className="border border-gray-300  px-1 py-1 text-center">
                          {scholar.yearLevel}
                        </td>
                        <td className="border border-gray-300  px-1 py-1 max-w-xs truncate">
                          {scholar.course}
                        </td>
                        <td className="border border-gray-300  px-1 py-1 max-w-xs truncate">
                          {scholar.schoolName}
                        </td>
                        {role === "SUPER_ADMIN" && (
                          <td className="border border-gray-300  ">
                            {scholar.office}
                          </td>
                        )}
                      </tr>
                    );
                  })
                : Object.entries(students).map(([key, students]) => {
                    return (
                      <>
                        <tr key={key} className="print:break-inside-avoid ">
                          <td
                            className="border border-gray-300 px-1 py-1 text-left font-bold"
                            colSpan={5}
                          >
                            {key}
                          </td>
                        </tr>

                        {students.map((scholar, index) => (
                          <tr
                            key={scholar.id}
                            className={`${StatusBGMap[scholar.status]}`}
                          >
                            <td className="border border-gray-300 px-1 py-1 text-center">
                              {index + 1}
                            </td>
                            <td className="px-1 border border-gray-300 py-1 max-w-xs truncate capitalize">
                              {scholar.lastName}, {scholar.firstName}
                            </td>
                            <td className="px-1 border border-gray-300 py-1 max-w-xs truncate">
                              {scholar.yearLevel}
                            </td>
                            <td className="px-1 border border-gray-300 py-1 max-w-xs truncate">
                              {scholar.course}
                            </td>

                            {role === "SUPER_ADMIN" && (
                              <td className="px-1 border border-gray-300 py-1 max-w-xs truncate">
                                {scholar.office}
                              </td>
                            )}
                          </tr>
                        ))}
                      </>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
