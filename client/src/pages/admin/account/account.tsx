import * as yup from "yup";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import { Divider } from "@heroui/divider";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Formik } from "formik";
import { formatDate } from "date-fns";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { DatePicker } from "@heroui/date-picker";
import {
	DateValue,
	getLocalTimeZone,
	parseAbsoluteToLocal,
	parseDate,
} from "@internationalized/date";
import { Radio, RadioGroup } from "@heroui/radio";
import { useDateFormatter } from "@react-aria/i18n";
import { useAtom } from "jotai";

import places from "../../../../places.json";

import { UPDATE_SYSTEM_USER_MUTATION } from "@/queries";
import { systemUserAtom } from "@/states";

const formSchema = yup.object({
	firstName: yup.string().required(),
	lastName: yup.string().required(),
	middleName: yup.string(),
	city: yup.string().required(),
	street: yup.string().required(),
	phoneNumber: yup
		.string()
		.matches(/^9\d{9}$/, "Phone Number must start with 9 and be 10 digits long")
		.required("Phone Number is required"),
	birthDate: yup.string().required("Birth Date is required"),
	gender: yup.string().required("Gender is required"),
});

export default function StudentProfile() {
	const [isEditing, setIsEditing] = useState(false);
	const [systemUser, setSystemUser] = useAtom(systemUserAtom);

	const [value, setValue] = useState<DateValue | null>(
		parseDate(
			formatDate(
				parseAbsoluteToLocal(
					new Date(systemUser?.birthDate!).toISOString()
				).toDate(),
				"yyyy-MM-dd"
			)
		)
	);

	let formatter = useDateFormatter({ dateStyle: "full" });

	const [brgys, setBrgys] = useState<string[]>([]);
	const [handleUpdate] = useMutation(UPDATE_SYSTEM_USER_MUTATION);

	const citiesMunicipalities = useMemo(
		() => places.map((place) => place.name),
		[]
	);

	useEffect(() => {
		if (systemUser?.address.city) {
			const brgys =
				places
					.find((place) => place.name === systemUser.address.city)
					?.barangays.flat() ?? [];

			setBrgys(brgys);
		}
	}, []);

	const handleEditInfo = async (values: yup.InferType<typeof formSchema>) => {
		try {
			const { data } = await handleUpdate({
				variables: {
					values: {
						id: String(systemUser?.id),
						firstName: values.firstName,
						middleName: values.middleName,
						lastName: values.lastName,
						phoneNumber: values.phoneNumber,
						address: {
							city: values.city,
							street: values.street,
						},
						birthDate: value?.toDate(getLocalTimeZone()).toISOString(),
						gender: values.gender,
					},
				},
			});

			setSystemUser(data.updateSystemUser);
			toast.success("Account updated successfully!", {
				description: "Your account information has been updated.",
				position: "top-center",
				richColors: true,
			});
			setIsEditing(false);
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
		<Formik
			validationSchema={formSchema}
			enableReinitialize
			initialValues={{
				firstName: systemUser?.firstName ?? "",
				city: systemUser?.address?.city ?? "",
				lastName: systemUser?.lastName ?? "",
				middleName: systemUser?.middleName ?? "",
				birthDate: new Date(systemUser?.birthDate || new Date()).toISOString(),
				// bday!
				// ? formatDate(new Date(bday).toISOString(), "yyyy-MM-dd")
				// : formatDate(new Date().toISOString(), "yyyy-MM-dd"),
				phoneNumber: systemUser?.phoneNumber ?? "",
				street: systemUser?.address?.street ?? "",
				gender: systemUser?.gender ?? "MALE",
			}}
			onSubmit={handleEditInfo}>
			{({
				values,
				setFieldValue,
				handleChange,
				handleBlur,
				touched,
				handleSubmit,
				handleReset,
				isSubmitting,
				errors,
			}) => {
				return (
					<div className="container mx-auto  max-w-3xl py-8 space-y-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold tracking-tight">Profile</h1>
								<p className="text-muted-foreground">
									Manage your personal information and preferences
								</p>
							</div>
							<div className="space-y-2 md:space-y-0  md:space-x-2">
								<Button
									color={isEditing ? "danger" : "primary"}
									className="w-full md:w-fit"
									onPress={() => {
										handleReset();
										setIsEditing((prev) => !prev);
									}}>
									{isEditing ? "Cancel" : "Edit Profile"}
								</Button>
								{isEditing && (
									<Button
										color="primary"
										className="w-full md:w-fit text-white"
										type="submit"
										onPress={() => handleSubmit()}>
										Save Changes
									</Button>
								)}
							</div>
						</div>

						<div className="space-y-6">
							{/* Personal Information */}
							<Card>
								<CardHeader className="px-6 pt-4">
									<h1 className="flex items-center gap-2">
										<Icon
											icon="solar:info-square-broken"
											width="24"
											height="24"
										/>
										Personal Information
									</h1>
								</CardHeader>
								<Divider />
								<CardBody className="p-6 space-y-4">
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												First Name
											</p>
											{isEditing ? (
												<Input
													type="text"
													name="firstName"
													isReadOnly={isSubmitting}
													value={values.firstName}
													variant="flat"
													radius="sm"
													onChange={handleChange}
													onBlur={handleBlur}
													isInvalid={!!touched.firstName && !!errors.firstName}
													errorMessage={touched.firstName && errors.firstName}
												/>
											) : (
												<p className="font-medium">{values.firstName}</p>
											)}
										</div>
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												Last Name
											</p>
											{isEditing ? (
												<Input
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
											) : (
												<p className="font-medium">{values.lastName}</p>
											)}
										</div>
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												Middle Name
											</p>
											{isEditing ? (
												<Input
													type="text"
													name="middleName"
													isReadOnly={isSubmitting}
													value={values.middleName}
													variant="flat"
													radius="sm"
													onChange={handleChange}
													onBlur={handleBlur}
													isInvalid={
														!!touched.middleName && !!errors.middleName
													}
													errorMessage={touched.middleName && errors.middleName}
												/>
											) : (
												<p
													className={`${!values?.middleName?.trim() ? "italic text-gray-500" : "font-medium"}`}>
													{values.middleName || "No data"}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												Gender
											</p>
											{isEditing ? (
												<div className="h-[calc(100%-40%)]  flex items-center">
													<RadioGroup
														className="flex justify-start items-center   "
														name="gender"
														isReadOnly={isSubmitting}
														isInvalid={touched.gender && !!errors.gender}
														errorMessage={String(errors.gender)}
														value={values.gender}
														onBlur={handleBlur}
														onChange={handleChange}
														orientation="horizontal">
														<Radio value="MALE">Male</Radio>
														<Radio value="FEMALE">Female</Radio>
													</RadioGroup>
												</div>
											) : (
												<p className="font-medium capitalize">
													{values.gender.toLowerCase()}
												</p>
											)}
										</div>
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												Birth Date
											</p>
											{isEditing ? (
												<>
													<DatePicker
														// @ts-ignore
														value={value}
														onChange={setValue}
													/>
													<p className="text-default-500 text-sm">
														Selected date:{" "}
														{value
															? formatter.format(
																	value.toDate(getLocalTimeZone())
																)
															: "--"}
													</p>
												</>
											) : (
												<p className="font-medium">
													{formatDate(values.birthDate, "MMMM dd, yyyy")}
												</p>
											)}
										</div>
									</div>
								</CardBody>
							</Card>

							{/* Contact Information */}
							<Card>
								<CardHeader className="px-6 pt-4">
									<h1 className="flex items-center gap-2">
										<Icon
											icon="solar:phone-rounded-broken"
											width="24"
											height="24"
										/>
										Contact Information
									</h1>
								</CardHeader>
								<Divider />
								<CardBody className="p-6 space-y-4">
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												Email
											</p>
											<p className="font-medium">{systemUser?.email}</p>
										</div>
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												Phone Number
											</p>
											{isEditing ? (
												<Input
													startContent={
														<span className="text-sm text-gray-500">+63</span>
													}
													name="phoneNumber"
													isReadOnly={isSubmitting}
													value={values.phoneNumber}
													variant="flat"
													radius="sm"
													onChange={handleChange}
													onBlur={handleBlur}
													isInvalid={
														!!touched.phoneNumber && !!errors.phoneNumber
													}
													errorMessage={
														touched.phoneNumber && errors.phoneNumber
													}
												/>
											) : (
												<p className="font-medium">+63 {values.phoneNumber}</p>
											)}
										</div>
									</div>
								</CardBody>
							</Card>

							{/* Address */}
							<Card>
								<CardHeader className="px-6 pt-4">
									<h1 className="flex items-center gap-2">
										<Icon
											icon="solar:point-on-map-broken"
											width="24"
											height="24"
										/>
										Address
									</h1>
								</CardHeader>
								<Divider />
								<CardBody className="p-6 space-y-4">
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												City / Municipality
											</p>
											{isEditing ? (
												<Suspense
													fallback={
														<Input
															fullWidth
															readOnly
															label="Select City / Municipality"
														/>
													}>
													<Autocomplete
														inputProps={{
															size: "sm",
														}}
														name="city"
														defaultInputValue={values.city}
														label="Select City / Municipality"
														// isInvalid={!!touched.city && !!errors.city}
														onSelectionChange={(value) => {
															// setFieldValue("city", value);
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
												</Suspense>
											) : (
												<p className="font-medium">{values.city}</p>
											)}
										</div>
										<div className="space-y-2">
											<p className="text-sm font-medium text-muted-foreground">
												Street
											</p>
											{isEditing ? (
												<Suspense
													fallback={
														<Input
															fullWidth
															readOnly
															label="Select City / Municipality"
														/>
													}>
													<Autocomplete
														inputProps={{
															size: "sm",
														}}
														name="barangay"
														label="Select Barangay"
														onSelectionChange={(value) => {
															setFieldValue("street", value);
														}}
														onBlur={handleBlur}
														defaultInputValue={values.street}
														errorMessage={touched.street && errors.street}
														fullWidth
														isInvalid={!!touched.street && !!errors.street}
														value={values.street}>
														{brgys.map((brgy) => (
															<AutocompleteItem
																key={brgy}
																value={brgy}
																className="capitalize">
																{brgy}
															</AutocompleteItem>
														))}
													</Autocomplete>
												</Suspense>
											) : (
												<p className="font-medium">{values.city}</p>
											)}
										</div>
									</div>
								</CardBody>
							</Card>

							{isEditing && (
								<div className="flex justify-end gap-2">
									<Button color="danger" onPress={() => setIsEditing(false)}>
										Cancel
									</Button>
									<Button
										color="primary"
										type="submit"
										onPress={() => handleSubmit()}>
										Save Changes
									</Button>
								</div>
							)}
						</div>
					</div>
				);
			}}
		</Formik>
	);
}
