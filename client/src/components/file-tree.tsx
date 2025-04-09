import React from "react";
import { Icon } from "@iconify/react";
import { Accordion, AccordionItem } from "@heroui/accordion";

import { FileTreeItem } from "@/types";

interface FileTreeProps {
	items: FileTreeItem[];
	level?: number;
	onFileSelect?: (fileId: string) => void;
	activeFileId?: string;
	isDisabled?: boolean;
}

export const FileTree: React.FC<FileTreeProps> = ({
	items,
	level = 0,
	activeFileId,
	onFileSelect,
	isDisabled = false,
}) => {
	const renderIcon = (type: "file" | "folder", isOpen?: boolean) => {
		if (type === "folder") {
			return (
				<Icon
					icon={isOpen ? "lucide:folder-open" : "lucide:folder"}
					className="text-warning-400"
					width={18}
				/>
			);
		}

		return <Icon icon="lucide:file" className="text-default-400" width={16} />;
	};

	const renderItem = (item: FileTreeItem) => {
		const isActive = activeFileId === item.id;

		if (item.type === "file") {
			return (
				<button
					onClick={() => {
						if (!isDisabled && onFileSelect) {
							onFileSelect(item.id);
						}
					}}
					disabled={item.disabled || isDisabled}
					className={`flex disabled:opacity-50 disabled:cursor-not-allowed disabled:line-through   w-full cursor-pointer items-center gap-2 rounded-md py-1 px-2 transition-colors ${
						isActive
							? "bg-primary-100 text-primary-500"
							: "hover:bg-default-100"
					}  `}>
					{renderIcon("folder")}
					<span className="text-sm">{item.name}</span>
				</button>
			);
		}

		return (
			<Accordion
				key={item.id}
				selectionMode="single"
				className="px-0"
				isDisabled={item.disabled || isDisabled}
				itemClasses={{
					base: "py-0",
					title: "text-sm",
					trigger: "px-0 py-1",
					content: "pl-4",
				}}>
				<AccordionItem
					key={item.id}
					aria-label={item.name}
					isDisabled={item.disabled}
					startContent={renderIcon("folder")}
					title={item.name}>
					<FileTree
						items={item.children || []}
						level={level + 1}
						onFileSelect={onFileSelect}
						activeFileId={activeFileId}
						isDisabled={isDisabled}
					/>
				</AccordionItem>
			</Accordion>
		);
	};

	return <div className="w-full">{items.map((item) => renderItem(item))}</div>;
};
