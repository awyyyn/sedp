import { environment } from "../environments/environment.js";
import { createToken } from "./token-model.js";
import { transporter } from "../services/nodemailer.js";
import { generateAccessToken } from "../services/jwt.js";
import { SystemUserRole } from "../types/system-user.js";

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
	role: SystemUserRole | "STUDENT";
}

export const sendRegistrationLink = async ({
	role,
	email,
}: RegistrationLink) => {
	const registrationToken = generateAccessToken({ email, role, id: "" });

	const userRole = role !== "STUDENT" ? "/admin/" : "/";

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

export const sendCredentials = async ({
	email,
	password,
	role,
}: {
	email: string;
	password: string;
	role?: string;
}) => {
	const mailOptions = {
		from: environment.EMAIL,
		sender: {
			name: "SEDP - Ligao",
			address: environment.EMAIL!,
		},
		to: email,
		subject: "Registration Link",
		html: `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>SEDP Ligao - New ${role ? "Admin" : "Scholar"} Account</title>
			</head>
			<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9f9f9;">
				<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
					<!-- Header -->
					<div style="background-color: #4CAF50; padding: 25px; text-align: center;">
						<h1 style="color: white; margin: 0; font-size: 24px;">SEDP - Ligao</h1>
						<p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Socio-Economic Development Program</p>
					</div>
					
					<!-- Content -->
					<div style="padding: 30px 25px; color: #333333;">
						<h2 style="margin-top: 0; color: #333333; font-size: 20px;">New ${
							role ? "Admin" : "Scholar"
						} Account Created</h2>
						
						<p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
							Your ${
								role ? "administrator" : "scholar"
							} account has been successfully created. Below are your login credentials:
						</p>
						<div style="background-color: #f5f8ff; border-left: 4px solid #4CAF50; padding: 15px; margin-bottom: 25px; border-radius: 0 5px 5px 0;">
							<table style="width: 100%; border-collapse: collapse;">
								<tr>
									<td style="padding: 8px 0;"><strong>Email:</strong></td>
									<td style="padding: 8px 0; color: #333;">${email}</td>
								</tr>
								<tr>
									<td style="padding: 8px 0;"><strong>Password:</strong></td>
									<td style="padding: 8px 0; color: #333;">${password}</td>
								</tr>
								${
									role &&
									`
										<tr>
											<td style="padding: 8px 0;">
												<strong>Role:</strong>
											</td>
											<td style="padding: 8px 0; color: #333;">${role}</td>
										</tr>
									`
								}
							</table>
						</div>
						
						<p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
							For security reasons, we recommend changing your password after your first login.
						</p>
						
						<div style="text-align: center; margin: 30px 0;">
							<a href="https://sedp.vercel.app/login" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Login to Your Account</a>
						</div>
						
						<p style="font-size: 14px; color: #777777; margin-top: 30px;">
							If you didn't request this account, please contact the system administrator immediately.
						</p>
					</div>
					
					<!-- Footer -->
					<div style="background-color: #f5f5f5; padding: 20px; text-align: center; color: #666666; font-size: 14px; border-top: 1px solid #eeeeee;">
						<p style="margin: 0 0 10px 0;">© 2025 SEDP Ligao. All rights reserved.</p>
						<p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
					</div>
				</div>
			</body>
			</html>
			`,
	};

	await transporter.sendMail(mailOptions);
};
