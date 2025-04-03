import React from "react";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";

interface PreviewModalProps {
	src: string;
	type: "image" | "document";
	alt?: string;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
	src,
	type,
	alt,
	isOpen,
	onOpenChange,
}) => {
	const renderPreviewContent = () => {
		if (type === "image") {
			return (
				<img
					src={src}
					alt={alt || "Preview"}
					className="w-full h-full object-contain"
				/>
			);
		}

		// For documents, render iframe
		return (
			<iframe
				src={src}
				title="Document preview"
				className="w-full h-[80vh]"
				// sandbox="allow-same-origin allow-scripts"
			/>
		);
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="5xl"
			scrollBehavior="inside"
			backdrop="blur"
			classNames={{
				closeButton: "shadow-md bg-white/50   shadow-black/30",
			}}>
			<ModalContent
				style={{
					zIndex: 199,
				}}>
				<ModalBody className="p-0 ">{renderPreviewContent()}</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export { PreviewModal };
