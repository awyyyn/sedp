import * as React from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { DatePicker } from "@heroui/date-picker";
import { Button } from "@heroui/button";
import { formatDate } from "date-fns";
import { Input } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { getLocalTimeZone, today } from "@internationalized/date";
import { toast } from "sonner";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";

import places from "../../../../places.json";
import SetUpTwoFactor from "../../../components/set-up-two-factor";

import { RowSteps } from "@/components/";
import { years } from "@/constants";

const steps = [
	{
		title: "Personal Information",
	},
	{
		title: "School Information",
	},
	{
		title: "Generate Password",
	},
	{
		title: "Add 2FA",
	},
	{
		title: "Review",
	},
];

const formSchema = yup.object({
	firstName: yup.string().required("First Name is required"),
	lastName: yup.string().required("Last Name is required"),
	middleName: yup.string(),
	email: yup.string().email("Invalid email").required("Email is required"),
	phoneNumber: yup
		.string()
		.matches(/^9\d{9}$/, "Phone Number must start with 9 and be 10 digits long")
		.required("Phone Number is required"),
	birthDate: yup.date().required("Birth Date is required"),
	city: yup.string().required("City/Municipality is required"),
	barangay: yup.string().required("Barangay is required"),
	yearLevel: yup.number().required("Year Level is required"),
	password: yup.string().required("Password is required"),
	mfaSecret: yup.string(),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required("Confirm Password is required"),
	otp: yup.string(),
});

