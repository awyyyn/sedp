import { environment } from "../environments/environment.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: environment.EMAIL,
    clientId: environment.GMAIL_CLIENT_ID,
    clientSecret: environment.GMAIL_CLIENT_SECRET,
    refreshToken: environment.GMAIL_REFRESH_TOKEN,
  },
});
