import * as React from "react";
import {
	Grid2,
	Button,
	Typography,
	StepLabel,
	Step,
	Stepper,
	Box,
	TextField,
	IconButton,
	Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { formatDate, subYears } from "date-fns";
import places from "../../../../places.json";
import * as yup from "yup";
import { Verified, Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik } from "formik";
import Step3 from "./components/step3";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../../states";
const Autocomplete = React.lazy(() => import("@mui/material/Autocomplete"));

const steps = ["User Information", "Generate Password", "Add 2FA", "Review"];

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
	// schoolYear: yup.number().required("School Year is required"),
	// yearLevel: yup.number().required("Year Level is required"),
	password: yup.string().required("Password is required"),
	mfaSecret: yup.string(),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required("Confirm Password is required"),
	otp: yup.string(),
});

export default function Register() {
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set<number>());
	const [showPassword, setShowPassword] = React.useState(false);
	const [brgys, setBrgys] = React.useState<string[]>([]);
	const setSnackbar = useSetAtom(snackbarAtom);

	// const currentYear = new Date().getFullYear();
	// const schoolYears = Array.from({ length: 7 }, (_, i) => currentYear + i);

	const isStepOptional = (step: number) => {
		return step === 2;
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

	// const handleBack = () => {
	// 	setActiveStep((prevActiveStep) => prevActiveStep - 1);
	// };

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

	const handleReset = () => {
		setActiveStep(0);
	};

	const handleShowPassword = () => setShowPassword((showPass) => !showPass);

	return (
		<Box
			sx={{
				width: { xs: "95%", md: "80%", xl: "50%" },
				mt: 5,
				p: 2,
				marginInline: "auto",
			}}>
			<Stepper activeStep={activeStep} alternativeLabel>
				{steps.map((label, index) => {
					const stepProps: { completed?: boolean } = {};
					const labelProps: {
						optional?: React.ReactNode;
					} = {};
					if (isStepOptional(index)) {
						labelProps.optional = (
							<Typography variant="caption">Optional</Typography>
						);
					}
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}

					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			{activeStep === steps.length ? (
				<Stack spacing={2} justifyContent="center" alignItems="center" pt={5}>
					<Verified color="success" sx={{ fontSize: 100 }} />
					<Typography
						sx={{
							mt: 2,
							mb: 1,
							maxWidth: "fit-content",
						}}>
						Registration Completed Successfully
					</Typography>
					<Button
						variant="contained"
						sx={{
							width: { xs: "100%", sm: "auto" },
							minWidth: { xs: "100%", sm: "40%" },
						}}
						onClick={handleReset}>
						Continue to Log in
					</Button>
				</Stack>
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
								`${import.meta.env.VITE_API_URL}/api/auth/admin-register`,
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

							console.log(data, "RESPONSE");
							setActiveStep((stp) => stp + 1);
						} catch (error) {
							//
							setSnackbar((snckbr) => ({
								...snckbr,
								message: (error as Error).message,
								open: true,
								severity: "error",
								showIcon: true,
							}));
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
								: !values.password ||
								  !values.confirmPassword ||
								  Object.keys(errors).length > 0;

						console.log(values);

						return (
							<React.Fragment>
								<Grid2
									container
									spacing={2}
									pt={2}
									sx={{ m: { xs: 0, md: 3 } }}>
									{activeStep === 0 ? (
										<>
											<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
												<TextField
													fullWidth
													label="First Name"
													size="small"
													value={values.firstName}
													onChange={handleChange}
													onBlur={handleBlur}
													name="firstName"
													error={!!touched.firstName && !!errors.firstName}
													helperText={!!touched.firstName && errors.firstName}
												/>
											</Grid2>
											<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
												<TextField
													fullWidth
													label="Last Name"
													size="small"
													value={values.lastName}
													onChange={handleChange}
													onBlur={handleBlur}
													name="lastName"
													error={!!touched.lastName && !!errors.lastName}
													helperText={!!touched.lastName && errors.lastName}
												/>
											</Grid2>
											<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
												<TextField
													fullWidth
													label="Middle Name (optional)"
													size="small"
													value={values.middleName}
													onChange={handleChange}
													onBlur={handleBlur}
													name="middleName"
												/>
											</Grid2>
											<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
												<TextField
													fullWidth
													label="Email"
													type="email"
													size="small"
													value={values.email}
													onChange={handleChange}
													onBlur={handleBlur}
													name="email"
													error={!!touched.email && !!errors.email}
													helperText={!!touched.email && errors.email}
												/>
											</Grid2>
											<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
												<TextField
													fullWidth
													label="Phone Number"
													value={values.phoneNumber}
													onChange={handleChange}
													onBlur={handleBlur}
													name="phoneNumber"
													error={!!touched.phoneNumber && !!errors.phoneNumber}
													helperText={
														!!touched.phoneNumber && errors.phoneNumber
													}
													type="tel"
													size="small"
													slotProps={{
														input: {
															startAdornment: (
																<Typography sx={{ mr: 1, color: "GrayText" }}>
																	+63
																</Typography>
															),
														},
													}}
												/>
											</Grid2>
											<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
												<React.Suspense fallback={<h1>LOading,,,,</h1>}>
													<DatePicker
														label="Birth Date"
														sx={{ width: "100%" }}
														maxDate={subYears(new Date(), 15)}
														onChange={(date) => {
															if (date) {
																setFieldValue(
																	"birthDate",
																	formatDate(date, "MM/dd/yyyy")
																);
															}
														}}
														slotProps={{
															textField: {
																size: "small",
																onBlur: handleBlur,
																// value: values.birthDate,
																name: "birthDate",
																error:
																	!!touched.birthDate && !!errors.birthDate,
																helperText:
																	touched.birthDate && errors.birthDate,
															},
														}}
													/>
												</React.Suspense>
											</Grid2>
											<Grid2 size={{ xs: 12, md: 8 }}>
												<React.Suspense
													fallback={
														<TextField
															slotProps={{ input: { disabled: true } }}
															size="small"
															fullWidth
															label="City / Municipality"
														/>
													}>
													<Autocomplete
														disablePortal
														size="small"
														readOnly={isSubmitting}
														options={citiesMunicipalities}
														value={values.city}
														loadingText="Loading..."
														noOptionsText="No options"
														onBlur={handleBlur}
														onChange={(_, value) => {
															setFieldValue("city", value);
															const brgys =
																places
																	.find((place) => place.name === value)
																	?.barangays.flat() ?? [];
															setFieldValue("barangay", "");
															setBrgys(brgys);
														}}
														renderInput={(params) => (
															<TextField
																{...params}
																label="City / Municipality"
																name="city"
																error={!!touched.city && !!errors.city}
																helperText={!!touched.city && errors.city}
															/>
														)}
													/>
												</React.Suspense>
											</Grid2>
											<Grid2 size={{ xs: 12 }}>
												<React.Suspense
													fallback={
														<TextField
															slotProps={{ input: { disabled: true } }}
															size="small"
															fullWidth
															label="Barangay"
														/>
													}>
													<Autocomplete
														disablePortal
														size="small"
														value={values.barangay}
														readOnly={isSubmitting || brgys.length === 0}
														options={brgys}
														loadingText="Loading..."
														noOptionsText="No options"
														onBlur={handleBlur}
														onChange={(_, v) => {
															setFieldValue("barangay", v);
														}}
														renderInput={(params) => (
															<TextField
																{...params}
																label="Barangay"
																name="barangay"
																error={!!touched.barangay && !!errors.barangay}
																helperText={touched.barangay && errors.barangay}
															/>
														)}
													/>
												</React.Suspense>
											</Grid2>
											{/* <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
											<TextField fullWidth label="School Year" size="small" select>
												{schoolYears.map((year) => (
													<MenuItem value={year} key={year}>
														{year}
													</MenuItem>
												))}
											</TextField>
										</Grid2>
										<Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
											<TextField fullWidth label="Year Level" size="small" select>
												{[
													"First Year",
													"Second Year",
													"Third Year",
													"Fourth Year",
													"Fifth Year",
												].map((year) => (
													<MenuItem value={year} key={year}>
														{year}
													</MenuItem>
												))}
											</TextField>
										</Grid2> */}
										</>
									) : activeStep === 1 ? (
										<>
											<Grid2 size={12}>
												<center>
													<TextField
														label={"Password"}
														sx={{ width: { xs: "100%", md: "50%" } }}
														value={values.password}
														type={showPassword ? "text" : "password"}
														error={!!touched.password && !!errors.password}
														name="password"
														helperText={!!touched.password && errors.password}
														onChange={handleChange}
														onBlur={handleBlur}
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
														size="small"
													/>
												</center>
											</Grid2>
											<Grid2 size={12}>
												<center>
													<TextField
														label={"Confirm Password"}
														error={
															!!touched.confirmPassword &&
															!!errors.confirmPassword
														}
														value={values.confirmPassword}
														helperText={
															!!touched.confirmPassword &&
															errors.confirmPassword
														}
														sx={{ width: { xs: "100%", md: "50%" } }}
														type={showPassword ? "text" : "password"}
														name="confirmPassword"
														onChange={handleChange}
														onBlur={handleBlur}
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
														size="small"
													/>
												</center>
											</Grid2>
										</>
									) : activeStep === 2 ? (
										<Grid2 size={12}>
											<center>
												<Step3
													handleSaveSecret={(secret: string) => {
														console.log(secret, "qqq");
														setFieldValue("mfaSecret", secret);
													}}
													handleChangeOtp={(val) => setFieldValue("otp", val)}
													value={values.otp}
												/>
											</center>
										</Grid2>
									) : (
										<>
											<Grid2 size={{ xs: 12, md: 6 }}>
												<Stack
													className=""
													direction="row"
													paddingInline={{ xs: 1 }}
													justifyContent={{ xs: "space-between", md: "start" }}
													alignItems="center">
													<Typography
														sx={{ minWidth: { md: "50%" } }}
														color="textSecondary">
														First Name
													</Typography>
													<Typography>{values.firstName}</Typography>
												</Stack>
											</Grid2>
											{values.middleName && (
												<Grid2 size={{ xs: 12, md: 6 }}>
													<Stack
														className=""
														direction="row"
														paddingInline={{ xs: 1 }}
														justifyContent={{
															xs: "space-between",
															md: "start",
														}}
														alignItems="center">
														<Typography
															sx={{ minWidth: { md: "50%" } }}
															color="textSecondary">
															Middle Name
														</Typography>
														<Typography>{values.middleName}</Typography>
													</Stack>
												</Grid2>
											)}
											<Grid2 size={{ xs: 12, md: 6 }}>
												<Stack
													className=""
													direction="row"
													paddingInline={{ xs: 1 }}
													justifyContent={{ xs: "space-between", md: "start" }}
													alignItems="center">
													<Typography
														sx={{ minWidth: { md: "50%" } }}
														color="textSecondary">
														Last Name
													</Typography>
													<Typography>{values.lastName}</Typography>
												</Stack>
											</Grid2>
											<Grid2 size={{ xs: 12, md: 6 }}>
												<Stack
													className=""
													direction="row"
													paddingInline={{ xs: 1 }}
													justifyContent={{ xs: "space-between", md: "start" }}
													alignItems="center">
													<Typography
														sx={{ minWidth: { md: "50%" } }}
														color="textSecondary">
														Email
													</Typography>
													<Typography>{values.email}</Typography>
												</Stack>
											</Grid2>
											<Grid2 size={{ xs: 12, md: 6 }}>
												<Stack
													className=""
													direction="row"
													paddingInline={{ xs: 1 }}
													justifyContent={{ xs: "space-between", md: "start" }}
													alignItems="center">
													<Typography
														sx={{ minWidth: { md: "50%" } }}
														color="textSecondary">
														Phone Number
													</Typography>
													<Typography>+63{values.phoneNumber}</Typography>
												</Stack>
											</Grid2>
											<Grid2 size={{ xs: 12, md: 6 }}>
												<Stack
													className=""
													direction="row"
													paddingInline={{ xs: 1 }}
													justifyContent={{ xs: "space-between", md: "start" }}
													alignItems="center">
													<Typography
														sx={{ minWidth: { md: "50%" } }}
														color="textSecondary">
														Birth Date
													</Typography>
													<Typography>
														{formatDate(
															new Date(values.birthDate),
															"MMMM dd, yyyy"
														)}
													</Typography>
												</Stack>
											</Grid2>
											<Grid2 size={{ xs: 12, md: 6 }}>
												<Stack
													className=""
													direction="row"
													paddingInline={{ xs: 1 }}
													justifyContent={{ xs: "space-between", md: "start" }}
													alignItems="center">
													<Typography
														sx={{ minWidth: { md: "50%" } }}
														color="textSecondary">
														City / Municipality
													</Typography>
													<Typography>{values.city}</Typography>
												</Stack>
											</Grid2>
											<Grid2 size={{ xs: 12, md: 6 }}>
												<Stack
													className=""
													direction="row"
													paddingInline={{ xs: 1 }}
													justifyContent={{ xs: "space-between", md: "start" }}
													alignItems="center">
													<Typography
														sx={{ minWidth: { md: "50%" } }}
														color="textSecondary">
														Barangay
													</Typography>
													<Typography>{values.barangay}</Typography>
												</Stack>
											</Grid2>
											<Grid2 size={{ xs: 12, md: 6 }}>
												<Stack
													className=""
													direction="row"
													paddingInline={{ xs: 1 }}
													justifyContent={{ xs: "space-between", md: "start" }}
													alignItems="center">
													<Typography
														sx={{ minWidth: { md: "50%" } }}
														color="textSecondary">
														Password
													</Typography>
													<Stack direction={"row"} spacing={1}>
														<Typography>
															{showPassword
																? Array.from({
																		length: values.confirmPassword.length,
																  })
																		.map(() => "•")
																		.join("")
																: values.confirmPassword}
														</Typography>
														<Typography
															variant="subtitle2"
															onClick={handleShowPassword}
															color="info"
															sx={{
																textDecoration: "underline",
																cursor: "pointer",
															}}>
															{!showPassword ? "Hide" : "Show"}
														</Typography>
													</Stack>
												</Stack>
											</Grid2>
											<Grid2 size={{ xs: 12, md: 6 }}>
												<Stack
													className=""
													direction="row"
													paddingInline={{ xs: 1 }}
													justifyContent={{
														xs: "space-between",
														md: "start",
													}}
													alignItems="center">
													<Typography
														sx={{ minWidth: { md: "50%" } }}
														color="textSecondary">
														2FA Enabled
													</Typography>
													<Typography>
														{values.mfaSecret ? "Enabled" : "Skipped"}
													</Typography>
												</Stack>
											</Grid2>
										</>
									)}
								</Grid2>

								<Box
									sx={{
										display: "flex",
										flexDirection: "row",
										pt: 2,
									}}>
									<Button
										color="inherit"
										disabled={activeStep === 0}
										onClick={handleBack}
										sx={{ mr: 1 }}>
										Back
									</Button>
									<Box sx={{ flex: "1 1 auto" }} />
									{isStepOptional(activeStep) && (
										<Button
											color="inherit"
											disabled={!!values.mfaSecret}
											onClick={handleSkip}
											sx={{ mr: 1 }}>
											Skip
										</Button>
									)}
									<Button
										disabled={isSubmitting || disabledNextButton}
										onClick={
											activeStep === steps.length - 1
												? () => handleSubmit()
												: handleNext
										}>
										{activeStep === steps.length - 1 ? "Finish" : "Next"}
									</Button>
								</Box>
							</React.Fragment>
						);
					}}
				</Formik>
			)}
		</Box>
	);
}
//
