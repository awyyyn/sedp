import { Form, Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useSetAtom } from "jotai";

import { useAuth } from "@/contexts";
import { verifyTOTPMutation } from "@/queries";
import { scholarNotificationAtom } from "@/states";

const validationSchema = yup.object({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup.string().required("Password is required"),
	otp: yup.string(),
});

export default function StudentLogin() {
	const navigate = useNavigate();
	const [mfaEnabled, setMfaEnabled] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const setNotifications = useSetAtom(scholarNotificationAtom);
	const handleShowPassword = () => setShowPassword((showPass) => !showPass);
	const { login, setStudentUser, studentUser } = useAuth();

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
				localStorage.removeItem("isLoggedIn");
				login(localStorage.getItem("accessToken")!, true);
				navigate("/", {
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

	// useEffect(() => {
	// 	const handleBeforeUnload = (event: BeforeUnloadEvent) => {
	// 		// Custom behavior (optional)
	// 		// Standard way to show a confirmation dialog (may be ignored by modern browsers)
	// 		event.preventDefault();
	// 		event.cancelable;
	// 		event.returnValue = "Are you sure you want to leave this page?";
	// 	};

	// 	window.addEventListener("beforeunload", handleBeforeUnload);

	// 	return () => {
	// 		window.removeEventListener("beforeunload", handleBeforeUnload);
	// 	};
	// }, []);

	return (
		<div className=" rounded-none shadow-md min-w-[90%] w-[90%] md:max-w-[680px] md:min-w-[380px] bg-[#A6F3B228] ">
			<Formik
				initialValues={{ email: "", password: "", otp: "" }}
				onSubmit={async (values) => {
					if (mfaEnabled) {
						verifyTOTP({
							variables: {
								secret: studentUser?.mfaSecret,
								token: values.otp,
							},
						});
					} else {
						try {
							const response = await fetch(
								`${import.meta.env.VITE_API_URL}/api/auth/login`,
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

							if (data.data.user.status === "DISQUALIFIED") {
								return navigate("/disqualify", {
									replace: true,
								});
							}

							if (data.data.user.mfaEnabled) {
								setMfaEnabled(true);
								localStorage.setItem("isLoggedIn", "false");

								login(data.data.accessToken, false);
							} else {
								localStorage.removeItem("isLoggedIn");
								toast.success("Successfully logged in", {
									richColors: true,
									position: "top-center",
									dismissible: true,
									duration: 5000,
									icon: <Icon icon="clarity:error-solid" />,
								});
								navigate("/", {
									replace: true,
								});

								login(data.data.accessToken);
							}
							const { notifications, ...userData } = data.data.user;

							setStudentUser(userData);
							setNotifications(notifications || []);
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
							<div className="mb-3 h-[86px] bg-[#A6F3B2] flex items-center justify-center">
								<h1 className="text-xl">LOGIN TO YOUR ACCOUNT</h1>
							</div>
							<div className="space-y-4 px-5 md:px-14 py-10">
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
													mutating || isSubmitting ? "#" : "/forgot-password"
												}>
												Forgot Password?
											</Link>
										</div>
									</>
								) : (
									<>
										<div>
											<h1 className="text-md font-medium">
												Enter Your Two-Factor Authentication Code
											</h1>
											<p className="text-sm text-gray-500">
												Open your authenticator app (Google Authenticator or
												similar), and enter the code generated for your account.
												This code changes every 30 seconds for added security
											</p>
										</div>
										<InputOtp
											length={6}
											size="lg"
											value={values.otp}
											name="otp"
											onChange={handleChange}
											className="mx-auto "
											readOnly={isSubmitting || mutating}
										/>
									</>
								)}
								<div className="space-y-1">
									<Button
										isLoading={isSubmitting || mutating}
										type="submit"
										className="bg-[#A6F3B2]"
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
												setStudentUser(null);
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
