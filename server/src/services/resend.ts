import { Resend } from "resend";
import { environment } from "../environments/environment.js";

export const resend = new Resend(environment.RESEND_API_KEY);
