import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Form, Formik } from "formik";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { DatePicker, DateRangePicker } from "@heroui/date-picker";
import { getLocalTimeZone, Time, today } from "@internationalized/date";
import { TimeInput, TimeInputValue } from "@heroui/date-input";
import { useState } from "react";

import { AddMeetingSchema } from "@/definitions";
import { AddEventSchemaData } from "@/types";

interface EventFormProps {
	edit?: boolean;
	defaultValue?: any;
}

export default function EventForm({ edit }: EventFormProps) {
	let [startTime, setStartTime] = useState<TimeInputValue | null>();
	let [endTime, setEndTime] = useState<TimeInputValue | null>(null);

	// let formatter = useDateFormatter({ dateStyle: "short", timeStyle: "long" });

	return (
		<Card className="rounded-md shadow-md mb-10 ">
			<CardHeader className="flex rounded-none bg-[#A6F3B2] flex-col items-start">
				<h1 className="text-2xl">Create New Meeting</h1>
				<p>
					Fill in the details to create a new meeting and manage its settings.
				</p>
			</CardHeader>
			<CardBody className="bg-[#A6F3B235]">
				<div className="lg:max-w-[80%] w-full mx-auto my-5">
					<Formik
						validationSchema={AddMeetingSchema}
						initialValues={{} as AddEventSchemaData}
						onSubmit={async (values: AddEventSchemaData, helpers) => {
							try {
								helpers.resetForm();

								toast.success(
									edit
										? "Meeting updated successfully"
										: "Meeting created successfully",
									{
										description: edit
											? "The meeting has been updated successfully."
											: "The new meeting has been created.",
										richColors: true,
										position: "top-center",
									}
								);
							} catch (err) {
								toast.error(
									edit
										? "Failed to update meeting"
										: "Failed to create meeting",
									{
										description: edit
											? "There was an error updating the meeting. Please try again."
											: "There was an error creating the meeting. Please try again.",
										richColors: true,
										position: "top-center",
									}
								);
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
							isValid,
							isSubmitting,
						}) => {
							console.log(errors, "qqq");

							return (
								<Form
									className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-6"
									onSubmit={handleSubmit}>
									<div className="lg:col-span-6">Event Information</div>
									<Input
										isReadOnly={isSubmitting}
										value={values.title}
										isInvalid={touched.title && !!errors.title}
										errorMessage={errors.title}
										onBlur={handleBlur}
										onChange={handleChange}
										className="lg:col-span-6"
										name="title"
										label="Event Name"
									/>

									<Textarea
										isReadOnly={isSubmitting}
										isInvalid={touched.description && !!errors.description}
										errorMessage={errors.description}
										onBlur={handleBlur}
										onValueChange={handleChange}
										className="lg:col-span-6 "
										name="description"
										label="Event Description"
									/>

									<DatePicker
										showMonthAndYearPickers
										isReadOnly={isSubmitting}
										isInvalid={touched.startDate && !!errors.startDate}
										errorMessage={String(errors.startDate)}
										onBlur={handleBlur}
										onChange={(e) => {
											if (e === null) return;
											const dateValue: {
												year: number;
												month: number;
												day: number;
											} = e;
											// console.log(parseAbsoluteToLocal, "qqqdate");

											const startDate = dateValue
												? new Date(
														dateValue.year,
														dateValue.month - 1,
														dateValue.day
													)
												: null;

											setFieldValue("startDate", startDate?.toISOString());
										}}
										className="lg:col-span-6"
										label="Date"
										minValue={today(getLocalTimeZone())}
									/>

									<TimeInput
										name="startTime"
										// onChange={(e) => {
										// 	if (!e) return;

										// 	const time = new Date(
										// 		new Date().setHours(e.hour, Number(e.minute))
										// 	).toISOString();

										// 	// const time = parseAbsoluteToLocal(
										// 	// 	"2025-03-25T18:03:54.068Z"
										// 	// );
										// 	setFieldValue("startTime", time);
										// }}

										value={startTime}
										onChange={(time) => {
											if (!time) return;
											setStartTime(time);
											const value = new Date(
												new Date().setHours(time.hour, Number(time.minute))
											).toISOString();

											setFieldValue("startTime", value);
										}}
										className="h-full lg:col-span-3"
										size="lg"
									/>

									<TimeInput
										size="lg"
										name="endTime"
										minValue={new Time(startTime?.hour)}
										className="h-full lg:col-span-3"
										onBlur={handleBlur}
										value={endTime}
										onChange={(time) => {
											if (!time) return;
											setEndTime(time);
											const value = new Date(
												new Date().setHours(time.hour, Number(time.minute))
											).toISOString();

											setFieldValue("endTime", value);
										}}
									/>

									<Input
										isReadOnly={isSubmitting}
										isInvalid={touched.location && !!errors.location}
										errorMessage={errors.location}
										onBlur={handleBlur}
										onChange={handleChange}
										className="lg:col-span-6"
										name="location"
										label="Event Location"
									/>

									<div className="lg:col-span-6 flex justify-center mt-5">
										<Button
											type="submit"
											isDisabled={!isValid || isSubmitting}
											isLoading={isSubmitting}
											className="min-w-full md:min-w-[60%] bg-[#A6F3B2]">
											Create Meeting
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
