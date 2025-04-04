import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Form, Formik } from "formik";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { DatePicker } from "@heroui/date-picker";
import {
	DateValue,
	getLocalTimeZone,
	parseAbsoluteToLocal,
	parseDate,
	Time,
	today,
} from "@internationalized/date";
import { TimeInput, TimeInputValue } from "@heroui/date-input";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { formatDate } from "date-fns";

import { AddMeetingSchema } from "@/definitions";
import { AddMeetingSchemaData, Meeting } from "@/types";
import {
	CREATE_MEETING_MUTATION,
	READ_MEETINGS_QUERY,
	UPDATE_MEETING_MUTATION,
} from "@/queries";

interface MeetingFormProps {
	edit?: boolean;
	defaultValues?: Meeting;
}

export default function MeetingForm({ edit, defaultValues }: MeetingFormProps) {
	let [startTime, setStartTime] = useState<TimeInputValue | null>(
		defaultValues ? parseAbsoluteToLocal(defaultValues.startTime) : null
	);
	let [endTime, setEndTime] = useState<TimeInputValue | null>(
		defaultValues ? parseAbsoluteToLocal(defaultValues.endTime) : null
	);
	const [upsertMeeting] = useMutation(
		edit ? UPDATE_MEETING_MUTATION : CREATE_MEETING_MUTATION
	);
	const [date, setDate] = useState<DateValue | null>(
		defaultValues
			? parseDate(
					formatDate(
						parseAbsoluteToLocal(
							new Date(defaultValues.date).toISOString()
						).toDate(),
						"yyyy-MM-dd"
					)
				)
			: null
	);

	/* const { data } = useQuery<{ meetings: PaginationResult<Meeting> }>(
		READ_MEETINGS_QUERY
	); */

	/* 	const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
		defaultValues
			? {
					start: parseDate(
						formatDate(
							parseAbsoluteToLocal(
								new Date(defaultValues?.startDate || new Date()).toISOString()
							).toDate(),
							"yyyy-MM-dd"
						)
					),
					end: parseDate(
						formatDate(
							parseAbsoluteToLocal(
								new Date(defaultValues?.endDate || new Date()).toISOString()
							).toDate(),
							"yyyy-MM-dd"
						)
					),
				}
			: null
	); */

	const navigate = useNavigate();

	/* const disabledRanges = (data?.meetings.data || []).map((meeting: Meeting) => {
		const startDate = parseDate(
			formatDate(
				parseAbsoluteToLocal(new Date(meeting.startDate).toISOString()).toDate(),
				"yyyy-MM-dd"
			)
		);
		const endDate = parseDate(
			formatDate(
				parseAbsoluteToLocal(new Date(meeting.endDate).toISOString()).toDate(),
				"yyyy-MM-dd"
			)
		);

		return [startDate, endDate];
	}); */

	return (
		<Card className="rounded-md shadow-md mb-10 ">
			<CardHeader className="flex rounded-none bg-[#A6F3B2] flex-col items-start">
				<h1 className="text-2xl">{edit ? "Edit" : "Create New"} Meeting</h1>
				<p>
					{edit
						? "Edit the details of the meeting."
						: "Fill in the details to create a new meeting and manage its settings."}
				</p>
			</CardHeader>
			<CardBody className="bg-[#A6F3B235]">
				<div className="lg:max-w-[80%] w-full mx-auto my-5">
					<Formik
						validationSchema={AddMeetingSchema}
						initialValues={
							{
								title: defaultValues?.title || "",
								location: defaultValues?.location || "",
								description: defaultValues?.description || "",
								date: defaultValues ? defaultValues.date : "",
								startTime: defaultValues?.startTime || "",
								endTime: defaultValues?.endTime || "",
							} as AddMeetingSchemaData
						}
						onSubmit={async (values: AddMeetingSchemaData, helpers) => {
							try {
								const variables = {
									...values,
									id: defaultValues ? defaultValues.id : "no-id",
								};

								await upsertMeeting({
									variables,
									refetchQueries: [READ_MEETINGS_QUERY],
								});

								navigate("/admin/meetings");

								helpers.resetForm({
									values: {
										description: "",
										endTime: "",
										location: "",
										date: "",
										startTime: "",
										title: "",
									},
								});

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
							return (
								<Form
									className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-6"
									onSubmit={handleSubmit}>
									<div className="lg:col-span-6">Meeting Information</div>
									<Input
										isReadOnly={isSubmitting}
										value={values.title}
										isInvalid={touched.title && !!errors.title}
										errorMessage={errors.title}
										onBlur={handleBlur}
										onChange={handleChange}
										className="lg:col-span-6"
										name="title"
										label="Meeting Name"
									/>

									<Textarea
										isReadOnly={isSubmitting}
										isInvalid={touched.description && !!errors.description}
										errorMessage={errors.description}
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.description}
										onValueChange={handleChange}
										className="lg:col-span-6 "
										name="description"
										label="Meeting Description"
									/>

									<DatePicker
										showMonthAndYearPickers
										isReadOnly={isSubmitting}
										isInvalid={touched.date && !!errors.date}
										errorMessage={String(errors.date)}
										onBlur={handleBlur}
										onChange={(e) => {
											if (e === null) return;
											const dateValue: {
												year: number;
												month: number;
												day: number;
											} = e;

											const date = dateValue
												? new Date(
														dateValue.year,
														dateValue.month - 1,
														dateValue.day
													)
												: null;

											setDate(e);
											setFieldValue("date", date?.toISOString());
										}}
										// @ts-ignore
										value={date}
										className="lg:col-span-6"
										label="Date"
										minValue={today(getLocalTimeZone())}
									/>

									<TimeInput
										name="startTime"
										value={startTime}
										onChange={(time) => {
											if (!time) return;
											setStartTime(time);
											const value = new Date(
												new Date().setHours(time.hour, Number(time.minute))
											).toISOString();

											setFieldValue("startTime", value);
										}}
										isInvalid={touched.startTime && !!errors.startTime}
										errorMessage={errors.startTime}
										className="h-full lg:col-span-3"
										size="lg"
									/>

									<TimeInput
										size="lg"
										name="endTime"
										isInvalid={touched.endTime && !!errors.endTime}
										errorMessage={errors.endTime}
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
										value={values.location}
										className="lg:col-span-6"
										name="location"
										label="Meeting Location"
									/>

									<div className="lg:col-span-6 flex justify-center mt-5">
										<Button
											type="submit"
											isDisabled={!isValid || isSubmitting}
											isLoading={isSubmitting}
											className="min-w-full md:min-w-[60%] bg-[#A6F3B2]">
											{edit ? "Update" : "Create"} Meeting
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
