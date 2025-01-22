import { prisma } from "@app/services";
import { Technology } from "@app/types/technology";

export const upsertTechnology = async ({
	id,
	imgUrl,
	name,
	category,
	skill,
}: Omit<Technology, "createdAt" | "updatedAt">): Promise<Technology | null> => {
	const tech = await prisma.technology.upsert({
		create: {
			name,
			skill,
			imgUrl,
			category,
		},
		update: {
			imgUrl,
			name,
			skill,
			category,
		},
		where: {
			id,
		},
	});

	if (!tech) return null;

	return tech;
};
