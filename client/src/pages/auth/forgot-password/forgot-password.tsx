import {
	Button,
	FormHelperText,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import {
	ArrowBack,
	Drafts,
	Fingerprint,
	Password,
	Verified,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../../states";
import { APIResponse } from "../../../types";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
	const navigate = useNavigate();
	const [values, setValues] = useState({
		email: "",
		otp: "",
		password: "",
		confirmPassword: "",
	});
	const [step, setStep] = useState(1);
	const [error, setError] = useState("");
	const setSnackbar = useSetAtom(snackbarAtom);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async () => {
		if (!values.email || values.email === "") {
			setError("Please enter your email address.");
			return;
		}
		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:4000/api/auth/admin-forgot-password",
				{
					method: "POST",
					body: JSON.stringify({ email: values.email }),
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const data: APIResponse<{ message: string }> = await response.json();

			if (response.status !== 200) {
				throw new Error(data.error?.message);
			}

			if (step === 1) {
				setStep((stp) => stp + 1);
			}
		} catch (error) {
			setSnackbar({
				open: true,
				message: (error as Error).message,
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOTP = async () => {
		if (values.otp === "" || values.otp.length !== 4) {
			console.log(values.otp);
			setError(values.otp === "" ? "Please enter the OTP." : "Invalid OTP.");
			return;
		}
		try {
			setLoading(true);
			const response = await fetch(
				"http://localhost:4000/api/auth/admin-verify-token",
				{
					method: "POST",
					body: JSON.stringify({ token: values.otp, email: values.email }),
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const data = await response.json();

			if (response.status !== 200) {
				throw new Error(data.error?.message);
			}

			localStorage.setItem(
				"passwordAccessToken",
				data.data.passwordAccessToken
			);
			setStep((stp) => stp + 1);
		} catch (error) {
			setSnackbar({
				open: true,
				message: (error as Error).message,
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
		console.log(error);
		if (error !== "") {
			return;
		}
		try {
			//
			setLoading(true);
			const response = await fetch(
				"http://localhost:4000/api/auth/admin-reset-password",
				{
					method: "POST",
					body: JSON.stringify({ password: values.confirmPassword }),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"passwordAccessToken"
						)}`,
					},
				}
			);

			const data = await response.json();
			if (response.status !== 200) {
				throw new Error(data.error.message);
			}

			setStep((stp) => stp + 1);
		} catch (error) {
			setSnackbar({
				open: true,
				message: (error as Error).message,
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleShowPassword = () => setShowPassword((showPass) => !showPass);

	return (
		<div>
			<Stack spacing={2}>
				<Stack
					spacing={1}
					justifyContent={{ xs: "start", md: "center" }}
					alignItems={{ xs: "start", md: "center" }}>
					{
						[
							<Fingerprint fontSize="large" />,
							<Drafts fontSize="large" />,
							<Password fontSize="large" />,
							<Verified fontSize="large" />,
						][step - 1]
					}
					<Typography variant="h5">
						{
							[
								"Forgot Password?",
								"Password Reset",
								"Set new Password",
								"All Done!",
							][step - 1]
						}
					</Typography>
					<Typography
						variant="subtitle2"
						sx={{
							color: "GrayText",
							textAlign: { xs: "start", md: "center" },
						}}>
						{
							[
								"No worries, we'll send you an email to reset your password.",
								`We sent a code to ${values.email}. Please check your email.`,
								"Must be at least 8 characters.",
								"Your password has been reset! You can now login with your new password.",
							][step - 1]
						}
					</Typography>
				</Stack>

				{
					[
						<TextField
							label={"Email"}
							fullWidth
							error={!!error}
							helperText={error}
							slotProps={{
								input: {
									readOnly: loading,
								},
							}}
							onChange={(e) => {
								const value = e.target.value;
								const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
								if (!emailRegex.test(value)) {
									setError("Please enter a valid email address.");
								} else {
									setError("");
								}
								setValues((v) => ({ ...v, email: value }));
							}}
							onKeyUp={(e) => {
								if (e.key === "Enter") {
									handleSubmit();
								}
							}}
						/>,
						<>
							<MuiOtpInput
								length={4}
								value={values.otp}
								onChange={(val) => {
									if (val.trim().length === 4) {
										setError("");
									}
									setValues((v) => ({ ...v, otp: val }));
								}}
								gap={1}
								TextFieldsProps={{
									slotProps: {
										input: {
											sx: {
												fontSize: 30,
												fontWeight: "bold",
											},
											error: !!error,
										},
										htmlInput: {
											sx: {
												px: 1,
												py: 1.4,
											},
											disabled: loading,
										},
									},
								}}
								padding={0}
							/>
							{!!error && (
								<FormHelperText sx={{ color: "#FF0000AA" }}>
									{error}
								</FormHelperText>
							)}
						</>,
						<>
							<TextField
								label={"Password"}
								fullWidth
								type={showPassword ? "text" : "password"}
								error={!!error}
								slotProps={{
									input: {
										readOnly: loading,
										endAdornment: (
											<IconButton onClick={handleShowPassword}>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										),
									},
								}}
								onChange={(e) => {
									if (e.target.value.trim() !== values.password.trim()) {
										setError("Password doesn't match!");
									} else if (e.target.value.trim().length < 8) {
										setError("Password must be at least 8 characters.");
									} else {
										setError("");
									}
									setValues((v) => ({ ...v, password: e.target.value }));
								}}
							/>
							<TextField
								label={"Confirm Password"}
								fullWidth
								error={!!error}
								helperText={error}
								type={showPassword ? "text" : "password"}
								slotProps={{
									input: {
										readOnly: loading,
										endAdornment: (
											<IconButton onClick={handleShowPassword}>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										),
									},
								}}
								onChange={(e) => {
									if (e.target.value.trim() !== values.password.trim()) {
										setError("Password doesn't match!");
									} else {
										setError("");
									}
									setValues((v) => ({ ...v, confirmPassword: e.target.value }));
									console.log(values.password, e.target.value);
								}}
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										// handleSubmit();
									}
								}}
							/>
						</>,
					][step - 1]
				}
				{step === 2 && (
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="center"
						spacing={0.5}>
						<Typography variant="subtitle2" color="textSecondary">
							Don't receive the email?
						</Typography>

						<Typography
							onClick={handleSubmit}
							variant="subtitle2"
							color="info"
							sx={{ textDecoration: "underline", cursor: "pointer" }}>
							Click to resend
						</Typography>
					</Stack>
				)}
				{step < 4 && (
					<Button
						disabled={loading}
						onClick={
							[handleSubmit, handleVerifyOTP, handleResetPassword][step - 1]
						}
						loading={loading}
						variant="contained"
						style={{ textTransform: "capitalize" }}>
						{
							["Send Reset Password Link", "Continue", "Reset Password"][
								step - 1
							]
						}
					</Button>
				)}
				<Button
					disabled={loading}
					variant={step === 4 ? "contained" : "text"}
					startIcon={<ArrowBack />}
					onClick={() => {
						navigate("/admin/login", {
							replace: true,
							viewTransition: true,
						});
					}}
					sx={{
						textTransform: "capitalize",
						color: step === 4 ? "white" : "gray",
					}}
					type="submit"
					centerRipple>
					<p style={{ marginTop: 3 }}>
						{step < 4 ? "Back to login" : "Continue to Login"}
					</p>
				</Button>
			</Stack>
		</div>
	);
}
