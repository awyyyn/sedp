import { prisma } from "../services/prisma.js";
import { Events, Prisma } from "@prisma/client";
import { PaginationArgs } from "../types/system-user.js";
import { CalendarEvent, PaginationResult } from "../types/index.js";
import { addDays, format } from "date-fns";
import { startOfMonth, endOfMonth } from "date-fns";
import { generateTransactionDescription } from "../services/utils.js";

export const upsertEvent = async (
  {
    description,
    endDate,
    endTime,
    location,
    startDate,
    startTime,
    title,
    systemUserId,
  }: Omit<Events, "id" | "createdAt"> & { systemUserId: string },
  toUpdateId?: string,
) => {
  const isToUpdate = toUpdateId !== "681234567890101112131415";
  return await prisma.$transaction(async (tx) => {
    const user = await tx.systemUser.findUnique({
      where: { id: systemUserId },
    });

    if (!user) throw new Error("User not found");

    const event = await tx.events.upsert({
      create: {
        description,
        endDate,
        endTime,
        location,
        startDate,
        startTime,
        title,
      },
      update: {
        description,
        endDate,
        endTime,
        location,
        startDate,
        startTime,
        title,
      },
      where: {
        id: toUpdateId,
      },
    });

    if (!event) throw new Error("Event not created or updated");

    const transaction = await tx.transaction.create({
      data: {
        action: isToUpdate ? "UPDATE" : "CREATE",
        entity: "EVENT",
        entityId: event.id,
        description: generateTransactionDescription(
          isToUpdate ? "UPDATE" : "CREATE",
          "EVENT",
          user,
        ),
        transactedBy: {
          connect: { id: user.id },
        },
      },
    });

    if (!transaction) throw new Error("Transaction not created");

    return event;
  });
};

export async function readAllEvents({
  filter,
  pagination,
}: PaginationArgs<never> = {}): Promise<PaginationResult<Events>> {
  let where: Prisma.EventsWhereInput = {};

  if (filter) {
    where = { title: { contains: filter } };
  }

  const events = await prisma.events.findMany({
    where,
    orderBy: {
      startDate: "desc",
    },
    take: pagination ? pagination.take : undefined,
    skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
  });

  const count = await prisma.events.count({
    where,
  });

  const hasMore = pagination
    ? pagination.page * pagination.take < count
    : false;

  return {
    data: events,
    count: count,
    hasMore: hasMore,
  };
}

export async function readEvent(id: string) {
  return await prisma.events.findUnique({
    where: {
      id,
    },
  });
}

export const deleteEvent = async (id: string, systemUser: string) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.systemUser.findUnique({
      where: { id: systemUser },
    });

    if (!user) throw new Error("User not found");

    const event = await tx.events.delete({
      where: { id },
    });

    if (!event) throw new Error("Event not found");

    const transaction = await tx.transaction.create({
      data: {
        action: "DELETE",
        entity: "EVENT",
        entityId: event.id,
        description: generateTransactionDescription("DELETE", "EVENT", user),
        transactedBy: {
          connect: { id: user.id },
        },
      },
    });

    if (!transaction) throw new Error("Transaction not created");

    return event;
  });
};

export const readEventAsCalendar = async (): Promise<CalendarEvent[]> => {
  const allEvents = await prisma.events.findMany({});

  // const futureEvents = allEvents.data.filter((event) =>
  // 	isFuture(event.startDate)
  // );

  const setTimeOnDate = (date: Date, timeString: string) => {
    // Split the timeString into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Set the hours and minutes on the provided date
    date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    return date;
  };

  return allEvents.map((event) => {
    // Start Date & Time
    const start = setTimeOnDate(
      new Date(event.startDate),
      format(event.startTime, "HH:mm"),
    );

    // End Date & Time
    const end = setTimeOnDate(
      new Date(event.endDate),
      format(event.endTime, "HH:mm"),
    );

    const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;

    return {
      id: event.id,
      start: start.toISOString(),
      end: end.toISOString(),
      location: event.location,
      title: event.title,
      backgroundColor: color,
      borderColor: color,
    } as CalendarEvent;
  });
};

export const readMonthlyEvents = async (year: number, month: number) => {
  const date = new Date(year, month);

  const startDate = addDays(startOfMonth(date), 1);
  const endDate = addDays(endOfMonth(new Date(year, month)), 1);

  const events = await prisma.events.findMany({
    where: {
      startDate: {
        gte: startDate.toISOString(),
        lte: endDate.toISOString(),
      },
    },
  });

  return events;
};
