import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";

export default function StudentForgotPassword() {
	const navigate = useNavigate();
	const [values, setValues] = useState({
		email: "",
		otp: "",
		password: "",
		confirmPassword: "",
	});
	const [step, setStep] = useState(1);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async () => {
		if (!values.email || values.email === "") {
			return setError("Please enter your email address.");
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(values.email)) {
			return setError("Invalid Email Address.");
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

			const data = await response.json();

			if (response.status !== 200) {
				throw new Error(data.error?.message);
			}

			if (step === 1) {
				setStep((stp) => stp + 1);
			}
		} catch (error) {
			toast.error((error as Error).message, {
				richColors: true,
				dismissible: true,
				duration: 5000,
				position: "top-center",
				icon: <Icon icon="clarity:error-solid" />,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOTP = async () => {
		if (values.otp === "" || values.otp.length !== 6) {
			return setError(
				values.otp === "" ? "Please enter the OTP." : "Invalid OTP."
			);
		}
		try {
			setLoading(true);
			const response = await fetch(
				"http://localhost:4000/api/auth/verify-token",
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
			toast.error((error as Error).message, {
				richColors: true,
				dismissible: true,
				duration: 5000,
				position: "top-center",
				icon: <Icon icon="clarity:error-solid" />,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
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
			toast.error((error as Error).message, {
				richColors: true,
				dismissible: true,
				duration: 5000,
				position: "top-center",
				icon: <Icon icon="bitcoin-icons:verify-filled" />,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleShowPassword = () => setShowPassword((showPass) => !showPass);

	return (
		<div className="  w-[95%] p-1 sm:w-[70%] md:w-[50%] lg:max-w-[450px]">
			<div className="space-y-2">
				<div className="space-y-5 flex flex-col justify-start md:justify-center items-start md:items-center">
					{
						[
							<Icon
								icon="ic:round-fingerprint"
								key="fingerprint"
								className="scale-125"
								height={40}
								width={40}
							/>,
							<Icon
								icon="hugeicons:mail-open"
								key="mail-open"
								className="scale-125"
								height={40}
								width={40}
							/>,
							<Icon
								icon="fluent:password-24-filled"
								key="password"
								className="scale-125"
								height={40}
								width={40}
							/>,
							<Icon
								icon="solar:verified-check-bold"
								key="verified"
								className="scale-125"
								height={40}
								width={40}
							/>,
						][step - 1]
					}
					<div>
						<h5 className="text-2xl md:text-center">
							{
								[
									"Forgot Password?",
									"Password Reset",
									"Set new Password",
									"All Done!",
								][step - 1]
							}
						</h5>
						<p className="text-gray-500 text-start md:text-center lg:max-w-[70%] lg:mx-auto">
							{
								[
									"No worries, we'll send you an email to reset your password.",
									`We sent a code to ${values.email}. Please check your email.`,
									"Must be at least 8 characters.",
									`Your password has been reset! You can now login with your new password.`,
								][step - 1]
							}
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-5 md:mt-5 ">
				{
					[
						<Input
							key="email"
							name="email"
							label="Email"
							fullWidth
							value={values.email}
							readOnly={loading}
							onValueChange={(value) => {
								const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

								if (!emailRegex.test(value)) {
									setError("Please enter a valid email address.");
								} else {
									setError("");
								}

								setValues((v) => ({ ...v, email: value }));
							}}
							isInvalid={!!error}
							errorMessage={error}
							onKeyUp={(e) => {
								if (e.key === "Enter") {
									handleSubmit();
								}
							}}
						/>,

						<>
							<InputOtp
								length={6}
								size="lg"
								value={values.otp}
								name="otp"
								isInvalid={!!error}
								allowedKeys="^[0-9a-zA-Z]+$"
								onValueChange={(val) => {
									if (val.trim().length === 4) {
										setError("");
									}
									setValues((v) => ({ ...v, otp: val }));
								}}
								className="mx-auto text-[30px] font-bold px-1 py-1.5"
								classNames={{
									segmentWrapper:
										"flex flex-wrap justify-center gap-1 sm:gap-3 md:gap-5",
								}}
								readOnly={loading}
								errorMessage={error}
							/>
						</>,
						<>
							<Input
								className=""
								label="Password"
								type={showPassword ? "text" : "password"}
								name="password"
								isReadOnly={loading}
								fullWidth
								isInvalid={!!error}
								value={values.password}
								onValueChange={(value) => {
									if (value.trim() !== values.password.trim()) {
										setError("Password doesn't match!");
									} else if (value.trim().length < 8) {
										setError("Password must be at least 8 characters.");
									} else {
										setError("");
									}
									setValues((v) => ({ ...v, password: value }));
								}}
								radius="sm"
								errorMessage={error}
								endContent={
									<Icon
										icon={
											showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"
										}
										onClick={handleShowPassword}
										className="cursor-pointer"
									/>
								}
							/>
							<Input
								className=""
								label="Confirm Password"
								type={showPassword ? "text" : "password"}
								name="confirmPassword"
								isReadOnly={loading}
								isInvalid={!!error}
								value={values.confirmPassword}
								onValueChange={(value) => {
									if (value.trim() !== values.password.trim()) {
										setError("Password doesn't match!");
									} else {
										setError("");
									}
									setValues((v) => ({ ...v, confirmPassword: value }));
								}}
								radius="sm"
								errorMessage={error}
								endContent={
									<Icon
										icon={
											showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"
										}
										onClick={handleShowPassword}
										className="cursor-pointer"
									/>
								}
							/>
						</>,
					][step - 1]
				}
				{step === 2 && (
					<div className="flex items-center flex-wrap justify-center gap-0.5">
						<p className="text-gray-500">Don&apos; receive the email?</p>
						<button className="bg-none border-none outline-none p-0 text-blue-400 underline cursor-pointer">
							Click to resend
						</button>
					</div>
				)}
				{step < 4 && (
					<Button
						disabled={loading}
						onPress={
							[handleSubmit, handleVerifyOTP, handleResetPassword][step - 1]
						}
						isLoading={loading}
						className="block"
						fullWidth
						style={{ textTransform: "capitalize" }}>
						{["Continue", "Continue", "Reset Password"][step - 1]}
					</Button>
				)}
				<Button
					disabled={loading}
					variant={step === 4 ? "solid" : "light"}
					startContent={<Icon icon="solar:square-arrow-left-bold" />}
					onPress={() => {
						navigate("/login", {
							replace: true,
						});
					}}
					fullWidth
					className={`capitalize  ${step === 4 ? "white" : "text-gray-500"} mt-3`}
					type="submit">
					{step < 4 ? "Back to login" : "Continue to Login"}
				</Button>
			</div>
		</div>
	);
}
