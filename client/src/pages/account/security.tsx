import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Formik } from "formik";
import * as yup from "yup";
import { Input } from "@heroui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { Helmet } from "react-helmet";

import SetUpTwoFactor from "../../components/set-up-two-factor";
import { DeleteModal } from "../admin/__components";

import { useAuth } from "@/contexts";
import { UPDATE_STUDENT_MUTATION } from "@/queries";

const PasswordSchema = yup.object({
	password: yup
		.string()
		.required("New Password required!")
		.min(8, "Password must be at least 8 characters long")
		.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
		.matches(/[a-z]/, "Password must contain at least one lowercase letter")
		.matches(/[0-9]/, "Password must contain at least one number")
		.matches(/[\W_]/, "Password must contain at least one special character"),
	confirmPassword: yup
		.string()
		.required("Confirm Password required!")
		.oneOf([yup.ref("password")], "Passwords must match"),
});

export default function Security() {
	const { studentUser, setStudentUser } = useAuth();
	const [setUp2Fa, onSetUp2Fa] = useState(false);
	const [otp, setOtp] = useState("");
	const [disableModal, setDisableModal] = useState(false);
	const [showPassword, onShowPassword] = useState(false);

	const [handleUpdate] = useMutation(UPDATE_STUDENT_MUTATION);

	const handleSetUp2FA = async (mfaSecret: string) => {
		try {
			const { data } = await handleUpdate({
				variables: {
					mfaSecret,
					mfaEnabled: !!mfaSecret,
					id: String(studentUser?.id),
				},
			});

			setStudentUser(data.updateStudent);
			if (!mfaSecret) setDisableModal(false);
			toast.success(
				!!mfaSecret
					? "Two-Factor Authentication set up successfully!"
					: "Two-Factor Authentication disabled successfully!",
				{
					description: !!mfaSecret
						? "Your 2FA has been configured."
						: "Your 2FA has been removed.",
					position: "top-center",
					richColors: true,
				}
			);
		} catch (error) {
			toast.error((error as Error).message, {
				richColors: true,
				position: "top-center",
				dismissible: true,
				duration: 5000,
				icon: <Icon icon="bitcoin-icons:verify-filled" />,
			});
		}
	};

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Security Settings | SEDP</title>
				<meta
					name="description"
					content="Manage your security settings, including password changes and two-factor authentication."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<div className="container mx-auto  max-w-3xl py-8 space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Security Settings
						</h1>
						<p className="text-muted-foreground">
							Configure your security options and manage account protection
						</p>
					</div>
					{/* <div className="space-y-2 md:space-y-0  md:space-x-2"></div> */}
				</div>

				<div className="space-y-6">
					<Formik
						onSubmit={async (values, helpers) => {
							try {
								await handleUpdate({
									variables: {
										id: String(studentUser?.id),
										password: values.confirmPassword,
									},
								});

								toast.success("Password updated successfully!", {
									description: "Your password has been changed.",
									position: "top-center",
									richColors: true,
								});
								helpers.resetForm();
							} catch (error) {
								toast.error((error as Error).message, {
									richColors: true,
									position: "top-center",
									dismissible: true,
									duration: 5000,
									icon: <Icon icon="bitcoin-icons:verify-filled" />,
								});
							}
						}}
						validationSchema={PasswordSchema}
						initialValues={{
							password: "",
							confirmPassword: "",
						}}>
						{({
							handleBlur,
							handleChange,
							values,
							errors,
							isSubmitting,
							isValid,
							resetForm,
							handleSubmit,
						}) => (
							<Card>
								<CardHeader className="px-6 pt-4 flex justify-between">
									<h1 className="flex items-center gap-2">
										<Icon
											icon="solar:password-minimalistic-outline"
											width="24"
											height="24"
										/>
										Password
									</h1>

									<div className="space-y-2 flex md:space-y-0  md:space-x-2">
										{(values.password || !!errors.password) && (
											<>
												<Button
													isDisabled={isSubmitting}
													type="button"
													color="danger"
													variant="ghost"
													radius="sm"
													onPress={() => resetForm()}>
													Cancel
												</Button>
												<Button
													isLoading={isSubmitting}
													isDisabled={!isValid}
													type="submit"
													onPress={() => handleSubmit()}
													color="primary"
													radius="sm">
													Save
												</Button>
											</>
										)}
									</div>
								</CardHeader>
								<Divider />
								<CardBody className="p-6 space-y-4">
									<div className="grid grid-cols-1 gap-4  ">
										<Input
											name="password"
											label="Password"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.password}
											type={showPassword ? "text" : "password"}
											isReadOnly={isSubmitting}
											errorMessage={errors.password}
											isInvalid={!!errors.password}
											endContent={
												<Icon
													icon={
														showPassword
															? "solar:eye-bold"
															: "solar:eye-closed-bold"
													}
													onClick={() => onShowPassword((show) => !show)}
													className="cursor-pointer"
												/>
											}
										/>
										<Input
											name="confirmPassword"
											label="Confirm Password"
											value={values.confirmPassword}
											type={showPassword ? "text" : "password"}
											onChange={handleChange}
											onBlur={handleBlur}
											isReadOnly={isSubmitting || !!errors.password}
											isInvalid={!!errors.confirmPassword}
											errorMessage={errors.confirmPassword}
											endContent={
												<Icon
													icon={
														showPassword
															? "solar:eye-bold"
															: "solar:eye-closed-bold"
													}
													onClick={() => onShowPassword((show) => !show)}
													className="cursor-pointer"
												/>
											}
										/>
									</div>
								</CardBody>
							</Card>
						)}
					</Formik>
					<Card>
						<CardHeader className="px-6 flex justify-between pt-4">
							<h1 className="flex items-center gap-2">
								<Icon
									icon="solar:shield-keyhole-linear"
									width="24"
									height="24"
								/>
								Two Factor Authentication
							</h1>

							<div className="space-y-2 md:space-y-0  md:space-x-2">
								{setUp2Fa && (
									<Button
										onPress={() => onSetUp2Fa(false)}
										color="danger"
										radius="sm">
										Cancel
									</Button>
								)}
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="p-6 space-y-4">
							<div className="grid grid-cols-1 gap-4  ">
								{!setUp2Fa && (
									<Button
										className=""
										color={!studentUser?.mfaEnabled ? "primary" : "danger"}
										type="button"
										onPress={() => {
											if (studentUser?.mfaEnabled) {
												setDisableModal(true);
											} else {
												onSetUp2Fa(true);
											}
										}}>
										{studentUser?.mfaEnabled ? "Disable 2FA" : "Set up 2FA"}
									</Button>
								)}
								{setUp2Fa && (
									<SetUpTwoFactor
										handleChangeOtp={(otp) => setOtp(otp)}
										handleSaveSecret={handleSetUp2FA}
										value={otp}
									/>
								)}
							</div>
						</CardBody>
					</Card>
				</div>

				<DeleteModal
					handleDeletion={() => handleSetUp2FA("")}
					hideNote
					loading={false}
					open={disableModal}
					setOpen={setDisableModal}
					title="Disable Two Factor Authentication"
					description="Are you sure you want to disable Two Factor Authentication? This will remove an extra layer of security from your account."
					deleteLabel="Disable"
				/>
			</div>
		</>
	);
}
