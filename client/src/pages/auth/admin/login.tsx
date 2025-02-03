import { Form, Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import { useMutation } from "@apollo/client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { systemUserAtom } from "@/states";
import { useAuth } from "@/contexts";
import { verifyTOTPMutation } from "@/queries";

const validationSchema = yup.object({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup.string().required("Password is required"),
	otp: yup.string(),
});

export default function Login() {
	const navigate = useNavigate();
	const [mfaEnabled, setMfaEnabled] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [systemUser, setSystemUser] = useAtom(systemUserAtom);
	const handleShowPassword = () => setShowPassword((showPass) => !showPass);
	const { login } = useAuth();

	const [verifyTOTP, { loading: mutating }] = useMutation(verifyTOTPMutation, {
		onCompleted(data) {
			if (data.totp) {
				toast.success("Successfully logged in", {
					richColors: true,
					dismissible: true,
					duration: 5000,
					position: "top-center",
					className: "bg-green-600 foreground-white",
					icon: <Icon icon="lets-icons:check-fill" />,
				});
				navigate("/dashboard", {
					replace: true,
				});
			} else {
				toast.error("Invalid OTP", {
					richColors: true,
					position: "top-center",
					dismissible: true,
					duration: 5000,
					icon: <Icon icon="clarity:error-solid" />,
				});
			}
		},
	});

	return (
		<div className="p-5 rounded-md shadow-md min-w-[90%] w-[90%] md:max-w-[380px] md:min-w-[380px] ">
			<Formik
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
								toast.success("Successfully logged in", {
									richColors: true,
									position: "top-center",
									dismissible: true,
									duration: 5000,
									icon: <Icon icon="clarity:error-solid" />,
								});
								navigate("/dashboard", {
									replace: true,
								});
							}
							login(data.data.accessToken);
							setSystemUser(data.data.user);
						} catch (err) {
							toast.error((err as Error).message, {
								richColors: true,
								position: "top-center",
								dismissible: true,
								duration: 5000,
								icon: <Icon icon="clarity:error-solid" />,
							});
						}
					}
				}}
				validateOnBlur
				validateOnChange
				validationSchema={validationSchema}>
				{({
					errors,
					handleChange,
					values,
					handleBlur,
					handleSubmit,
					touched,
					isSubmitting,
					resetForm,
				}) => {
					return (
						<Form onSubmit={handleSubmit}>
							<h1 className="mb-3">SEDP - PORTAL</h1>
							<div className="space-y-4">
								{!mfaEnabled ? (
									<>
										<Input
											label="Email"
											type="email"
											name="email"
											isReadOnly={isSubmitting}
											value={values.email}
											radius="sm"
											isInvalid={!!errors.email}
											onChange={handleChange}
											onBlur={handleBlur}
											errorMessage={touched.email && errors.email}
										/>
										<div className="space-y-2">
											<Input
												className=""
												label="Password"
												type={showPassword ? "text" : "password"}
												name="password"
												isReadOnly={isSubmitting}
												value={values.password}
												isInvalid={!!errors.password}
												onChange={handleChange}
												onBlur={handleBlur}
												radius="sm"
												errorMessage={touched.password && errors.password}
												endContent={
													<Icon
														icon={
															showPassword
																? "solar:eye-bold"
																: "solar:eye-closed-bold"
														}
														onClick={handleShowPassword}
														className="cursor-pointer"
													/>
												}
											/>
											<Link
												className="text-right hover:underline  block"
												to={
													mutating || isSubmitting
														? "#"
														: "/admin/forgot-password"
												}>
												Forgot Password?
											</Link>
										</div>
									</>
								) : (
									<InputOtp
										length={6}
										size="lg"
										value={values.otp}
										name="otp"
										onChange={handleChange}
										className="mx-auto "
										readOnly={isSubmitting || mutating}
									/>
								)}
								<div className="space-y-1">
									<Button
										isLoading={isSubmitting || mutating}
										type="submit"
										fullWidth>
										{mfaEnabled ? "Verify OTP" : "Login"}
									</Button>
									{mfaEnabled && (
										<Button
											disabled={isSubmitting || mutating}
											onPress={() => {
												setMfaEnabled(false);
												resetForm();
												localStorage.clear();
											}}
											fullWidth
											type="submit"
											variant="light">
											Back to Log in
										</Button>
									)}
								</div>
							</div>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
}
