import { environment } from "@/environments/environment.js";
import { createToken } from "./token-model.js";
import { transporter } from "@/services/nodemailer.js";
import { generateAccessToken } from "@/services/jwt.js";

export const sendForgotPasswordOTP = async (email: string) => {
	const token = await createToken(email);
	const mailOptions = {
		from: environment.EMAIL,
		sender: {
			name: "SEDP - Ligao",
			address: environment.EMAIL!,
		},
		to: email,
		subject: "Password Reset Link",
		html: `
			 	<h1>Password Reset Request</h1>		 
				<p>Your OTP for password reset is: <b>${token.token}</b></p>
				
				<p>If you didn't request this, please ignore this email.</p>
			`,
	};

	await transporter.sendMail(mailOptions);
};

interface RegistrationLink {
	email: string;
	role: "SUPER_ADMIN" | "ADMIN" | "STUDENT";
}

export const sendRegistrationLink = async ({
	role,
	email,
}: RegistrationLink) => {
	const registrationToken = generateAccessToken({ email, role, id: "" });

	const userRole = role === "SUPER_ADMIN" || "ADMIN" === role ? "/admin/" : "/";

	const link = `${environment.CLIENT_URL}${userRole}register?registrationToken=${registrationToken}`;

	const mailOptions = {
		from: environment.EMAIL,
		sender: {
			name: "SEDP - Ligao",
			address: environment.EMAIL!,
		},
		to: email,
		subject: "Registration Link",
		html: `
				<h1>Welcome to SEDP - Ligao</h1>		 
				<p>Please click the link below to complete your registration:</p>
				<a href="${link}">Complete Registration</a>
				
				<p>If you didn't request this, please ignore this email.</p>
			`,
	};

	await transporter.sendMail(mailOptions);
};
