import { SVGProps } from "react";
import * as yup from "yup";

import {
	addAdminSchema,
	AddAnnouncementSchema,
	addScholarSchema,
} from "@/definitions";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export * from "./system-user";
export * from "./student";
export * from "./announcement";

export type AddScholarSchemaData = yup.InferType<typeof addScholarSchema>;
export type AddAdminSchemaData = yup.InferType<typeof addAdminSchema>;
export type AddAnnouncementSchemaData = yup.InferType<
	typeof AddAnnouncementSchema
>;

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
}

export type Gender = "MALE" | "FEMALE";
