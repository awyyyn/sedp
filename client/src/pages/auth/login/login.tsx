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
import { Link } from "react-router";

const validationSchema = yup.object({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup.string().required("Password is required"),
	otp: yup.string(),
});

export default function Login() {
	const [mfaEnabled, setMfaEnabled] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleShowPassword = () => setShowPassword((showPass) => !showPass);

	return (
		<Box
			p={{ xs: 3, md: 5 }}
			pt={{ xs: 4 }}
			borderRadius={1}
			boxShadow={2}
			minWidth={{ xs: "90%", sm: "70%", md: "380px" }}
			alignSelf="center"
			margin="auto"
			maxWidth={{ xs: "90%", sm: "70%" }}>
			<Formik
				validationSchema={validationSchema}
				initialValues={{ email: "", password: "", otp: "" }}
				onSubmit={(values) => {
					setMfaEnabled((mfa) => !mfa);
					console.log("val;ues", values);
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
											error={!!errors.email}
											value={values.email}
											helperText={errors.email}
											onBlur={handleBlur("email")}
										/>
										<Stack direction="column" spacing={1}>
											<TextField
												onChange={handleChange("password")}
												label="Password"
												size="small"
												type={showPassword ? "text" : "password"}
												slotProps={{
													input: {
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
												error={Boolean(errors.password)}
												onBlur={handleChange("password")}
												helperText={errors.password}
											/>

											<Link to="/forgot-password">
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

								<Button type="submit" variant="contained">
									Sign in
								</Button>
							</Stack>
						</Form>
					);
				}}
			</Formik>
		</Box>
	);
}
