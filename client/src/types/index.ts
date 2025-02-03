import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export * from "./system-user";

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
}
