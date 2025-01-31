export interface APIResponse<T> {
	data: T | null;
	error: {
		message: string;
		code: number;
	} | null;
}
