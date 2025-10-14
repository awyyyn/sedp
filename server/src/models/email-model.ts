import { environment } from "../environments/environment.js";
import { transporter } from "../services/nodemailer.js";
import { generateAccessToken } from "../services/jwt.js";
import { SystemUserRole } from "../types/system-user.js";
import { prisma } from "../services/prisma.js";
import { differenceInMinutes, differenceInSeconds } from "date-fns";

export const sendForgotPasswordOTP = async (email: string) => {
  const generatedToken = Math.random()
    .toString(36)
    .substring(2)
    .toUpperCase()
    .substring(0, 6);

  const newToken = await prisma.$transaction(async (tx) => {
    const user = await tx.student.count({ where: { email } });
    const admin = await tx.systemUser.count({ where: { email } });

    if (!user && !admin) {
      throw new Error("User is not registered!");
    }

    const token = await tx.token.findFirst({
      where: {
        email,
      },
    });

    if (token !== null) {
      const min = differenceInMinutes(new Date(), token.time);
      const minutesLeft = 5 - min;
      const seconds = differenceInSeconds(new Date(), token.time);

      throw new Error(
        `Token already sent. Please wait for ${
          !minutesLeft ? seconds : minutesLeft
        } ${!minutesLeft ? "second(s)" : "minute(s)"}`,
      );
    }

    const newToken = await tx.token.create({
      data: {
        email,
        token: generatedToken,
        time: new Date(),
      },
    });

    if (!newToken) throw new Error("Failed to create token");

    return newToken;
  });

  if (!newToken) throw new Error("Failed to create token");

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
			<p>Your OTP for password reset is: <b>${newToken.token}</b></p>

			<p>If you didn't request this, please ignore this email.</p>
		`,
  };

  const result = await transporter.sendMail(mailOptions);
  // const result = await transporter.send({
  // 	from: { name: mailOptions.sender.name, email: mailOptions.from! },
  // 	to: [{ email: mailOptions.to }],
  // 	subject: mailOptions.subject,
  // 	html: mailOptions.html!,
  // });

  if (result.rejected.length > 0)
    throw new Error("Something went wrong! Please contact support.");

  return newToken;
};

interface RegistrationLink {
  email: string;
  role: SystemUserRole | "STUDENT";
}

export const sendRegistrationLink = async ({
  role,
  email,
}: RegistrationLink) => {
  const registrationToken = generateAccessToken({
    email,
    role,
    id: "",
    office: "",
  });

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
  // await transporter.send({
  // 	from: { name: mailOptions.sender.name, email: mailOptions.from! },
  // 	to: [{ email: mailOptions.to }],
  // 	subject: mailOptions.subject,
  // 	html: mailOptions.html!,
  // });
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
							<a href="https://sedp.xyz/login" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Login to Your Account</a>
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

  return await transporter.sendMail(mailOptions);
  // return await transporter.send({
  // 	from: { name: mailOptions.sender.name, email: mailOptions.from! },
  // 	to: [{ email: mailOptions.to }],
  // 	subject: mailOptions.subject,
  // 	html: mailOptions.html!,
  // });
};

export const sendDisqualificationEmail = async ({
  email,
}: {
  email: string;
}) => {
  const mailOptions = {
    from: environment.EMAIL,
    sender: {
      name: "SEDP - Ligao",
      address: environment.EMAIL!,
    },
    to: email,
    subject: "Disqualification Notice",
    html: `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Disqualification Notice</title>
			</head>
			<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9f9f9;">
				<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">

					<!-- Header -->
					<div style="background-color: #d9534f; padding: 25px; text-align: center;">
						<h1 style="color: white; margin: 0; font-size: 24px;">Disqualification Notice</h1>
					</div>

					<!-- Content -->
					<div style="padding: 30px 25px; color: #333333;">
						<p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
							We regret to inform you that you have been disqualified for not meeting the requirements needed to be maintained.
						</p>
						<p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
							If you believe this decision is in error or you have any questions, please contact our support team.
						</p>
						<p style="font-size: 16px; line-height: 1.5;">
							Best regards,<br />
							The SEDP - Ligao Team
						</p>
					</div>

					<!-- Footer -->
					<div style="background-color: #f5f5f5; padding: 20px; text-align: center; color: #666666; font-size: 14px; border-top: 1px solid #eeeeee;">
						<p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
					</div>
				</div>
			</body>
			</html>
		`,
  };

  await transporter.sendMail(mailOptions);
  // await transporter.se({
  // 	from: { name: mailOptions.sender.name, email: mailOptions.from! },
  // 	to: [{ email: mailOptions.to }],
  // 	subject: mailOptions.subject,
  // 	html: mailOptions.html!,
  // });
};
