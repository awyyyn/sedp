import { environment } from "../environments/environment.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: environment.EMAIL,
    pass: environment.PASSWORD,
  },
});
