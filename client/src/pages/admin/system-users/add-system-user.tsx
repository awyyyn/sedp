import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Form, Formik } from "formik";
import { Suspense, useMemo, useState } from "react";
import { RadioGroup, Radio } from "@heroui/radio";
import {
	Autocomplete,
	AutocompleteItem,
	AutocompleteSection,
} from "@heroui/autocomplete";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";

import places from "../../../../places.json";
import degrees from "../../../../degrees.json";

import { years } from "@/constants";
import { addScholarSchema } from "@/definitions";
import { AddScholarSchemaData } from "@/types";

export default function AddSystemUser() {
	const [streets, setStreet] = useState<string[]>([]);

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
						validationSchema={addScholarSchema}
						initialValues={{} as AddScholarSchemaData}
						onSubmit={() => {}}>
						{({
							handleSubmit,
							handleBlur,
							handleChange,
							setFieldValue,
							values,
							touched,
							errors,
							isSubmitting,
						}) => {
							return (
								<Form
									className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-6"
									onSubmit={handleSubmit}>
									<div className="lg:col-span-6">Personal Information</div>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.firstName && !!errors.firstName}
										errorMessage={touched.email && errors.email}
										className="lg:col-span-2"
										label="First Name"
									/>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.middleName && !!errors.middleName}
										errorMessage={touched.middleName && errors.middleName}
										className="lg:col-span-2"
										label="Middle Name"
									/>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.lastName && !!errors.lastName}
										errorMessage={touched.lastName && errors.lastName}
										className="lg:col-span-2"
										label="Last Name"
									/>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.email && !!errors.email}
										errorMessage={touched.email && errors.email}
										className="lg:col-span-3"
										label="Email Address"
									/>
									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.email && !!errors.email}
										errorMessage={touched.email && errors.email}
										className="lg:col-span-3"
										label="Email Address"
									/>
									<RadioGroup
										label="Gender"
										className="lg:col-span-3 "
										orientation="horizontal">
										<Radio value="Male">Male</Radio>
										<Radio value="Female">Female</Radio>
									</RadioGroup>
									<DatePicker
										isReadOnly={isSubmitting}
										isInvalid={touched.contact && !!errors.contact}
										errorMessage={touched.contact && errors.contact}
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
												name="barangay"
												label="Select Barangay"
												onSelectionChange={(value) => {
													setFieldValue("barangay", value);
												}}
												onBlur={handleBlur}
												errorMessage={touched.street && errors.street}
												fullWidth
												isInvalid={
													(touched.city && !values.city) ||
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
										<div className="flex justify-between">
											<p>Security</p>
											<Button className="" variant="light" size="sm">
												Generate password
											</Button>
										</div>
										<Input
											isReadOnly={isSubmitting}
											isInvalid={touched.schoolName && !!errors.schoolName}
											errorMessage={touched.schoolName && errors.schoolName}
											label="Password"
										/>
									</div>
									<RadioGroup
										label="Role"
										className="lg:col-span-6 "
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
										<Button className="min-w-full md:min-w-[60%] bg-[#A6F3B2]">
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
