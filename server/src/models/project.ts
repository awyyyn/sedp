import { Project } from "@app/types";
import { prisma } from "../services/index";

export const upsert = async ({
	content,
	duration,
	techStack,
	title,
	imgUrls,
	repoUrl,
	tags,
	type,
	liveUrl,
	id,
}: Omit<Project, "createdAt" | "updatedAt">): Promise<Project | null> => {
	const project = await prisma.project.upsert({
		create: {
			content,
			repoUrl,
			type,
			imgUrls,
			liveUrl,
			tags,
			duration,
			title,
			techStack,
		},
		update: {
			content,
			duration,
			techStack,
			title,
		},
		where: {
			id,
		},
	});

	if (!project) return null;

	return project;
};
