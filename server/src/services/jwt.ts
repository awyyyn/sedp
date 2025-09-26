import { SystemUserRole } from "../types/index.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface PayloadArgs {
  id: string;
  email: string;
  role: SystemUserRole | "STUDENT";
  office: string;
}

type JWTPayload = PayloadArgs & JwtPayload;

export const generateAccessToken = (payload: PayloadArgs, expiresIn = "2h") => {
  const secret = process.env.ACCESS_SECRET;
  return jwt.sign(payload, secret!, {
    expiresIn,
  });
};

export const generateRefreshToken = (payload: PayloadArgs) => {
  const secret = process.env.REFRESH_SECRET;
  return jwt.sign(payload, secret!, {
    expiresIn: "2h",
  });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = <JWTPayload>jwt.verify(token, process.env.ACCESS_SECRET!);
    return decoded;
    // return decoded;
  } catch (error) {
    return null;
  }
};

export const generateLateSubmissionToken = (payload: {
  id: string;
  month: number;
  year: number;
  expiresIn?: string;
}) => {
  const secret = process.env.ACCESS_SECRET;
  return jwt.sign(payload, secret!, {
    expiresIn: payload.expiresIn || "7d",
  });
};
