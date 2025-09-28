import { GraphQLError } from "graphql";
import { AppContext, PaginationArgs } from "../../types/index.js";
import {
  createAnnouncement,
  deleteAnnouncement,
  editAnnouncement,
  readAnnouncement,
  readAnnouncements,
} from "../../models/announcement.js";

export const createAnnouncementResolver = async (
  _: never,
  values: { title: string; content: string },
  app: AppContext,
) => {
  try {
    if (
      !(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_GATHERINGS")
    ) {
      throw new GraphQLError("UnAuthorized!");
    }

    const announcement = await createAnnouncement({
      content: values.content,
      title: values.title,
      createdById: app.id,
    });

    if (!announcement) {
      throw new GraphQLError("Error occurred while creating announcement!");
    }

    return announcement;
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Internal Server Error!");
  }
};

export const announcementsResolver = async (
  _: never,
  { filter, pagination }: PaginationArgs<never>,
) => {
  try {
    return await readAnnouncements({ filter, pagination });
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Internal Server Error!");
  }
};

export const announcementResolver = async (
  _: never,
  { id }: { id: string },
) => {
  try {
    return await readAnnouncement(id);
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Internal Server Error!");
  }
};

export const updateAnnouncementResolver = async (
  _: never,
  values: { title: string; content: string; id: string },
  app: AppContext,
) => {
  try {
    if (
      !(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_GATHERINGS")
    ) {
      throw new GraphQLError("UnAuthorized!");
    }

    const announcement = await editAnnouncement({
      content: values.content,
      title: values.title,
      id: values.id,
      editedById: app.id,
    });

    if (!announcement) {
      throw new GraphQLError("Error occurred while updating announcement!");
    }

    return announcement;
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Internal Server Error!");
  }
};

export const deleteAnnouncementResolver = async (
  _: never,
  { id }: { id: string },
  app: AppContext,
) => {
  try {
    if (
      !(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_GATHERINGS")
    ) {
      throw new GraphQLError("UnAuthorized!");
    }

    const announcement = await deleteAnnouncement(id, app.id);

    if (!announcement) {
      throw new GraphQLError("Error occurred while deleting announcement!");
    }

    return announcement;
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Internal Server Error!");
  }
};
