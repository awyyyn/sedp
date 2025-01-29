import { environment } from "@/environments/environment.js";
import { createToken } from "./token-model.js";
import { transporter } from "@/services/nodemailer.js";

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
