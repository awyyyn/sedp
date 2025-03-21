import { SVGProps } from "react";
import * as yup from "yup";

import { addScholarSchema } from "@/definitions";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export * from "./system-user";
export * from "./student";

export type AddScholarSchemaData = yup.InferType<typeof addScholarSchema>;

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
}
