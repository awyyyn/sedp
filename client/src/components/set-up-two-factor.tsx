import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import qrcode from "qrcode";
import { InputOtp } from "@heroui/input-otp";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

import { GENERATE_TOTP_QUERY, verifyTOTPMutation } from "@/queries";

interface SetUpTwoFactorProps {
	value: string;
	handleChangeOtp: (value: string) => void;
	handleSaveSecret: (secret: string) => void;
}

export default function SetUpTwoFactor({
	value,
	handleChangeOtp,
	handleSaveSecret,
}: SetUpTwoFactorProps) {
	const [qrImage, setQRImage] = useState<string | null>("");
	const [err, setErr] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	const { data, loading, refetch } = useQuery(GENERATE_TOTP_QUERY, {
		onCompleted(data) {
			qrcode.toDataURL(data.totp.otpauthurl, (err, url) => {
				if (err) {
					setQRImage(null);
				} else {
					setQRImage(url);
				}
			});
		},
	});

	const [verifyOTP, { loading: mutating }] = useMutation(verifyTOTPMutation, {
		variables: {
			secret: data?.totp.secret,
			token: value,
		},
		onCompleted(res) {
			if (res.totp) {
				setIsSuccess(true);

				handleSaveSecret(data.totp.secret);
			} else {
				setErr("Invalid OTP");
			}
		},
	});

	return (
		<>
			<h1 className="md:text-center text-2xl font-medium">
				Set up Two-Factor Authentication
			</h1>
			{!isSuccess ? (
				<>
					<p
						color="textSecondary"
						className="  md:max-w-[60%] md:text-center md:mx-auto">
						Scan the QR Code below using an Authenticator App (Google
						Authenticator, Microsoft Authenticator, SalesForce Authenticator,
						etc.).
					</p>

					{qrImage ? (
						<div className="flex flex-col items-center justify-center gap-3">
							<img
								src={qrImage}
								alt={"QR CODE"}
								style={{
									maxHeight: 250,
									maxWidth: 250,
									width: "100%",
									height: "100%",
								}}
							/>
							<p>Enter the generated CODE for Verification</p>
							<div>
								<InputOtp
									length={6}
									className="sm:min-w-[50%]"
									name="otp"
									size="lg"
									onValueChange={handleChangeOtp}
									errorMessage={err}
									readOnly={mutating}
									fullWidth
								/>
							</div>

							<Button
								color="primary"
								fullWidth
								className="md:max-w-[40%]"
								onPress={() => verifyOTP()}>
								Validate OTP
							</Button>
						</div>
					) : (
						<Button
							className="sm:min-w-[50%] mt-2"
							onPress={refetch}
							isLoading={loading}>
							Retry Fetching QR Code
						</Button>
					)}
				</>
			) : (
				<div className="flex flex-col items-center gap-3">
					<Icon
						icon="solar:verified-check-bold"
						className="text-[200px] text-[#aee1ec]"
					/>
					<p>You&apos;ve successfully set up Two-Factor Authentication</p>
					<p className="mt-2 text-gray-600 md:max-w-[50%] md:text-center">
						You will now be required to use both your password and the generated
						code from your application to sign in.
					</p>
				</div>
			)}
		</>
	);
}
