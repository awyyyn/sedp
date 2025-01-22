import { upsertTechnology } from "@app/models";
import { Technology } from "@app/types/technology";
import { Request, Response } from "express";

export const createTechController = async (req: Request, res: Response) => {
	const {
		category,
		imgUrl,
		name,
		skill,
	}: Omit<Technology, "id" | "createdAt" | "updatedAt"> = req.body;
	try {
		//

		const newTech = await upsertTechnology({
			category,
			imgUrl,
			name,
			skill,
			id: "",
		});

		if (!newTech) {
			res.status(400).json({ message: "Failed to create new technology" });
			return;
		}

		res.status(201).json({
			message: "Technology created successfully",
			data: newTech,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateTechController = async (req: Request, res: Response) => {
	try {
		//a
	} catch (error) {
		//
	}
};

export const deleteTechController = async (req: Request, res: Response) => {
	try {
		//
	} catch (error) {
		//
	}
};
