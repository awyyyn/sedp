import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import * as yup from "yup";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormik } from "formik";
import { Divider } from "@heroui/divider";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Radio, RadioGroup } from "@heroui/radio";

import { months } from "@/lib/constant";
import { formatCurrency, getDocsTotalAmount } from "@/lib/utils";
import {
	CREATE_ALLOWANCE_MUTATION,
	READ_SCHOLAR_DOCUMENTS_QUERY,
} from "@/queries";
import { Document, Student } from "@/types";

interface GenerateAllowanceProps {
	scholar: Student;
	year: number;
	month: number;
	isOpen: boolean;
	documents: Document[];
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const GenerateAllowanceSchema = yup.object({
	monthlyAllowance: yup
		.number()
		.typeError("Invalid Amount")
		.required("Monthly allowance is required"),
	bookAllowance: yup.number().typeError("Invalid Amount").optional(),
	miscellaneousAllowance: yup
		.number()
		.typeError("Invalid Amount")
		.optional()
		.min(0, "Miscellaneous allowance must be greater than 0"),
	thesisAllowance: yup
		.number()
		.typeError("Invalid Amount")
		.optional()
		.min(0, "Thesis allowance must be greater than 0"),
	docs: yup.array().of(
		yup.object().shape({
			category: yup.string().required("Category type is required"),
			amount: yup.number().required("Amount is required"),
		})
	),
	semester: yup.string(),
});

export default function GenerateAllowance({
	month,
	scholar,
	year,
	isOpen,
	onOpenChange,
	documents,
}: GenerateAllowanceProps) {
	const [toReview, setToReview] = useState(false);
	const [generateAllowance] = useMutation(CREATE_ALLOWANCE_MUTATION);

	const formik = useFormik({
		validationSchema: GenerateAllowanceSchema,
		initialValues: {
			semester: "1",
			docs: documents.map((doc) => ({
				category: "",
				amount: doc.amount,
			})),
		} as yup.InferType<typeof GenerateAllowanceSchema>,
		onSubmit: async () => {
			if (!toReview) return setToReview(true);

			try {
				await generateAllowance({
					refetchQueries: [READ_SCHOLAR_DOCUMENTS_QUERY],
					variables: {
						studentId: scholar.id,
						yearLevel: scholar.yearLevel,
						year,
						month,
						semester: Number(formik.values.semester || 0),
						monthlyAllowance: Number(formik.values.monthlyAllowance || 0),
						bookAllowance:
							Number(formik.values.bookAllowance || 0) +
								getDocsTotalAmount(formik.values.docs || [], "BOOK_ALLOWANCE") >
							2000
								? 2000
								: Number(formik.values.bookAllowance || 0) +
									getDocsTotalAmount(
										formik.values.docs || [],
										"BOOK_ALLOWANCE"
									),
						miscellaneousAllowance:
							Number(formik.values.miscellaneousAllowance || 0) +
							getDocsTotalAmount(
								formik.values.docs || [],
								"MISCELLANEOUS_ALLOWANCE"
							),
						thesisAllowance: Number(formik.values.thesisAllowance || 0),
					},
				});

				setToReview(false);
				onOpenChange(false);
				toast.success("Allowance Created Successfully", {
					description: "Allowance has been generated successfully.",
					position: "top-center",
					richColors: true,
				});
			} catch {
				toast.error("Failed to generate allowance", {
					description: "Please try again later.",
					position: "top-center",
					richColors: true,
				});
			}
		},
	});

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			size="2xl"
			onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex px-3 flex-col gap-1">
							<h1>Generate Allowance for {months[month - 1]}</h1>
							<p className="text-sm text-gray-500 font-normal">
								Are you sure you want to generate allowance for{" "}
								{months[month - 1]} {year}?
							</p>
						</ModalHeader>
						<ModalBody className="p-0 grid grid-cols-2 px-4">
							<Input
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isReadOnly={toReview || formik.isSubmitting}
								isInvalid={!!formik.errors.monthlyAllowance}
								errorMessage={formik.errors.monthlyAllowance}
								name="monthlyAllowance"
								value={formik.values.monthlyAllowance?.toString()}
								label="Monthly Allowance"
								className="col-span-2 md:col-span-1"
							/>
							{toReview ? (
								<>
									<Input
										isReadOnly
										value={formatCurrency(
											getDocsTotalAmount(
												formik.values.docs || [],
												"BOOK_ALLOWANCE"
											) +
												Number(formik.values.bookAllowance || 0) >
												2000
												? 2000
												: getDocsTotalAmount(
														formik.values.docs || [],
														"BOOK_ALLOWANCE"
													) + Number(formik.values.bookAllowance || 0)
										)}
										label="Book Allowance"
										className="col-span-2 md:col-span-1"
									/>
								</>
							) : (
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									isReadOnly={formik.isSubmitting}
									description={`Total amount: ${formatCurrency(
										getDocsTotalAmount(
											formik.values.docs || [],
											"BOOK_ALLOWANCE"
										) + Number(formik.values.bookAllowance || 0)
									)}`}
									isInvalid={!!formik.errors.bookAllowance}
									errorMessage={formik.errors.bookAllowance}
									name="bookAllowance"
									value={formik.values.bookAllowance?.toString()}
									label="Book Allowance"
									className="col-span-2 md:col-span-1"
								/>
							)}
							<Input
								isReadOnly={formik.isSubmitting}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isInvalid={!!formik.errors.thesisAllowance}
								errorMessage={formik.errors.thesisAllowance}
								name="thesisAllowance"
								value={formik.values.thesisAllowance?.toString()}
								label="Thesis Allowance"
								className="col-span-2 md:col-span-1"
							/>
							{toReview ? (
								<>
									<Input
										isReadOnly
										value={formatCurrency(
											getDocsTotalAmount(
												formik.values.docs || [],
												"MISCELLANEOUS_ALLOWANCE"
											) + Number(formik.values.miscellaneousAllowance || 0)
										)}
										label="Miscellaneous Allowance"
										className="col-span-2 md:col-span-1"
									/>
								</>
							) : (
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									isReadOnly={toReview || formik.isSubmitting}
									isInvalid={!!formik.errors.miscellaneousAllowance}
									errorMessage={formik.errors.miscellaneousAllowance}
									name="miscellaneousAllowance"
									description={`Total amount: ${formatCurrency(
										getDocsTotalAmount(
											formik.values.docs || [],
											"MISCELLANEOUS_ALLOWANCE"
										) + Number(formik.values.miscellaneousAllowance || 0)
									)}`}
									value={formik.values.miscellaneousAllowance?.toString()}
									label="Miscellaneous Allowance"
									className="col-span-2 md:col-span-1"
								/>
							)}

							<RadioGroup
								isReadOnly={toReview || formik.isSubmitting}
								label="Semester"
								value={formik.values.semester}
								name="semester"
								onValueChange={(value) =>
									formik.setFieldValue("semester", value)
								}
								onBlur={formik.handleBlur}
								orientation="horizontal">
								<Radio type="button" value="1">
									1st Sen
								</Radio>
								<Radio type="button" value="2">
									2nd Sem
								</Radio>
								<Radio value="3" type="button">
									3rd Sem
								</Radio>
							</RadioGroup>

							{!toReview && documents.length > 0 && (
								<>
									<Divider className="col-span-2 mt-3" />
									<div className="col-span-2 space-y-3">
										<h1 className="text-sm">Receipts: </h1>
										{documents.map((doc, index) => {
											const isError = (
												formik.errors.docs?.[index] as { category?: string }
											)?.category;

											return (
												<div className="grid grid-cols-2 gap-2" key={doc.id}>
													<Select
														disallowEmptySelection
														label={doc.documentName}
														name={`doc-${doc.id}`}
														isInvalid={!!isError}
														errorMessage={isError}
														selectedKeys={[
															(formik.values.docs as any)[index].category,
														]}
														selectionMode="single"
														onSelectionChange={(value) => {
															formik.setFieldValue(
																`docs[${index}].category`,
																Array.from(value)[0]
															);
														}}
														classNames={{
															value: "capitalize",
														}}>
														{["BOOK_ALLOWANCE", "MISCELLANEOUS_ALLOWANCE"].map(
															(option) => (
																<SelectItem key={option} className="capitalize">
																	{option.replace(/_/g, " ").toLowerCase()}
																</SelectItem>
															)
														)}
													</Select>
													<Input
														label="Amount"
														readOnly
														value={formatCurrency(doc.amount)}
													/>
												</div>
											);
										})}
									</div>
								</>
							)}

							{toReview && (
								<div className="col-span-2 space-y-3 flex justify-between items-center">
									<h1 className="text-sm">Total Amount:</h1>
									<h1 className="text-2xl font-bold">
										{formatCurrency(
											Number(formik.values.monthlyAllowance || 0) +
												Number(formik.values.miscellaneousAllowance || 0) +
												Number(formik.values.thesisAllowance || 0) +
												// Number(formik.values.bookAllowance || 0) +
												// getDocsTotalAmount(
												// 	formik.values.docs || [],
												// 	"MISCELLANEOUS_ALLOWANCE"
												// ) +
												(getDocsTotalAmount(
													formik.values.docs || [],
													"BOOK_ALLOWANCE"
												) +
													Number(formik.values.bookAllowance || 0) >
												2000
													? 2000
													: getDocsTotalAmount(
															formik.values.docs || [],
															"BOOK_ALLOWANCE"
														) + Number(formik.values.bookAllowance || 0)) +
												getDocsTotalAmount(
													formik.values.docs || [],
													"MISCELLANEOUS_ALLOWANCE"
												)
										)}
									</h1>
								</div>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								isDisabled={formik.isSubmitting}
								onPress={() => {
									if (toReview) {
										formik.setSubmitting(false);
										setToReview(false);
									} else {
										onClose();
									}
								}}>
								{toReview ? "Back" : "Close"}
							</Button>
							<Button
								isLoading={formik.isSubmitting}
								color="primary"
								onPress={() => {
									formik.handleSubmit();
								}}>
								{toReview ? "Generate" : "Review"}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
