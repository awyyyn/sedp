import { GraphQLError } from "graphql";
import { AppContext, DocumentInput } from "../../types/index.js";
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from "../../models/documents.js";

export const documentsResolver = async (
  _: never,
  {
    month,
    schoolYear,
    semester,
    year,
    monthlyDocument = true,
    scholarId,
  }: {
    monthlyDocument?: boolean;
    year?: number;
    month?: number;
    schoolYear?: string;
    semester?: number;
    scholarId?: string;
  },
  app: AppContext,
) => {
  try {
    let studentId: string | undefined = undefined;
    let office: string | undefined = undefined;
    if (app.role === "STUDENT") {
      studentId = app.id;
    }

    if (scholarId && app.role !== "STUDENT") {
      studentId = scholarId;
      if (app.role !== "SUPER_ADMIN") {
        office = app.office;
      }
    }

    return await getDocuments({
      monthlyDocument,
      studentId,
      month,
      schoolYear,
      semester,
      year,
      office,
    });
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Internal Server Error!");
  }
};

export const createDocumentResolver = async (
  _: never,
  { input }: { input: DocumentInput },
  app: AppContext,
) => {
  console.log(input);
  try {
    const document = await createDocument({
      ...input,
      studentId: app.id,
    });

    if (!document) {
      throw new GraphQLError("Document creation failed");
    }
    return document;
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Internal Server Error!");
  }
};

export const deleteDocumentResolver = async (
  _: never,
  { id }: { id: string },
  app: AppContext,
) => {
  try {
    const document = await deleteDocument(id, app.id);

    if (!document) {
      throw new GraphQLError("Document deletion failed");
    }
    return document;
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Internal Server Error!");
  }
};

export const updateDocumentResolver = async (
  _: never,
  { id, input }: { id: string; input: Partial<DocumentInput> },
) => {
  try {
    if (!id) {
      throw new GraphQLError("Document ID is required");
    }

    const updatedDocument = await updateDocument(id, input);

    if (!updatedDocument) {
      throw new GraphQLError("Document update failed");
    }

    return updatedDocument;
  } catch (err) {
    console.log(err);
    throw new GraphQLError("Internal Server Error!");
  }
};
