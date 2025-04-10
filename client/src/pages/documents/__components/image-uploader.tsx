import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { CircularProgress } from "@heroui/progress";
import { Icon } from "@iconify/react";

import documentImg from "@/assets/document.png";
import { getFileExtension, imagesExtensions } from "@/lib/constant";

type FileType = "image" | "pdf" | "word" | "unknown";

interface ImageUploaderProps {
	multiple?: boolean;
	maxFiles?: number;
	// cloudName?: string;
	// uploadPreset: string;
	handlePreview?: (url: string) => void;
	uploadedUrls: string[];
	setUploadedUrls: Dispatch<SetStateAction<string[]>>;
	forceType?: FileType;
	invalid?: boolean;

	addBtn?: ReactNode;
}

interface UploadingFile {
	file: File;
	progress: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
	multiple = false,
	maxFiles = 5,
	// cloudName,
	invalid = false,
	// uploadPreset,
	setUploadedUrls,
	uploadedUrls = [],
	handlePreview,
	addBtn,
}) => {
	const [dragActive, setDragActive] = React.useState(false);
	const [uploadingFiles, setUploadingFiles] = React.useState<UploadingFile[]>(
		[]
	);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const uploadToCloudinary = async (file: File) => {
		const formData = new FormData();

		formData.append("file", file);

		// formData.append("cloud_name", cloudName);
		formData.append("upload_preset", "documents");
		formData.append("tags", "browser-upload");
		const cloudName = "dylfh2vsq";

		try {
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/upload`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) throw new Error("Upload failed");

			const data = await response.json();

			return data.secure_url;
		} catch (error) {
			console.error("Upload error:", error);

			throw error;
		}
	};

	const handleFiles = async (newFiles: FileList | null) => {
		if (!newFiles) return;

		const fileArray = Array.from(newFiles);
		const imageFiles = fileArray;

		// 	.filter((file) =>
		// 	file.type.startsWith("image/")
		// );

		if (!multiple && imageFiles.length > 0) {
			let [firstFile] = imageFiles;

			setUploadingFiles([{ file: firstFile, progress: 0 }]);

			try {
				const url = await uploadToCloudinary(firstFile);

				setUploadedUrls([url]);
			} finally {
				setUploadingFiles([]);
			}
		} else if (multiple) {
			const allowedFiles = imageFiles.slice(0, maxFiles - uploadedUrls.length);

			setUploadingFiles(allowedFiles.map((file) => ({ file, progress: 0 })));
			try {
				const uploadPromises = allowedFiles.map((file) =>
					uploadToCloudinary(file)
				);
				const urls = await Promise.all(uploadPromises);

				setUploadedUrls((prev) => [...prev, ...urls]);
			} finally {
				setUploadingFiles([]);
			}
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		handleFiles(e.dataTransfer.files);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleFiles(e.target.files);
	};

	const removeImage = (index: number) => {
		setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div
			className="w-full
		 mx-auto">
			<Card
				className={`border-2 border-dashed transition-colors ${
					dragActive ? "border-primary-500" : "border-default-300"
				}`}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				isDisabled={invalid}>
				<CardBody className="flex flex-col items-center gap-4 py-8">
					<input
						disabled={invalid}
						ref={inputRef}
						type="file"
						multiple={multiple}
						accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						onChange={handleChange}
						className="hidden"
					/>

					{uploadedUrls.length === 0 && uploadingFiles.length === 0 ? (
						<>
							<Icon
								icon="lucide:upload-cloud"
								className="w-12 h-12 text-default-400"
							/>
							<div className="text-center">
								<p className="text-default-700 text-lg font-semibold">
									Drag and drop your image/file here
								</p>
								<p className="text-default-500 text-sm">or click to browse</p>
							</div>
							<div className="flex gap-2">
								{addBtn && addBtn}
								<Button
									color="primary"
									variant="flat"
									onPress={() => inputRef.current?.click()}>
									Select Files
								</Button>
							</div>
						</>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
							{uploadedUrls.map((url, index) => {
								const isImage = imagesExtensions.includes(
									getFileExtension(url) || ""
								);

								return (
									<div key={url} className="relative group">
										<div className="relative group  ">
											<div className="opacity-0 backdrop-blur-sm rounded-lg z-50 group-hover:opacity-100 flex transition-transform-opacity duration-500 justify-center items-center w-full h-full absolute inset-0 top-0 left-0 ">
												<Button
													radius="sm"
													color="primary"
													onPress={() => handlePreview?.(url)}>
													Preview
												</Button>
											</div>

											<Image
												removeWrapper
												src={isImage ? url : documentImg}
												alt={`Upload ${index + 1}`}
												className="w-full aspect-square object-cover rounded-lg"
											/>
										</div>
										<Button
											isIconOnly
											color="danger"
											variant="flat"
											size="sm"
											className="absolute z-[53] top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
											onPress={() => removeImage(index)}>
											<Icon icon="lucide:x" className="w-4 h-4" />
										</Button>
									</div>
								);
							})}
							{uploadingFiles.map((file, index) => (
								<div key={file.file.name + index} className="relative">
									<div className="w-full aspect-square bg-default-100 rounded-lg flex items-center justify-center">
										<CircularProgress aria-label="Uploading..." size="lg" />
									</div>
								</div>
							))}
							{multiple &&
								uploadedUrls.length < maxFiles &&
								uploadingFiles.length === 0 && (
									<Button
										variant="flat"
										className="aspect-square w-full h-full min-h-[120px]"
										onPress={() => inputRef.current?.click()}>
										<div className="flex flex-col items-center gap-2">
											<Icon icon="lucide:plus" className="w-6 h-6" />
											<span>Add More</span>
										</div>
									</Button>
								)}
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
};
