import { SVGProps } from "react";
import * as yup from "yup";

import {
	addAdminSchema,
	AddAnnouncementSchema,
	AddEventSchema,
	AddMeetingSchema,
	AddMonthlyDocumentSchema,
	addScholarSchema,
} from "@/definitions";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export * from "./system-user";
export * from "./student";
export * from "./document";
export * from "./announcement";
export * from "./event";
export * from "./allowance";
export * from "./meeting";

export type AddScholarSchemaData = yup.InferType<typeof addScholarSchema>;
export type AddAdminSchemaData = yup.InferType<typeof addAdminSchema>;
export type AddAnnouncementSchemaData = yup.InferType<
	typeof AddAnnouncementSchema
>;
export type AddEventSchemaData = yup.InferType<typeof AddEventSchema>;
export type AddMeetingSchemaData = yup.InferType<typeof AddMeetingSchema>;
export type AddMonthlySchemaData = yup.InferType<
	typeof AddMonthlyDocumentSchema
>;

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
}

export type Gender = "MALE" | "FEMALE";

export interface CalendarEvent {
	id: string;
	start: string;
	end: string;
	location: string;
	title: string;
	backgroundColor: string;
	borderColor: string;
}

export interface FileTreeItem {
	id: string;
	name: string;
	type: "file" | "folder";
	disabled?: boolean;
	children?: FileTreeItem[];
}