export default function StudentRegister() {
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set());
	const [showPassword, setShowPassword] = React.useState(false);
	const [brgys, setBrgys] = React.useState<string[]>([]);
	const navigate = useNavigate();

	const isStepOptional = (step: number) => {
		return step === 3;
	};

	const citiesMunicipalities = React.useMemo(
		() => places.map((place) => place.name),
		[]
	);

	const isStepSkipped = (step: number) => {
		return skipped.has(step);
	};

	const handleNext = React.useCallback(() => {
		let newSkipped = skipped;

		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	}, [activeStep, skipped]);

	const handleBack = React.useCallback(() => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	}, []);

	const handleSkip = React.useCallback(() => {
		if (!isStepOptional(activeStep)) {
			throw new Error("You can't skip a step that isn't optional.");
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());

			newSkipped.add(activeStep);

			return newSkipped;
		});
	}, [activeStep]);

	const handleShowPassword = () => setShowPassword((showPass) => !showPass);

	return (
		<div className="w-[95%] md:w-[80%] self-start xl:w-[50%] mt-5 p-2">
			<RowSteps defaultStep={0} currentStep={activeStep} steps={steps} />
			{activeStep === steps.length ? (
				<div className="gap-2 justify-center flex flex-col items-center pt-5">
					<Icon
						icon="solar:verified-check-bold"
						key="verified"
						className="text-green-300"
						height={200}
						width={200}
					/>
					<h1 className="w-fit mt-2 mb-1">
						Registration Completed Successfully
					</h1>
					<Button
						variant="bordered"
						className="w-full md:max-w-[40%] "
						onPress={() => navigate("/login", { replace: true })}>
						Continue to Log in
					</Button>
				</div>
			) : (
				<Formik
					initialValues={{
						password: "",
						confirmPassword: "",
						city: "",
						barangay: "",
						birthDate: "",
						phoneNumber: "",
						firstName: "",
						lastName: "",
						middleName: "",
						email: "",
						mfaSecret: "",
						yearLevel: "",
						schoolName: "",
						otp: "",
					}}
					validationSchema={formSchema}
					onSubmit={async (values) => {
						try {
							//
							const body = {
								...values,
								street: values.barangay,
							};
							const response = await fetch(
								`${import.meta.env.VITE_API_URL}/api/auth/register`,
								{
									headers: {
										"Content-type": "application/json",
									},
									method: "POST",
									body: JSON.stringify(body),
								}
							);

							const data = await response.json();

							if (response.status !== 201) {
								throw new Error(data.error.message ?? "Something went wrong!");
							}
							navigate("/", { replace: true });
							setActiveStep((stp) => stp + 1);
						} catch (error) {
							//
							toast.error((error as Error).message, {
								richColors: true,
								position: "top-center",
								dismissible: true,
								duration: 5000,
								icon: <Icon icon="bitcoin-icons:verify-filled" />,
							});
						}
					}}>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
						setFieldValue,
					}) => {
						const disabledNextButton =
							activeStep === 0
								? !values.barangay ||
									!values.city ||
									!values.birthDate ||
									!values.phoneNumber ||
									!values.lastName ||
									!values.firstName ||
									!!errors.email ||
									!!errors.birthDate
								: activeStep === 1
									? !values.yearLevel || !values.schoolName
									: !values.password ||
										!values.confirmPassword ||
										Object.keys(errors).length > 0;

						return (
							<React.Fragment>
								<div className=" pt-2 md:m-3">
									{activeStep === 0 ? (
										<div className="grid grid-cols-12 gap-2">
											<div className="col-span-12 md:col-span-4">
												<Input
													label="First Name"
													type="text"
													name="firstName"
													isReadOnly={isSubmitting}
													value={values.firstName}
													isInvalid={!!touched.firstName && !!errors.firstName}
													radius="sm"
													onChange={handleChange}
													onBlur={handleBlur}
													errorMessage={touched.firstName && errors.firstName}
												/>
											</div>
											<div className="col-span-12 md:col-span-4  ">
												<Input
													label="Last Name"
													type="text"
													name="lastName"
													isReadOnly={isSubmitting}
													value={values.lastName}
													radius="sm"
													onChange={handleChange}
													onBlur={handleBlur}
													isInvalid={!!touched.lastName && !!errors.lastName}
													errorMessage={touched.lastName && errors.lastName}
												/>
											</div>
											<div className="col-span-12 md:col-span-4 ">
												<Input
													label="Middle Name"
													type="text"
													name="middleName"
													isReadOnly={isSubmitting}
													value={values.middleName}
													radius="sm"
													onChange={handleChange}
													onBlur={handleBlur}
												/>
											</div>
											<div className="col-span-12 md:col-span-6  ">
												<Input
													label="Email"
													type="email"
													name="email"
													isInvalid={!!touched.email && !!errors.email}
													isReadOnly={isSubmitting}
													value={values.email}
													radius="sm"
													onChange={handleChange}
													onBlur={handleBlur}
													errorMessage={touched.email && errors.email}
												/>
											</div>
											<div className="col-span-12 md:col-span-6  ">
												<Input
													label="Phone Number"
													type="tel"
													name="phoneNumber"
													isReadOnly={isSubmitting}
													value={values.phoneNumber}
													radius="sm"
													isInvalid={
														!!touched.phoneNumber && !!errors.phoneNumber
													}
													onChange={handleChange}
													onBlur={handleBlur}
													errorMessage={
														touched.phoneNumber && errors.phoneNumber
													}
													startContent={
														<p className="text-sm text-gray-500">+63</p>
													}
												/>
											</div>
											<div className="col-span-12 md:col-span-4  ">
												<DatePicker
													label={
														values.birthDate
															? "Birth Date"
															: "Select Birth Date"
													}
													fullWidth
													showMonthAndYearPickers
													maxValue={today(getLocalTimeZone()).subtract({
														years: 15,
														months: new Date().getMonth(),
													})}
													onChange={(v) => {
														if (v) {
															setFieldValue(
																"birthDate",
																formatDate(v, "MM/dd/yyyy")
															);
														}
													}}
													isInvalid={!!touched.birthDate && !!errors.birthDate}
													onBlur={handleBlur}
													name="birthDate"
													errorMessage={!!touched.birthDate && errors.birthDate}
												/>
											</div>

											<div className="col-span-12 md:col-span-8">
												<React.Suspense
													fallback={
														<Input
															fullWidth
															readOnly
															label="Select City / Municipality"
														/>
													}>
													<Autocomplete
														name="city"
														label="Select City / Municipality"
														isInvalid={!!touched.city && !!errors.city}
														onSelectionChange={(value) => {
															setFieldValue("city", value);
															const brgys =
																places
																	.find((place) => place.name === value)
																	?.barangays.flat() ?? [];

															setFieldValue("barangay", "");
															setBrgys(brgys);
														}}
														size="md"
														onBlur={handleBlur}
														errorMessage={touched.city && errors.city}
														fullWidth>
														{citiesMunicipalities.map((ci) => (
															<AutocompleteItem
																key={ci}
																value={ci}
																className="capitalize">
																{ci}
															</AutocompleteItem>
														))}
													</Autocomplete>
												</React.Suspense>
											</div>
											<div className="col-span-12 ">
												<React.Suspense
													fallback={
														<Input
															fullWidth
															readOnly
															label="Select City / Municipality"
														/>
													}>
													<Autocomplete
														name="barangay"
														label="Select Barangay"
														onSelectionChange={(value) => {
															setFieldValue("barangay", value);
														}}
														onBlur={handleBlur}
														errorMessage={touched.barangay && errors.barangay}
														fullWidth
														isInvalid={!!touched.barangay && !!errors.barangay}
														value={values.barangay}>
														{brgys.map((brgy) => (
															<AutocompleteItem
																key={brgy}
																value={brgy}
																className="capitalize">
																{brgy}
															</AutocompleteItem>
														))}
													</Autocomplete>
												</React.Suspense>
											</div>
										</div>
									) : activeStep === 1 ? (
										<div className="w-full md:max-w-[50%] mx-auto mt-5 mb-40 space-y-5">
											<Select
												className=""
												label="Select Year Level"
												name="yearLevel"
												errorMessage={touched.yearLevel && errors.yearLevel}
												onBlur={handleBlur}
												isInvalid={!!touched.yearLevel && !!errors.yearLevel}
												selectedKeys={[values.yearLevel]}
												onChange={(v) => {
													setFieldValue("yearLevel", v.target.value.toString());
												}}>
												{years.map((year) => (
													<SelectItem
														key={year.value.toString()}
														textValue={year.label}>
														{year.label}{" "}
														{year.optional && "(If Applicable to your program)"}
													</SelectItem>
												))}
											</Select>
											<Autocomplete
												name="schoolName"
												label="School Name"
												selectedKey={values.schoolName}
												onSelectionChange={(v) =>
													setFieldValue("schoolName", v)
												}
												errorMessage={touched.schoolName && errors.schoolName}
												onBlur={handleBlur}
												isInvalid={!!touched.schoolName && !!errors.schoolName}>
												<AutocompleteItem key={"item-1"} value={"item-1"}>
													Item 1
												</AutocompleteItem>
												<AutocompleteItem key={"item-2"} value={"item-2"}>
													Item 2
												</AutocompleteItem>
											</Autocomplete>
										</div>
									) : activeStep === 2 ? (
										<div className="grid gap-5">
											<div className="col-span-12">
												<div className="w-full md:w-[50%] mx-auto">
													<Input
														className=""
														label="Password"
														type={showPassword ? "text" : "password"}
														name="password"
														isInvalid={!!touched.password && !!errors.password}
														isReadOnly={isSubmitting}
														value={values.password}
														onChange={handleChange}
														onBlur={handleBlur}
														radius="sm"
														errorMessage={errors.password}
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
												</div>
											</div>
											<div className="col-span-12">
												<div className="w-full md:w-[50%] mx-auto">
													<Input
														className=""
														label="Confirm Password"
														type={showPassword ? "text" : "password"}
														name="confirmPassword"
														isReadOnly={isSubmitting}
														isInvalid={
															!!touched.confirmPassword &&
															!!errors.confirmPassword
														}
														value={values.confirmPassword}
														onChange={handleChange}
														onBlur={handleBlur}
														radius="sm"
														fullWidth
														// validationBehavior="native"
														// validate={(v) => {}}
														errorMessage={errors.confirmPassword}
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
												</div>
											</div>
										</div>
									) : activeStep === 3 ? (
										<div className=" space-y-2 pb-5">
											<SetUpTwoFactor
												handleSaveSecret={(secret: string) => {
													setFieldValue("mfaSecret", secret);
												}}
												handleChangeOtp={(val) => setFieldValue("otp", val)}
												value={values.otp}
											/>
										</div>
									) : (
										<div className="space-y-2">
											<h1>Personal Information</h1>
											<div className="px-2 space-y-2">
												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														First Name
													</p>
													<p className="text-medium">{values.firstName}</p>
												</div>

												{values.middleName && (
													<div className="  flex justify-between   items-center px-1">
														<p className="text-gray-500 md:min-w-[50%]">
															Middle Name
														</p>
														<p className="text-medium">{values.middleName}</p>
													</div>
												)}

												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														Last Name
													</p>
													<p className="text-medium">{values.lastName}</p>
												</div>

												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">Email</p>
													<p className="text-medium">{values.email}</p>
												</div>

												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														Phone Number
													</p>
													<p className="text-medium">
														+63 {values.phoneNumber}
													</p>
												</div>

												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														Birth Date
													</p>
													<p className="text-medium">
														{formatDate(
															new Date(values.birthDate),
															"MMMM dd, yyyy"
														)}
													</p>
												</div>

												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														City / Municipality
													</p>
													<p className="text-medium">{values.city}</p>
												</div>

												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														Barangay
													</p>
													<p className="text-medium">{values.barangay}</p>
												</div>
											</div>
											<Divider />
											<br />
											<h1>School Information</h1>
											<div className="px-2 space-y-2">
												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														School Name
													</p>

													<p className="text-medium">{values.schoolName}</p>
												</div>
												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														School Name
													</p>

													<p className="text-medium">
														{
															years.find(
																(y) => y.value.toString() === values.yearLevel
															)?.label
														}
													</p>
												</div>
											</div>
											<Divider />
											<br />
											<h1>Password</h1>
											<div className="px-2 space-y-2">
												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														Password
													</p>

													<div className="flex">
														<p className="text-medium">
															{showPassword
																? Array.from({
																		length: values.confirmPassword.length,
																	})
																		.map(() => "•")
																		.join("")
																: values.confirmPassword}
														</p>
														<button
															className="underline bg-none text-xs ml-2 border-none outline-none text-blue-600 cursor-pointer"
															onClick={handleShowPassword}>
															{!showPassword ? "Hide" : "Show"}
														</button>
													</div>
												</div>
											</div>
											<Divider />
											<br />
											<h1>Multi-Factor Authentication</h1>
											<div className="px-2 space-y-2">
												<div className="  flex justify-between   items-center px-1">
													<p className="text-gray-500 md:min-w-[50%]">
														2FA Enabled
													</p>
													<p className="text-medium">
														{values.mfaSecret ? "Enabled" : "Skipped"}
													</p>
												</div>
											</div>
											<Divider />
											<br />
										</div>
									)}
								</div>

								<div className="flex pt-2">
									{activeStep !== 0 && (
										<Button
											isDisabled={activeStep === 0}
											onPress={handleBack}
											className="mr-1">
											Back
										</Button>
									)}

									<div className="flex-1" />
									{/* <Box sx={{ flex: "1 1 auto" }} /> */}
									{isStepOptional(activeStep) && (
										<Button
											disabled={!!values.mfaSecret}
											onPress={handleSkip}
											variant="light"
											className="mr-1">
											Skip
										</Button>
									)}
									<Button
										isLoading={isSubmitting}
										isDisabled={isSubmitting || disabledNextButton}
										onPress={
											activeStep === steps.length - 1
												? () => handleSubmit()
												: handleNext
										}>
										{activeStep === steps.length - 1 ? "Finish" : "Next"}
									</Button>
								</div>
							</React.Fragment>
						);
					}}
				</Formik>
			)}
		</div>
	);
}
//
