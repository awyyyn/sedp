import { Student } from "./student";

export interface Document {
	readonly id: string;

	documentName: string;
	studentId: string;
	student: Student;
	documentType: DocumentType;

	docType: DocType;
	otherType: string | null;

	documentUrl: string;
	monthlyDocument: boolean;
	month: number;
	year: number;
	schoolYear: string;
	semester: number;

	createdAt: string;
	updatedAt: string;
}

export type DocumentType = "photo" | "document";

export type DocType =
	| "NARRATIVE_REPORT"
	| "RECEIPT"
	| "COR"
	| "COG"
	| "OSAS"
	| "OTHER";
