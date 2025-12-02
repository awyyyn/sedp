import { environment } from "../environments/environment.js";

import { prisma } from "../services/prisma.js";
import { generateTransactionDescription } from "../services/utils.js";
import {
  CreateScholarInput,
  PaginationArgs,
  PaginationResult,
  Student,
  StudentStatus,
} from "../types/index.js";
import { Prisma } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
import { sendCredentials } from "./email-model.js";

export const createStudent = async (
  values: CreateScholarInput,
  systemUserId?: string,
): Promise<Student> => {
  const student = await prisma.$transaction(async (tx) => {
    const {
      address,
      birthDate,
      email,
      firstName,
      lastName,
      gender,
      mfaSecret,
      middleName,
      password,
      course,
      schoolName,
      phoneNumber,
      office,
      semester,
      yearLevel,
    } = values;

    const isStudentExist = await tx.student.count({
      where: { email: email },
    });

    const systemUser = await tx.systemUser.findUnique({
      where: { id: systemUserId },
    });

    if (systemUserId && !systemUser) throw new Error("Unauthorized user");

    if (isStudentExist)
      throw new Error(`Student with email ${values.email} already exists.`);

    const generateSalt = await genSalt(environment.SALT);
    const hashedPassword = await hash(password, generateSalt);

    const newStudentUser = await tx.student.create({
      data: {
        password: hashedPassword,
        office,
        address,
        birthDate: new Date(birthDate).toISOString(),
        email,
        firstName,
        course,
        semester,
        lastName,
        phoneNumber,
        schoolName,
        yearLevelJoined: yearLevel,
        gender,
        yearLevel,
        middleName,
        status: "SCHOLAR",
        mfaEnabled: !!mfaSecret,
        mfaSecret,
      },
    });

    if (!newStudentUser) throw new Error("Error creating scholar user");

    if (systemUser) {
      const transaction = await tx.transaction.create({
        data: {
          action: "CREATE",
          entity: "STUDENT",
          description: generateTransactionDescription(
            "CREATE",
            "STUDENT",
            systemUser,
          ),
          entityId: newStudentUser.id,
          transactedBy: {
            connect: { id: systemUser.id },
          },
        },
      });

      if (!transaction) throw new Error("Error creating transaction");
    }
    return {
      ...newStudentUser,
      birthDate: newStudentUser.birthDate.toISOString(),
    };
  });

  if (!student) throw new Error("Failed to create student");
  const emailResult = await sendCredentials({
    email: student.email,
    password: values.password,
  });

  if (emailResult.error) {
    throw new Error("There was an error creating account");
  }

  return student;
};

export const updateStudent = async (
  id: string,
  values: Partial<Student>,
): Promise<Student> => {
  let toUpdateData = values;
  let hashedPassword: string | undefined = undefined;

  if (values.status) {
    toUpdateData.statusUpdatedAt = new Date();
  }

  if (values.password && values.password.trim()) {
    const generateSalt = await genSalt(environment.SALT);
    hashedPassword = await hash(values.password.trim(), generateSalt);
  }

  const updatedStudent = await prisma.student.update({
    data: {
      ...toUpdateData,
      password: hashedPassword,
    },
    where: {
      id,
    },
  });

  return {
    ...updatedStudent,
    birthDate: updatedStudent.birthDate.toISOString(),
  };
};

export const readStudent = async (id: string): Promise<Student | null> => {
  let where: Prisma.StudentWhereInput = {
    id: id,
  };

  if (id.includes("@")) {
    where = {
      email: id,
    };
  }

  const student = await prisma.student.findFirst({
    where,
  });

  if (!student) return null;

  return {
    ...student,
    birthDate: student.birthDate.toISOString(),
  };
};

export async function readAllStudents({
  filter,
  pagination,
  status,
  includeDocs,
  office,
  school,
}: PaginationArgs<StudentStatus> & {
  includeDocs?: boolean;
  school?: string;
} = {}): Promise<PaginationResult<Student>> {
  let where: Prisma.StudentWhereInput = {};

  if (filter) {
    where = {
      OR: [
        { email: { contains: filter } },
        { firstName: { contains: filter } },
        { lastName: { contains: filter } },
      ],
    };
  }

  if (school?.trim()) {
    where.schoolName = school.trim();
  }

  if (office) {
    where.office = office;
  }

  if (typeof status !== "undefined") {
    where.status = status;
  }

  const users = await prisma.student.findMany({
    where,
    skip: pagination ? (pagination.page - 1) * pagination.take : undefined,
    take: pagination ? pagination.take : undefined,
    include: {
      documents: includeDocs,
    },

    orderBy: {
      lastName: "asc",
    },
  });

  const count = await prisma.student.count({
    where,
  });

  return {
    data: users
      .map((user) => ({
        ...user,
        birthDate: user.birthDate.toISOString(),
        documents: (user.documents || [])
          .filter(
            (doc) =>
              doc.createdAt.getFullYear() === new Date().getFullYear() &&
              doc.createdAt.getMonth() === new Date().getMonth() &&
              doc.monthlyDocument,
          )
          .map((doc) => ({
            ...doc,
            createdAt: doc.createdAt.toISOString(),
            updatedAt: doc.updatedAt.toISOString(),
          })),
      }))
      .sort((a, b) => b.lastName.localeCompare(a.lastName)),
    hasMore: pagination ? pagination.page * pagination.take < count : false,
    count,
  };
}

export const changePassword = async (newPassword: string, id: string) => {
  const generateSalt = await genSalt(environment.SALT);
  const hashedPassword = await hash(newPassword, generateSalt);

  await prisma.student.update({
    data: {
      password: hashedPassword,
    },
    where: {
      id,
    },
  });
};
