import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import * as yup from "yup";
import { useFormik } from "formik";
import { Suspense } from "react";
import { Input } from "@heroui/input";
import {
	Autocomplete,
	AutocompleteItem,
	AutocompleteSection,
} from "@heroui/autocomplete";
import { Chip } from "@heroui/chip";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Alert } from "@heroui/alert";

import degrees from "../../../../../../degrees.json";

import { Student } from "@/types";
import { semester as semesterArray, yearLevels } from "@/lib/constant";
import {
	CREATE_SCHOLAR_NOTIFICATION_MUTATION,
	READ_SCHOLAR_SEMESTER_DOCUMENTS_QUERY,
	READ_STUDENT_QUERY,
	UPDATE_STUDENT_MUTATION,
} from "@/queries";

const AcademicFormSchema = yup.object({
	course: yup.string().required("Course is required"),
	yearLevel: yup.string().required("Year Level is required"),
	semester: yup.string().required("Semester is required"),
	status: yup.string().required("Status is required"),
});

interface EditModalProps {
	scholar: Student;
	semester: number;
	yearLevel: number;
}

export default function EditModal({
	scholar,
	semester,
	yearLevel,
}: EditModalProps) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const formik = useFormik({
		onSubmit: () => {},
		initialValues: {
			course: scholar.course,
			yearLevel: yearLevel.toString(),
			semester: semester,
			status: scholar.status,
		},
		validationSchema: AcademicFormSchema,
	});

	const [updateStudent, { loading: updating }] = useMutation(
		UPDATE_STUDENT_MUTATION
	);
	const [sendNotif, { loading }] = useMutation(
		CREATE_SCHOLAR_NOTIFICATION_MUTATION
	);

	const handleUpdate = async () => {
		try {
			let variables = {};

			if (formik.values.status !== "SCHOLAR") {
				variables = {
					status: formik.values.status,
				};
			} else {
				variables = {
					yearLevel: Number(formik.values.yearLevel),
					semester: Number(semester),
					course: formik.values.course,
				};
			}

			await updateStudent({
				variables: { ...variables, id: scholar.id },
				refetchQueries: [
					READ_SCHOLAR_SEMESTER_DOCUMENTS_QUERY,
					READ_STUDENT_QUERY,
				],
			});
			await sendNotif({
				variables: {
					title: "Scholar Academic Record Update",
					type: "OTHER",
					link: "/account#academic-information",
					message:
						"Your academic records have been formally updated in accordance with the qualification standards.",
					receiverId: scholar.id,
				},
			});

			onClose();

			toast.success("Scholar updated", {
				description: "Scholar is updated",
				richColors: true,
				position: "top-center",
			});
		} catch {
			toast.error("Something went wrong!", {
				description: "Please try again later.",
				richColors: true,
				position: "top-center",
			});
		}
	};

	return (
		<>
			<Button
				onPress={onOpen}
				fullWidth
				className="text-white md:ml-auto md:max-w-[300px]"
				color="success">
				Edit Scholar
			</Button>
			<Modal
				isDismissable={false}
				backdrop="opaque"
				classNames={{
					closeButton: "hidden",
					backdrop:
						"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
				}}
				isOpen={isOpen}
				onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h1>Scholar Qualification Verification</h1>
								<p className="text-sm font-normal">
									This form confirms that the scholar meets the necessary
									requirements for advancement to the{" "}
									<Chip size="sm" className="">
										{yearLevels[yearLevel - 1].toLowerCase()}
									</Chip>{" "}
									level and{" "}
									<Chip size="sm">
										{semesterArray[semester - 1].toLowerCase()}
									</Chip>
									.
								</p>
							</ModalHeader>
							<ModalBody>
								<Select
									className=""
									label="Status"
									name="status"
									size="sm"
									isDisabled={formik.isSubmitting || loading || updating}
									errorMessage={formik.touched.status && formik.errors.status}
									onBlur={formik.handleBlur}
									isInvalid={!!formik.touched.status && !!formik.errors.status}
									selectedKeys={[formik.values.status]}
									onChange={(v) => {
										formik.setFieldValue("status", v.target.value.toString());
									}}>
									{["SCHOLAR", "DISQUALIFIED"].map((stat) => (
										<SelectItem key={stat} textValue={stat}>
											{stat}
										</SelectItem>
									))}
								</Select>
								{/* <Select
									className=""
									label="Select Year Level"
									name="yearLevel"
									size="sm"
									isDisabled={formik.isSubmitting || loading || updating}
									errorMessage={
										formik.touched.yearLevel && formik.errors.yearLevel
									}
									onBlur={formik.handleBlur}
									isInvalid={
										!!formik.touched.yearLevel && !!formik.errors.yearLevel
									}
									selectedKeys={[formik.values.yearLevel]}
									onChange={(v) => {
										formik.setFieldValue(
											"yearLevel",
											v.target.value.toString()
										);
									}}>
									{years.map((year, index) => (
										<SelectItem
											isDisabled={index + 1 < Number(yearLevel)}
											key={year.value.toString()}
											textValue={year.label}>
											{year.label}{" "}
											{year.optional && "(If Applicable to your program)"}
										</SelectItem>
									))}
								</Select> */}

								<Input
									label="Year Level"
									value={yearLevels[yearLevel - 1]}
									isReadOnly
								/>

								<Suspense
									fallback={<Input fullWidth readOnly label="Course" />}>
									<Autocomplete
										isDisabled={formik.isSubmitting || loading || updating}
										name="course"
										className="lg:col-span-6"
										label="Course"
										onSelectionChange={(value) => {
											formik.setFieldValue("course", value?.toString());
										}}
										selectedKey={formik.values.course}
										onBlur={formik.handleBlur}
										isClearable={false}
										errorMessage={formik.errors.course}
										fullWidth
										isInvalid={formik.touched.course && !!formik.errors.course}
										value={formik.values.course}>
										{degrees.map((degree, indx) => (
											<AutocompleteSection
												showDivider
												title={degree.category}
												key={indx}>
												{degree.programs.map((program) => (
													<AutocompleteItem
														key={program}
														value={program}
														className="capitalize">
														{program}
													</AutocompleteItem>
												))}
											</AutocompleteSection>
										))}
									</Autocomplete>
								</Suspense>

								<Input
									label="Semester"
									value={semesterArray[semester - 1]}
									isReadOnly
								/>

								{/* <Select
									className=""
									label="Semester"
                                    name="semester"
                                    
									isDisabled={formik.isSubmitting || loading || updating}
									size="sm"
									errorMessage={
										formik.touched.semester && formik.errors.semester
									}
									onBlur={formik.handleBlur}
									isInvalid={
										!!formik.touched.semester && !!formik.errors.semester
									}
									selectedKeys={[semesterArray[formik.values.semester - 1]]}
									onChange={(v) => {
										formik.setFieldValue("semester", v.target.value.toString());
                                    }}
                                    
                                >
									{semesterArray.map((semester) => (
										<SelectItem key={semester.toString()} textValue={semester}>
											{semester}
										</SelectItem>
									))}
								</Select> */}
								<Alert
									title="Attention"
									color="warning"
									description="Admin must verify or double check the data before submitting."
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
									isDisabled={formik.isSubmitting || loading || updating}>
									Close
								</Button>
								<Button
									color="primary"
									onPress={handleUpdate}
									isLoading={formik.isSubmitting || loading || updating}>
									Submit
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
