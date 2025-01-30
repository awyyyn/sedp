import { useState } from "react";
import { generateTOTPQuery, verifyTOTPMutation } from "../../../../queries";
import { useMutation, useQuery } from "@apollo/client";
import { Button, FormHelperText, Stack, Typography } from "@mui/material";
import qrcode from "qrcode";
import { MuiOtpInput } from "mui-one-time-password-input";
import { CheckCircle } from "@mui/icons-material";

interface Step3Props {
	value: string;
	handleChangeOtp: (value: string) => void;
	handleSaveSecret: (secret: string) => void;
}

export default function Step3({
	value,
	handleChangeOtp,
	handleSaveSecret,
}: Step3Props) {
	const [qrImage, setQRImage] = useState<string | null>("");
	const [err, setErr] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	const { data, loading, refetch } = useQuery(generateTOTPQuery, {
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
			<Typography variant="h6">Set up Two-Factor Authentication</Typography>
			{!isSuccess ? (
				<>
					<Typography variant="subtitle2" color="textSecondary">
						Scan the QR Code below using an Authenticator App
						<br />
						(Google Authenticator, Microsoft Authenticator,
						<br />
						SalesForce Authenticator, etc.).
					</Typography>
					{qrImage ? (
						<Stack
							spacing={3}
							justifyContent="center"
							direction="column"
							alignItems="center">
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
							<Typography variant="subtitle2" color="textSecondary">
								Enter the generated CODE for Verification
							</Typography>
							<div>
								<MuiOtpInput
									length={6}
									sx={{ maxWidth: { xs: "100%", sm: "50%" } }}
									value={value}
									onChange={handleChangeOtp}
									gap={{ xs: 1, md: 2 }}
									TextFieldsProps={{
										slotProps: {
											input: {
												sx: {
													fontSize: 30,

													fontWeight: "bold",
												},
												error: !!err,
											},
											formHelperText: {
												content: err,
												error: !!err,
											},
											htmlInput: {
												sx: {
													px: 0.8,
													py: 0.8,
												},
												readOnly: mutating,
											},
										},
									}}
								/>
								{err !== "" && (
									<FormHelperText sx={{ mt: 1 }} error>
										{err}
									</FormHelperText>
								)}
							</div>
							<Button
								fullWidth
								variant="contained"
								sx={{
									maxWidth: { xs: "100%", sm: "50%" },
								}}
								onClick={() => verifyOTP()}>
								Validate OTP
							</Button>
						</Stack>
					) : (
						<Button
							sx={{ minWidth: { xs: "100%", sm: "50%" }, mt: 2 }}
							variant="contained"
							onClick={refetch}
							loading={loading}>
							Retry Fetching QR Code
						</Button>
					)}
				</>
			) : (
				<>
					<CheckCircle sx={{ fontSize: 200, color: "#aee1ec" }} />
					<Typography>
						You&apos;ve successfully set up Two-Factor Authentication
					</Typography>
					<Typography mt={2} color="textSecondary">
						You will now be required to use both your password and the generated
						code from your application to sign in.
					</Typography>
				</>
			)}
		</>
	);
}
