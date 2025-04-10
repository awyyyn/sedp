import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

import { ImageUploader } from "../__components/image-uploader";

import { PreviewModal } from "@/components";
import { getFileExtension, imagesExtensions } from "@/lib/constant";
import { AddMonthlyDocumentSchema } from "@/definitions";
import { AddMonthlySchemaData, Document } from "@/types";
import {
	CREATE_DOCUMENT_MUTATION,
	READ_DOCUMENTS_QUERY,
	UPDATE_DOCUMENT_MUTATION,
} from "@/queries";
import { Icon } from "@iconify/react/dist/iconify.js";

interface MonthlyDocumentFormProps {
	isEditing?: boolean;
	document?: Document;
	month: number;
	year: number;
}

export default function MonthlyDocumentForm({
	document,
	isEditing = false,
	month,
	year,
}: MonthlyDocumentFormProps) {
	const navigate = useNavigate();
	const [uploadedUrls, setUploadedUrls] = useState<string[]>(
		document ? [document.documentUrl] : []
	);
	const [isOpen, onOpenChange] = useState(false);
	const [previewDocument, setPreviewDocument] = useState<string | null>(null);
	const [useUrl, setUrl] = useState(false);
	const [uploadDocument, { loading }] = useMutation(
		isEditing ? UPDATE_DOCUMENT_MUTATION : CREATE_DOCUMENT_MUTATION
	);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			documentName: document?.documentName || "",
			documentType: document?.docType || "NARRATIVE_REPORT",
			documentUrl: document?.documentUrl || "",
			amount: document?.amount || "",
		} as AddMonthlySchemaData,
		onSubmit: async (values: AddMonthlySchemaData) => {
			try {
				// UPLOAD

				const input = {
					documentName: values.documentName,
					docType: values.documentType,
					documentUrl: values.documentUrl,
					monthlyDocument: true,
					month: Number(document?.month || month),
					year: Number(document?.year || year),
					schoolYear: "-1",
					semester: -1,
					amount: Number(values?.amount || 0),
				};

				let variables = {};

				if (isEditing && document) {
					variables = {
						input,
						id: document.id,
					};
				} else {
					variables = {
						input,
					};
				}

				await uploadDocument({
					variables,
					refetchQueries: [READ_DOCUMENTS_QUERY],
				});

				navigate(`/my-documents/monthly`);
				toast.success(
					`Document ${isEditing ? "updated" : "uploaded"} successfully`,
					{
						description: `Document ${isEditing ? "updated" : "uploaded"} successfully`,
						position: "top-center",
						richColors: true,
					}
				);
			} catch (error) {
				toast.error("Something went wrong!", {
					description: "Error uploading document",
					position: "top-center",
					richColors: true,
				});
			}
		},
		validationSchema: AddMonthlyDocumentSchema,
	});

	useEffect(() => {
		if (uploadedUrls.length > 0) {
			formik.setFieldValue("documentUrl", uploadedUrls[0]);
		}
	}, [uploadedUrls]);

	return (
		<div className="container relative overflow-hidden  mx-auto px-5 md:px-0">
			<div className="absolute z-50 backdrop-blur-md right-0 left-0 top-0 flex  shadow-sm p-2">
				<div className="flex gap-2 items-center">
					<Button
						as={Link}
						to="/my-documents/monthly"
						isIconOnly
						className=""
						variant="light"
						radius="sm">
						<Icon icon="ep:back" width="20" height="20" />
					</Button>
					<h1 className="text-xl   md:text-2xl font-medium">
						{isEditing ? "Edit" : "Upload"} Document/Photo
					</h1>
				</div>
				<div className="ml-auto flex-col sm:flex-row gap-2 flex items-center">
					<Button
						onPress={() => {
							formik.resetForm();
							if (isEditing) {
								setUploadedUrls([document?.documentUrl || ""]);
								formik.setFieldValue(
									"documentUrl",
									document?.documentUrl || ""
								);
							}
						}}
						color="secondary"
						radius="sm"
						isDisabled={loading}>
						Reset
					</Button>
					<Button
						onPress={() => formik.handleSubmit()}
						color="primary"
						radius="sm"
						isLoading={loading}>
						Save
					</Button>
				</div>
			</div>
			<div className="h-[calc(100vh-28vh)] px-2 pt-32 gap-y-3 py-5 grid-cols-1 md:grid-cols-2 grid gap-x-2 md:gap-5  overflow-y-auto ">
				<div className="space-y-3">
					<div className="">
						<Input
							isReadOnly={formik.isSubmitting}
							label="Name"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="documentName"
							value={formik.values.documentName}
							isInvalid={!!formik.errors.documentName}
							errorMessage={formik.errors.documentName}
						/>
					</div>
					<div className="">
						<Select
							isDisabled={formik.isSubmitting}
							// selectedKeys={[formik.values.documentType]}
							// onSelectionChange={setValue}
							defaultSelectedKeys={[formik.values.documentType]}
							name="documentType"
							onSelectionChange={(value) => {
								formik.setFieldValue("documentType", value.currentKey);
							}}
							label="Type of document"
							selectionMode="single"
							classNames={{
								value: "capitalize",
							}}>
							{["NARRATIVE_REPORT", "RECEIPT"].map((option) => (
								<SelectItem key={option} className="capitalize">
									{option.split("_").join(" ").toLowerCase()}
								</SelectItem>
							))}
						</Select>
					</div>
					<div className="">
						<Input
							isReadOnly={formik.isSubmitting}
							label="Amount"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							name="amount"
							value={formik.values.amount?.toString() || ""}
							isInvalid={!!formik.errors.amount}
							errorMessage={formik.errors.amount}
						/>
					</div>
				</div>
				{/*<div className="">
                    <Select
                        label="School Year"
                        selectionMode="single"
                        classNames={{
                            value: "capitalize",
                        }}>
                        {semester.map((option, index) => (
                            <SelectItem key={index + 1} className="capitalize">
                                {option}
                            </SelectItem>
                        ))}
                    </Select>
             </div>
                <div className="">
                    <Select
                        label="Semester"
                        selectionMode="single"
                        classNames={{
                            value: "capitalize",
                        }}>
                        {semester.map((option, index) => (
                            <SelectItem key={index + 1} className="capitalize">
                                {option}
                            </SelectItem>
                        ))}
                    </Select>
                </div> */}
				<div className="relative   space-y-2">
					{useUrl ? (
						<>
							<Input
								label={"Google Drive URL or any URL"}
								description="Make sure the URL is public and accessible."
								// description={
								// 	<div className="flex justify-between">
								// 		<p>Make sure the URL is public and accessible.</p>

								// 	</div>
								// }
								className="pr-16"
								classNames={{
									input: "pr-28",
								}}
								value={formik.values.documentUrl}
								isInvalid={!!formik.errors.documentUrl}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								errorMessage={formik.errors.documentUrl}
								name="documentUrl"
								isReadOnly={formik.isSubmitting}
							/>
							<Button
								className="absolute top-1 right-20"
								color="secondary"
								radius="sm"
								size="sm"
								onPress={() => setUrl((p) => !p)}>
								Use {!useUrl ? "URL" : "Upload"}
							</Button>
						</>
					) : (
						<>
							<ImageUploader
								addBtn={
									<Button
										color="secondary"
										radius="sm"
										onPress={() => setUrl((p) => !p)}>
										Use {!useUrl ? "URL" : "Upload"}
									</Button>
								}
								invalid={formik.isSubmitting}
								setUploadedUrls={setUploadedUrls}
								uploadedUrls={uploadedUrls}
								handlePreview={(url) => {
									setPreviewDocument(url);
									onOpenChange(true);
								}}
								// multiple
								// maxFiles={5}
							/>

							{formik.errors.documentUrl && (
								<p className="text-sm  text-[#f31260]">
									{formik.errors.documentUrl}
								</p>
							)}
						</>
					)}
					{previewDocument && (
						<PreviewModal
							src={previewDocument}
							type={
								imagesExtensions.includes(
									getFileExtension(previewDocument) || "png"
								)
									? `image`
									: "document"
							}
							onOpenChange={onOpenChange}
							isOpen={isOpen}
							alt="preview document"
						/>
					)}
				</div>
			</div>
		</div>
	);
}
