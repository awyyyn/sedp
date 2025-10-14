import nodemailer from "nodemailer";
import { google } from "googleapis";
import { environment } from "../environments/environment.js";

const oAuth2Client = new google.auth.OAuth2(
  environment.GMAIL_CLIENT_ID,
  environment.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oAuth2Client.setCredentials({
  refresh_token: environment.GMAIL_REFRESH_TOKEN,
});

// Async function to create the transporter with fresh access token
export async function createTransporter() {
  const accessTokenResponse = await oAuth2Client.getAccessToken();
  const accessToken = accessTokenResponse?.token;

  if (!accessToken) {
    throw new Error("Failed to retrieve access token from Google");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: environment.EMAIL,
      clientId: environment.GMAIL_CLIENT_ID,
      clientSecret: environment.GMAIL_CLIENT_SECRET,
      refreshToken: environment.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  return transporter;
}
