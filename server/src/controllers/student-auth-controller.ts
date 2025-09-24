import { Request, Response } from "express";
import {
  createStudent,
  readStudent,
  readToken,
  sendForgotPasswordOTP,
} from "../models/index.js";
import * as bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  prisma,
} from "../services/index.js";
import { environment } from "../environments/environment.js";
import {
  readAdminNotification,
  readStudentNotification,
} from "../models/notification.js";
import { differenceInMinutes, differenceInSeconds } from "date-fns";

export const loginController = async (req: Request, res: Response) => {
  const { password, email } = req.body;

  if (!password || !email) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Email and password are required",
      },
    });
    return;
  }

  const scholarUser = await prisma.student.findFirst({
    where: { email },
  });

  const adminUser = await prisma.systemUser.findFirst({
    where: { email },
  });

  if (scholarUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      scholarUser.password,
    );

    if (!isPasswordValid) {
      res.status(401).json({
        error: {
          code: 401,
          message: "Invalid password",
        },
      });
      return;
    }

    const payload = {
      email: scholarUser.email,
      id: scholarUser.id,
    };

    const accessToken = generateAccessToken({
      ...payload,
      role: "STUDENT",
    });
    const refreshToken = generateRefreshToken({
      ...payload,
      role: "STUDENT",
    });
    const { password: removePassword, ...userData } = scholarUser;
    const notifications = await readStudentNotification(scholarUser.id);

    res.status(200).json({
      data: {
        accessToken,
        refreshToken,
        user: { ...userData, notifications: notifications || [] },
        role: "STUDENT",
      },
      error: null,
    });
  } else if (adminUser) {
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordValid) {
      res.status(401).json({
        error: {
          code: 401,
          message: "Invalid password",
        },
      });
      return;
    }

    const payload = {
      email: adminUser.email,
      id: adminUser.id,
    };

    const accessToken = generateAccessToken({
      ...payload,
      role: adminUser.role,
    });
    const refreshToken = generateRefreshToken({
      ...payload,
      role: adminUser.role,
    });
    const { password: removePassword, ...userData } = adminUser;
    const notifications = await readAdminNotification(adminUser.role);

    res.status(200).json({
      data: {
        accessToken,
        refreshToken,
        user: { ...userData, notifications: notifications || [] },
        role: adminUser.role,
      },
      error: null,
    });
  } else {
    res.status(404).json({
      error: {
        code: 404,
        message: "User is not registered!",
      },
    });
    return;
  }
};

export const studentLoginController = async (req: Request, res: Response) => {
  const { password, email } = req.body;

  if (!password || !email) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Email and password are required",
      },
    });
    return;
  }

  try {
    const student = await readStudent(email);

    if (!student) {
      res.status(404).json({
        error: {
          code: 404,
          message: "User is not registered!",
        },
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      res.status(401).json({
        error: {
          code: 401,
          message: "Invalid password",
        },
      });
      return;
    }

    const payload = {
      email: student.email,
      id: student.id,
    };

    const accessToken = generateAccessToken({
      ...payload,
      role: "STUDENT",
    });
    const refreshToken = generateRefreshToken({
      ...payload,
      role: "STUDENT",
    });
    const { password: removePassword, ...userData } = student;
    const notifications = await readStudentNotification(student.id);

    res.status(200).json({
      data: {
        accessToken,
        refreshToken,
        user: { ...userData, notifications: notifications || [] },
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Internal server error",
      },
    });
  }
};

export const studentRegisterController = async (
  req: Request,
  res: Response,
) => {
  const {
    password,
    email,
    mfaSecret,
    firstName,
    lastName,
    city,
    street,
    phoneNumber,
    middleName,
    birthDate,
    schoolName,
    yearLevel,
    course,
    gender,
    mfaEnabled,
    semester,
    statusUpdatedAt,
  } = req.body;

  try {
    const newUser = await createStudent({
      email,
      firstName,
      lastName,
      mfaSecret,
      password,
      address: {
        city: city,
        street: street,
      },
      birthDate,
      semester,
      middleName,
      phoneNumber,
      schoolName,
      // TODO: ADD STUDENT ID IN FRONTEND
      course,
      gender,
      mfaEnabled,
      statusUpdatedAt,
      yearLevel: Number(yearLevel),
    });

    if (!newUser) {
      res.status(400).json({
        error: {
          code: 400,
          message: "Failed to create scholar account",
        },
      });
      return;
    }

    res.status(201).json({
      data: newUser,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Internal server error",
      },
    });
  }
};

export const studentForgotPasswordController = async (
  req: Request,
  res: Response,
) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Email is required!",
      },
    });
    return;
  }

  try {
    const user = await readStudent(email);

    if (!user) {
      res.status(404).json({
        error: {
          code: 400,
          message: "User is not registered!",
        },
      });
      return;
    }

    const token = await readToken(email);

    if (token !== null) {
      const min = differenceInMinutes(new Date(), token.time);
      const minutesLeft = 5 - min;
      const seconds = differenceInSeconds(new Date(), token.time);

      console.log(minutesLeft, seconds);

      res.status(400).json({
        error: {
          code: 400,
          message: `Token already sent. Please wait for ${
            !minutesLeft ? seconds : minutesLeft
          } ${!minutesLeft ? "second(s)" : "minute(s)"}`,
        },
      });
      return;
    }

    await sendForgotPasswordOTP(email);

    res.status(200).json({
      data: {
        message: "Reset password link is sent to your email.",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Internal Server Error!",
      },
    });
  }
};

export const studentVerifyTokenController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { token, email } = req.body;

    const user = await readStudent(email);

    if (!user) {
      res.status(400).json({
        error: {
          code: 400,
          message: "UnAuthorized!",
        },
      });
      return;
    }

    const storedToken = await readToken(email);

    if (storedToken === null) {
      res.status(400).json({
        error: {
          code: 400,
          message: "Token is expired!",
        },
      });
      return;
    }

    if (token !== storedToken?.token) {
      res.status(400).json({
        error: {
          code: 400,
          message: "OTP doesn't match!",
        },
      });
      return;
    }

    const passwordAccessToken = generateAccessToken({
      email: user.email,
      role: "STUDENT",
      id: user.id,
    });
    res.status(200).json({
      data: {
        passwordAccessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Internal Server Error!",
      },
    });
  }
};

export const studentResetPasswordController = async (
  req: Request,
  res: Response,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Email and password are required!",
      },
    });
    return;
  }

  try {
    const user = await prisma.student.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({
        error: {
          code: 404,
          message: "User is not registered",
        },
      });
      return;
    }

    const generatedSALT = await bcrypt.genSalt(environment.SALT);
    const hashedPassword = await bcrypt.hash(password, generatedSALT);

    const updatedUser = await prisma.student.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    if (!updatedUser) {
      res.status(400).json({
        code: 400,
        message: "Something went wrong while updating your password!",
      });
      return;
    }

    res.status(200).json({
      data: {
        message: "Password reset!",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Internal Server Error!",
      },
    });
  }
};
