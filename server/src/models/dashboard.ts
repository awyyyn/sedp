import { Student, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { offices, officesOptions } from "../services/utils.js";

const today = new Date();
const beginningOfYear = new Date(today.getFullYear(), 0, 1);

export const studentsStatusOverview = async ({
  office,
}: { office?: string } = {}) => {
  let where: Prisma.StudentWhereInput = {};

  if (office) {
    where.office = office;
  }

  const data = await prisma.student.findMany({ where });

  type GroupedData = {
    [key: number]: Student[];
  };

  const groupedData = data.reduce((acc: GroupedData, item: Student) => {
    const { yearLevel } = item;
    if (!acc[yearLevel]) {
      acc[yearLevel] = [];
    }
    acc[yearLevel].push(item);
    return acc;
  }, {});

  return Object.entries(groupedData).map(([key, values]) => {
    const active = values.filter(
      (student) => student.status === "SCHOLAR",
    ).length;
    const disqualified = values.filter(
      (student) => student.status === "DISQUALIFIED",
    ).length;
    const graduated = values.filter(
      (student) => student.status === "GRADUATED",
    ).length;

    return {
      yearLevel: Number(key || 0),
      disqualified: disqualified || 0,
      graduated: graduated || 0,
      active: active || 0,
    };
  });
};

export const briefOverviewData = async ({
  office,
}: { office?: string } = {}) => {
  let where: Prisma.StudentWhereInput = {};

  if (office) {
    where.office = office;
  }

  const students = await prisma.student.count({ where });
  const newScholars = await prisma.student.findMany({
    where: {
      ...where,
      status: "SCHOLAR",
      createdAt: {
        gte: beginningOfYear,
      },
    },
  });
  const graduated = await prisma.student.findMany({
    where: {
      ...where,
      status: "GRADUATED",
      createdAt: {
        gte: beginningOfYear,
      },
    },
  });

  const events = await prisma.events.count();
  const newEvents = await prisma.events.findMany({
    where: {
      createdAt: {
        gte: beginningOfYear,
      },
    },
  });

  return {
    activeScholars: {
      avg: Number(((newScholars.length / students) * 100).toFixed(2)),
      new: newScholars.length,
    },
    totalScholars: {
      new: newScholars.length,
      avg: Number(((newScholars.length / students) * 100).toFixed(2)),
    },
    events: {
      new: newEvents.length,
      avg: Number(((newEvents.length / events) * 100).toFixed(2)),
    },
    graduated: {
      new: graduated.length,
      avg: Number(((graduated.length / students) * 100).toFixed(2)),
    },
  };
};

export const totalAllowancesData = async ({
  office,
}: { office?: string } = {}) => {
  let where: Prisma.AllowanceWhereInput = {
    createdAt: {
      gte: beginningOfYear,
    },
  };

  if (office) {
    where.student = {
      office,
    };
  }

  const allowances = await prisma.allowance.findMany({
    where,
    include: { student: true },
  });

  const totalAllowances = allowances.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0,
  );

  return totalAllowances;
};

export const officesReportsData = async () => {
  const data = await Promise.all(
    officesOptions.map(async (data) => {
      return await Promise.all(
        data.offices.map(async (office) => {
          const allowances = await prisma.allowance.findMany({
            where: {
              createdAt: {
                gte: beginningOfYear,
              },
              student: {
                office,
              },
            },
            include: {
              student: true,
            },
          });

          const totalAllowance = allowances.reduce(
            (acc, curr) => acc + curr.totalAmount,
            0,
          );

          const scholar = await prisma.student.findMany({
            where: {
              office,
            },
          });

          const totalActiveScholars = scholar.filter(
            (scholar) => scholar.status === "SCHOLAR",
          ).length;

          const totalGraduatesScholars = scholar.filter(
            (scholar) => scholar.status === "GRADUATED",
          ).length;

          const totalDisqualifiedScholars = scholar.filter(
            (scholar) => scholar.status === "DISQUALIFIED",
          ).length;

          return {
            name: `${office}, ${data.province}`,
            office,
            totalAllowance,
            totalScholars: scholar.length,
            totalActiveScholars,
            totalGraduatesScholars,
            totalDisqualifiedScholars,
          };
        }),
      );
    }),
  );

  return data.flat();
};

export const reportsByOfficeData = async ({
  office,
  schoolName,
}: { office?: string; schoolName?: string } = {}) => {
  const allowances = await prisma.allowance.findMany({
    where: {
      createdAt: {
        gte: beginningOfYear,
      },
      student: {
        office,
        schoolName,
      },
    },
    include: {
      student: true,
    },
  });

  const totalAllowance = allowances.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0,
  );

  const scholar = await prisma.student.findMany({
    where: {
      office,
      schoolName,
    },
  });

  const totalActiveScholars = scholar.filter(
    (scholar) => scholar.status === "SCHOLAR",
  ).length;
  const totalGraduatesScholars = scholar.filter(
    (scholar) => scholar.status === "GRADUATED",
  ).length;
  const totalDisqualifiedScholars = scholar.filter(
    (scholar) => scholar.status === "DISQUALIFIED",
  ).length;

  console.log(totalGraduatesScholars, "qq ggg");

  const totalMiscellaneousAllowance = allowances.reduce(
    (acc, curr) => acc + curr.miscellaneousAllowance,
    0,
  );
  const totalMonthlyAllowance = allowances.reduce(
    (acc, curr) => acc + curr.monthlyAllowance,
    0,
  );
  const totalBookAllowance = allowances.reduce(
    (acc, curr) => acc + curr.bookAllowance,
    0,
  );
  const totalThesisAllowance = allowances.reduce(
    (acc, curr) => acc + curr.thesisAllowance,
    0,
  );

  return {
    office: office || "All Offices",
    totalAllowance,
    totalScholars: scholar.length,
    totalActiveScholars,
    totalGraduatesScholars,
    totalDisqualifiedScholars,
    totalMiscellaneousAllowance,
    totalMonthlyAllowance,
    totalBookAllowance,
    totalThesisAllowance,
  };
};
