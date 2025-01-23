import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Box,
	Button,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import * as yup from "yup";

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
			minHeight="100dvh"
			minWidth="100dvw"
			width="100%"
			height="100%"
			display="flex"
			alignItems="center"
			justifyContent="center">
			<Box
				p={{ xs: 2, md: 5 }}
				borderRadius={1}
				boxShadow={2}
				minWidth={{ xs: "90%", sm: "70%", md: "380px" }}
				maxWidth={{ xs: "90%", sm: "70%", md: "380px" }}>
				<Formik
					validationSchema={validationSchema}
					initialValues={{ email: "", password: "", otp: "" }}
					onSubmit={(values) => {
						setMfaEnabled((mfa) => !mfa);
						console.log("val;ues", values);
					}}
					validateOnBlur
					validateOnChange={false}>
					{({
						errors,
						handleChange,
						values,
						setFieldValue,
						handleBlur,
						handleSubmit,
					}) => {
						return (
							<form onSubmit={handleSubmit}>
								<Typography align="center" mb={3}>
									SEDP - PORTAL
								</Typography>
								<Stack direction={"column"} spacing={2.5}>
									{!mfaEnabled ? (
										<>
											<TextField
												onChange={handleChange}
												size="small"
												label="Email"
												name="email"
												error={!!errors.email}
												value={values.email}
												helperText={errors.email}
												onBlur={handleBlur}
											/>
											<TextField
												onChange={handleChange}
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
												onBlur={handleBlur}
												helperText={errors.password}
											/>
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
							</form>
						);
					}}
				</Formik>
			</Box>
		</Box>
	);
}
