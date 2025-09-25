import { Document, Prisma } from "@prisma/client";
import { prisma } from "../services/prisma.js";
import { DocumentInput } from "../types/index.js";

export const createDocument = async (input: DocumentInput) => {
  const { studentId, ...data } = input;
  const document = await prisma.document.create({
    data: {
      ...data,
      student: {
        connect: {
          id: studentId,
        },
      },
    },
    include: {
      student: true,
    },
  });

  return document;
};

export const deleteDocument = async (id: string, ownerId: string) => {
  const document = await prisma.document.delete({
    where: {
      id,
      studentId: ownerId,
    },
    include: {
      student: true,
    },
  });

  return document;
};

export const getDocuments = async ({
  studentId,
  year,
  month,
  schoolYear,
  semester,
  monthlyDocument = true,
  office,
}: {
  studentId?: string;
  year?: number;
  monthlyDocument?: boolean;
  schoolYear?: string;
  semester?: number;
  month?: number;
  type?: Document["documentType"];
  office?: string;
} = {}) => {
  let where: Prisma.DocumentWhereInput = {
    monthlyDocument,
  };

  if (studentId) {
    where.studentId = studentId;
  }

  if (year) {
    where.year = year;
  }

  if (month) {
    where.month = month;
  }

  if (schoolYear) {
    where.schoolYear = schoolYear;
  }

  if (semester) {
    where.semester = semester;
  }

  if (office) {
    where.student = {
      office,
    };
  }

  const documents = await prisma.document.findMany({
    where,
    include: {
      student: true,
    },
  });

  return documents.map((doc) => ({
    ...doc,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  }));
};

export const updateDocument = async (
  toUpdate: string,
  data: Partial<DocumentInput>,
) => {
  const updatedDocument = await prisma.document.update({
    where: {
      id: toUpdate,
    },
    data,
  });

  return updatedDocument;
};
