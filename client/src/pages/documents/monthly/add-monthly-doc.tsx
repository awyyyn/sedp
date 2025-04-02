import { Button } from "@heroui/button";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";

import { ImageUploader } from "../__components/image-uploader";

import { PreviewModal } from "@/components";
import { getFileExtension, imagesExtensions } from "@/lib/constant";
import { AddMonthlyDocumentSchema } from "@/definitions";
import { AddMonthlySchemaData } from "@/types";
import { CREATE_DOCUMENT_MUTATION, READ_DOCUMENTS_QUERY } from "@/queries";

export default function AddMonthlyDocument() {
	const { state } = useLocation();
	const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
	const [isOpen, onOpenChange] = useState(false);
	const [previewDocument, setPreviewDocument] = useState<string | null>(null);
	const [useUrl, setUrl] = useState(false);
	const [uploadDocument, { loading }] = useMutation(CREATE_DOCUMENT_MUTATION);

	const formik = useFormik({
		initialValues: {
			documentName: "",
			documentType: "NARRATIVE_REPORT",
			documentUrl: "",
		} as AddMonthlySchemaData,
		onSubmit: async (values: AddMonthlySchemaData) => {
			try {
				// UPLOAD
				await uploadDocument({
					variables: {
						input: {
							documentName: values.documentName,
							docType: values.documentType,
							documentUrl: values.documentUrl,
							monthlyDocument: true,
							month: Number(state.month),
							year: Number(state.year),
							schoolYear: "-1",
							semester: -1,
						},
					},
					refetchQueries: [READ_DOCUMENTS_QUERY],
				});
				toast.success("Document uploaded successfully", {
					description: "Document uploaded successfully",
					position: "top-center",
					richColors: true,
				});
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

	if ((state && (!state.month || !state.year)) || !state) return <p>No</p>;

	return (
		<div className="container relative overflow-hidden  mx-auto px-5 md:px-0">
			<div className="absolute z-50 backdrop-blur-md right-0 left-0 top-0 flex  shadow-sm p-2">
				<h1 className="text-xl max-w-[50%] md:text-2xl font-medium">
					Upload Document/Photo
				</h1>
				<div className="ml-auto flex-col sm:flex-row gap-2 flex items-center">
					<Button
						onPress={formik.resetForm.bind}
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
			<div className="h-[calc(100vh-28vh)] px-2 pt-32 gap-y-3 py-5 grid-cols-1 md:grid-cols-2 grid gap-x-2  overflow-y-auto ">
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
				<div className="md:col-span-2   space-y-2">
					<div className="flex justify-between items-center">
						<h1>Document / Photo</h1>
						<Button
							color="secondary"
							size="sm"
							radius="sm"
							onPress={() => setUrl((p) => !p)}>
							Use {useUrl ? "URL" : "Upload"}
						</Button>
					</div>
					{useUrl ? (
						<Input
							label={"Google Drive URL or any URL"}
							description="Make sure the URL is public and accessible."
							value={formik.values.documentUrl}
							isInvalid={!!formik.errors.documentUrl}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							errorMessage={formik.errors.documentUrl}
							name="documentUrl"
							isReadOnly={formik.isSubmitting}
						/>
					) : (
						<>
							<ImageUploader
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
