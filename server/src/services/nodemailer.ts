import { environment } from "../environments/environment.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "gmail",
  auth: {
    user: environment.USER,
    pass: environment.PASSWORD,
  },
});
