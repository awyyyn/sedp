export interface Technology {
	id: string;
	name: string;
	imgUrl: string;
	skill: number;
	createdAt: Date;
	updatedAt: Date;
	category: Category;
}

export type Category =
	| "FRONTEND"
	| "BACKEND"
	| "DATABASE"
	| "DEVOPS"
	| "DESIGN"
	| "OTHER";
