import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Form, Formik } from "formik";
import { Suspense, useMemo, useState } from "react";
import { RadioGroup, Radio } from "@heroui/radio";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { useMutation } from "@apollo/client";
import { DatePicker } from "@heroui/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { toast } from "sonner";

import places from "../../../../places.json";

import { generatePassword } from "@/lib/utils";
import { addAdminSchema } from "@/definitions";
import { AddAdminSchemaData } from "@/types";
import { CREATE_SYSTEM_USER_MUTATION } from "@/queries";

export default function AddSystemUser() {
	const [streets, setStreet] = useState<string[]>([]);
	const [createSystemUser] = useMutation(CREATE_SYSTEM_USER_MUTATION);
	const citiesMunicipalities = useMemo(
		() => places.map((place) => place.name),
		[]
	);

	return (
		<Card className="rounded-md shadow-md mb-10 ">
			<CardHeader className="flex rounded-none bg-[#A6F3B2] flex-col items-start">
				<h1 className="text-2xl">Create new admin account</h1>
				<p>
					Generate secure credentials for a new administrator and send them via
					email.
				</p>
			</CardHeader>
			<CardBody className="bg-[#A6F3B235]">
				<div className="lg:max-w-[80%] w-full mx-auto my-5">
					<Formik
						validationSchema={addAdminSchema}
						initialValues={{} as AddAdminSchemaData}
						validateOnBlur
						onSubmit={async (values: AddAdminSchemaData, helpers) => {
							try {
								const { street, city, ...data } = values;

								await createSystemUser({
									variables: {
										...data,
										address: {
											city,
											street,
										},
									},
								});

								helpers.resetForm();

								toast.success("Admin account created successfully", {
									description:
										"The new admin account has been created and the registration link has been sent to the provided email address.",
									position: "top-center",
									richColors: true,
								});
							} catch (err) {
								toast.error("Failed to create admin account", {
									description:
										"There was an error creating the admin account. Please try again.",
									position: "top-center",
									richColors: true,
								});
							}
						}}>
						{({
							handleSubmit,
							handleBlur,
							handleChange,
							setFieldValue,
							values,
							touched,
							errors,
							isSubmitting,
							isValid,
						}) => {
							return (
								<Form
									className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-6"
									onSubmit={handleSubmit}>
									<div className="lg:col-span-6">Personal Information</div>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.firstName && !!errors.firstName}
										errorMessage={errors.firstName}
										onBlur={handleBlur}
										onChange={handleChange}
										className="lg:col-span-2"
										name="firstName"
										label="First Name"
									/>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.middleName && !!errors.middleName}
										errorMessage={errors.middleName}
										onBlur={handleBlur}
										onChange={handleChange}
										name="middleName"
										className="lg:col-span-2"
										label="Middle Name"
									/>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.lastName && !!errors.lastName}
										errorMessage={errors.lastName}
										onBlur={handleBlur}
										onChange={handleChange}
										className="lg:col-span-2"
										name="lastName"
										label="Last Name"
									/>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.email && !!errors.email}
										errorMessage={errors.email}
										onBlur={handleBlur}
										onChange={handleChange}
										className="lg:col-span-3"
										label="Email Address"
										name="email"
									/>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.phoneNumber && !!errors.phoneNumber}
										errorMessage={errors.phoneNumber}
										onBlur={handleBlur}
										onChange={handleChange}
										className="lg:col-span-3"
										name="phoneNumber"
										label="Phone Number"
										startContent={<p className="text-sm">+63</p>}
									/>
									<RadioGroup
										label="Gender"
										className="lg:col-span-3 "
										name="gender"
										isReadOnly={isSubmitting}
										isInvalid={touched.gender && !!errors.gender}
										errorMessage={String(errors.gender) || "asd"}
										onBlur={handleBlur}
										onChange={handleChange}
										orientation="horizontal">
										<Radio value="MALE">Male</Radio>
										<Radio value="FEMALE">Female</Radio>
									</RadioGroup>
									<DatePicker
										showMonthAndYearPickers
										isReadOnly={isSubmitting}
										isInvalid={touched.birthDate && !!errors.birthDate}
										errorMessage={String(errors.birthDate)}
										onBlur={handleBlur}
										onChange={(e) => {
											if (e === null) return;
											const dateValue: {
												year: number;
												month: number;
												day: number;
											} = e;
											// console.log(parseAbsoluteToLocal, "qqqdate");

											const jsDate = dateValue
												? new Date(
														dateValue.year,
														dateValue.month - 1,
														dateValue.day
													)
												: null;

											console.log(jsDate, "qqqdate");
											setFieldValue("birthDate", jsDate);

											// console.log(new Date())
										}}
										className="lg:col-span-3"
										label="Birth Date"
										maxValue={today(getLocalTimeZone()).subtract({ years: 18 })}
									/>

									<div className="lg:col-span-6 mt-4">Address Information</div>

									<div className="lg:col-span-3">
										<Suspense
											fallback={
												<Input
													fullWidth
													readOnly
													label="Select City / Municipality"
												/>
											}>
											<Autocomplete
												as="ul"
												isReadOnly={isSubmitting}
												name="city"
												label="Select City / Municipality"
												isInvalid={!!touched.city && !!errors.city}
												onSelectionChange={(value) => {
													setFieldValue("city", value);
													const streets =
														places
															.find((place) => place.name === value)
															?.barangays.flat() ?? [];

													setFieldValue("street", "");
													setStreet(streets);
												}}
												size="md"
												onBlur={handleBlur}
												errorMessage={touched.city && errors.city}
												fullWidth>
												{citiesMunicipalities.map((ci) => (
													<AutocompleteItem
														as="li"
														key={ci}
														value={ci}
														className="capitalize">
														{ci}
													</AutocompleteItem>
												))}
											</Autocomplete>
										</Suspense>
									</div>
									<div className="lg:col-span-3   ">
										<Suspense
											fallback={
												<Input
													fullWidth
													readOnly
													label="Select City / Municipality"
												/>
											}>
											<Autocomplete
												isReadOnly={isSubmitting}
												name="street"
												label="Select Barangay"
												errorMessage={touched.street && errors.street}
												onBlur={handleBlur}
												onSelectionChange={(value) => {
													setFieldValue("street", value);
												}}
												isDisabled={!values.city}
												fullWidth
												isInvalid={
													(touched.street && !values.city) ||
													(!!touched.street && !!errors.street)
												}
												value={values.street}>
												{streets.map((brgy) => (
													<AutocompleteItem
														key={brgy}
														value={brgy}
														className="capitalize">
														{brgy}
													</AutocompleteItem>
												))}
											</Autocomplete>
										</Suspense>
									</div>

									<div className="lg:col-span-6 mt-4">
										<div className="flex justify-between py-0.5">
											<p>Security</p>
											<Button
												type="button"
												className=""
												variant="light"
												size="sm"
												onPress={() => {
													setFieldValue("password", generatePassword());
												}}>
												Generate password
											</Button>
										</div>
										<Input
											isReadOnly={isSubmitting}
											readOnly={isSubmitting}
											value={values.password}
											isInvalid={touched.password && !!errors.password}
											errorMessage={errors.password}
											onBlur={handleBlur}
											onChange={handleChange}
											name="password"
											label="Password"
										/>
									</div>
									<RadioGroup
										label="Role"
										className="lg:col-span-6 "
										isReadOnly={isSubmitting}
										value={values.role ? String(values.role) : null}
										onChange={handleChange}
										onBlur={handleBlur}
										name="role"
										orientation="horizontal">
										<Radio value="SUPER_ADMIN">Full Access</Radio>
										<Radio value="ADMIN_MANAGE_SCHOLAR">Manage Scholar</Radio>
										<Radio value="ADMIN_MANAGE_GATHERINGS">
											Manage Gatherings
										</Radio>
										<Radio value="ADMIN_MANAGE_DOCUMENTS">
											Manage Documents
										</Radio>
										<Radio value="ADMIN_VIEWER">Viewer</Radio>
									</RadioGroup>
									<div className="lg:col-span-6 flex justify-center mt-5">
										<Button
											type="submit"
											isDisabled={!isValid || isSubmitting}
											isLoading={isSubmitting}
											// onPress={() => {
											// 	setTouched({
											// 		birthDate: true,
											// 		city: true,
											// 		contact: true,
											// 		email: true,
											// 		firstName: true,
											// 		gender: true,
											// 		lastName: true,
											// 		middleName: true,
											// 		password: true,
											// 		role: true,
											// 		street: true,
											// 	});
											// }}
											className="min-w-full md:min-w-[60%] bg-[#A6F3B2]">
											Register Admin
										</Button>
									</div>
								</Form>
							);
						}}
					</Formik>
				</div>
			</CardBody>
		</Card>
	);
}

// "note": "This list is not exhaustive. Philippine universities and colleges regularly update their program offerings based on industry demands and educational trends."
