import { Announcement, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { PaginationArgs } from "../types/system-user.js";
import { AnnouncementWithRelation, PaginationResult } from "../types/index.js";
import { generateTransactionDescription } from "../services/utils.js";

export const createAnnouncement = async ({
  content,
  createdById,
  title,
}: Pick<Announcement, "content" | "createdById" | "title">) => {
  return await prisma.$transaction(async (tx) => {
    const systemUser = await tx.systemUser.findUnique({
      where: { id: createdById },
    });

    if (!systemUser) throw new Error("System user not found");

    const newAnnouncement = await prisma.announcement.create({
      data: {
        content,
        createdBy: {
          connect: {
            id: createdById,
          },
        },
        title,
      },
    });

    if (!newAnnouncement) throw new Error("Failed to create new announcement!");

    const transaction = await tx.transaction.create({
      data: {
        action: "CREATE",
        description: generateTransactionDescription(
          "CREATE",
          "ANNOUNCEMENT",
          systemUser,
        ),
        entity: "ANNOUNCEMENT",
        entityId: newAnnouncement.id,
        transactedBy: {
          connect: {
            id: createdById,
          },
        },
      },
    });

    if (!transaction) throw new Error("Failed to create transaction log!");

    return {
      ...newAnnouncement,
      createdAt: newAnnouncement.createdAt.toISOString(),
    };
  });
};

export const readAnnouncements = async ({
  filter,
  pagination,
}: PaginationArgs<never> = {}): Promise<
  PaginationResult<AnnouncementWithRelation>
> => {
  let where: Prisma.AnnouncementWhereInput = {};

  if (filter) {
    where = {
      title: { contains: filter },
    };
  }

  const announcements = await prisma.announcement.findMany({
    where,
    include: {
      createdBy: true,
    },
    take: pagination ? pagination.take : undefined,
    orderBy: {
      createdAt: "desc",
    },
    skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
  });

  const count = await prisma.announcement.count({
    where,
  });

  const hasMore = pagination
    ? pagination.page * pagination.take < count
    : false;

  return {
    data: announcements,
    count: count,
    hasMore: hasMore,
  };
};

export const readAnnouncement = async (
  id: string,
): Promise<AnnouncementWithRelation | null> => {
  return await prisma.announcement.findUnique({
    where: {
      id,
    },
    include: {
      createdBy: true,
    },
  });
};

export const editAnnouncement = async ({
  content,
  title,
  id,
  editedById,
}: Pick<Announcement, "content" | "id" | "title"> & { editedById: string }) => {
  return await prisma.$transaction(async (tx) => {
    const systemUser = await tx.systemUser.findUnique({
      where: { id: editedById },
    });

    if (!systemUser) throw new Error("System user not found");

    const newAnnouncement = await tx.announcement.update({
      data: {
        content,
        title,
      },
      where: {
        id,
      },
    });

    if (!newAnnouncement) throw new Error("Failed to create new announcement!");

    const transaction = await tx.transaction.create({
      data: {
        entityId: newAnnouncement.id,
        action: "UPDATE",
        entity: "ANNOUNCEMENT",
        description: generateTransactionDescription(
          "UPDATE",
          "ANNOUNCEMENT",
          systemUser,
        ),
        transactedBy: {
          connect: {
            id: editedById,
          },
        },
      },
    });

    if (!transaction) throw new Error("Failed to create transaction log!");

    return {
      ...newAnnouncement,
      createdAt: newAnnouncement.createdAt.toISOString(),
    };
  });
};

export const deleteAnnouncement = async (id: string, transactedBy: string) => {
  return await prisma.$transaction(async (tx) => {
    const systemUser = await tx.systemUser.findUnique({
      where: { id: transactedBy },
    });

    if (!systemUser) throw new Error("System user not found");

    const announcement = await tx.announcement.delete({
      where: {
        id,
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        entityId: announcement.id,
        action: "DELETE",
        entity: "ANNOUNCEMENT",
        description: generateTransactionDescription(
          "DELETE",
          "ANNOUNCEMENT",
          systemUser,
        ),
        transactedBy: {
          connect: {
            id: transactedBy,
          },
        },
      },
    });

    if (!transaction) throw new Error("Failed to create transaction log!");

    return announcement;
  });
};
