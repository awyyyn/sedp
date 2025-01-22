export interface Project {
	id: string;
	title: string;
	content: string;
	duration: string;
	techStack: string[];
	repoUrl: string;
	liveUrl: string | null;
	type: string;
	imgUrls: string[];
	tags: string[];

	createdAt: Date;
	updatedAt: Date;
}
