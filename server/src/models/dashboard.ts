import { Student, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { sub } from "date-fns";

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
        gte: sub(new Date(), { months: 6 }),
      },
    },
  });
  const graduated = await prisma.student.findMany({
    where: {
      ...where,
      status: "GRADUATED",
    },
  });

  const events = await prisma.events.count();
  const newEvents = await prisma.events.findMany({
    where: {
      createdAt: {
        gte: sub(new Date(), { months: 1 }),
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
