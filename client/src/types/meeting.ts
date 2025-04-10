export interface Meeting {
	readonly id: string;
	title: string;
	description: string;
	startTime: string;
	endTime: string;
	location: string;
	date: string;

	createdAt: string;
}
