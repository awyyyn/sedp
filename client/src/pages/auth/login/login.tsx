import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Box,
	Button,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import * as yup from "yup";
import { Link, useNavigate } from "react-router";
import { useAtom, useSetAtom } from "jotai";
import { snackbarAtom } from "../../../states";
import { systemUserAtom } from "../../../states/system-user";
import { useMutation } from "@apollo/client";
import { verifyTOTPMutation } from "../../../queries";

const validationSchema = yup.object({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup.string().required("Password is required"),
	otp: yup.string(),
});

export default function Login() {
	const navigate = useNavigate();
	const [mfaEnabled, setMfaEnabled] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const setSnackbar = useSetAtom(snackbarAtom);
	const [systemUser, setSystemUser] = useAtom(systemUserAtom);
	const handleShowPassword = () => setShowPassword((showPass) => !showPass);
	const [verifyTOTP, { loading: mutating }] = useMutation(verifyTOTPMutation, {
		onCompleted(data) {
			if (data.totp) {
				setSnackbar({
					message: "Successfully logged in",
					open: true,
					severity: "success",
					showIcon: true,
				});
				navigate("/admin/", {
					replace: true,
				});
			} else {
				setSnackbar({
					message: "Invalid OTP",
					open: true,
					severity: "error",
					showIcon: true,
				});
			}
		},
	});

	return (
		<Box
			p={{ xs: 3, md: 5 }}
			pt={{ xs: 4 }}
			borderRadius={1}
			boxShadow={2}
			minWidth={{ xs: "90%", sm: "70%", md: "380px" }}
			alignSelf="center"
			margin="auto"
			maxWidth={{ xs: "90%", sm: "70%", md: "380px" }}>
			<Formik
				validationSchema={validationSchema}
				initialValues={{ email: "", password: "", otp: "" }}
				onSubmit={async (values) => {
					if (mfaEnabled) {
						verifyTOTP({
							variables: {
								secret: systemUser?.mfaSecret,
								token: values.otp,
							},
						});
					} else {
						try {
							const response = await fetch(
								`${import.meta.env.VITE_API_URL}/api/auth/admin-login`,
								{
									method: "POST",
									body: JSON.stringify(values),
									headers: {
										"Content-type": "application/json",
									},
								}
							);
							const data = await response.json();

							if (response.status !== 200) {
								throw new Error(data.error.message);
							}

							if (data.data.user.mfaEnabled) {
								setMfaEnabled(true);
								localStorage.setItem("isLoggedIn", "false");
							} else {
								localStorage.removeItem("isLoggedIn");
								setSnackbar({
									message: "Successfully logged in",
									open: true,
									severity: "success",
									showIcon: true,
								});
								navigate("/admin/", {
									replace: true,
								});
							}
							localStorage.setItem("accessToken", data.data.accessToken);
							localStorage.setItem("refreshToken", data.data.refreshToken);
							setSystemUser(data.data.user);
						} catch (err) {
							//
							console.error(err);
							setSnackbar({
								message: (err as Error).message,
								open: true,
								severity: "error",
								showIcon: true,
							});
						}
					}
				}}
				validateOnBlur
				validateOnChange>
				{({
					errors,
					handleChange,
					values,
					setFieldValue,
					handleBlur,
					handleSubmit,
					touched,
					isSubmitting,
					resetForm,
				}) => {
					return (
						<Form onSubmit={handleSubmit}>
							<Typography align="center" mb={3}>
								SEDP - PORTAL
							</Typography>
							<Stack direction={"column"} spacing={2.5}>
								{!mfaEnabled ? (
									<>
										<TextField
											onChange={handleChange("email")}
											size="small"
											label="Email"
											name="email"
											error={!!touched.email && !!errors.email}
											value={values.email}
											helperText={!!touched.email && errors.email}
											onBlur={handleBlur("email")}
											slotProps={{
												input: {
													readOnly: isSubmitting,
												},
											}}
										/>
										<Stack direction="column" spacing={1}>
											<TextField
												onChange={handleChange("password")}
												label="Password"
												size="small"
												error={!!touched.password && !!errors.password}
												type={showPassword ? "text" : "password"}
												slotProps={{
													input: {
														readOnly: isSubmitting,
														endAdornment: (
															<IconButton onClick={handleShowPassword}>
																{showPassword ? (
																	<VisibilityOff />
																) : (
																	<Visibility />
																)}
															</IconButton>
														),
													},
												}}
												name="password"
												value={values.password}
												onBlur={handleChange("password")}
												helperText={!!touched.password && errors.password}
											/>

											<Link
												to={
													mutating || isSubmitting ? "#" : "/forgot-password"
												}>
												<Typography align="right" variant="subtitle2">
													Forgot Password?
												</Typography>
											</Link>
										</Stack>
									</>
								) : (
									<MuiOtpInput
										length={6}
										gap={0.5}
										TextFieldsProps={{
											sx: {
												padding: 0,
											},
										}}
										value={values.otp}
										onChange={(otp) => setFieldValue("otp", otp)}
									/>
								)}

								<Button
									loading={isSubmitting || mutating}
									type="submit"
									variant="contained">
									{mfaEnabled ? "Verify OTP" : "Login"}
								</Button>
								{mfaEnabled && (
									<Button
										disabled={isSubmitting || mutating}
										onClick={() => {
											setMfaEnabled(false);
											resetForm();
											localStorage.clear();
										}}
										disableElevation
										disableRipple
										type="submit"
										variant="text">
										Back to Log in
									</Button>
								)}
							</Stack>
						</Form>
					);
				}}
			</Formik>
		</Box>
	);
}
