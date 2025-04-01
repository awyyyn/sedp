import { GraphQLError } from "graphql";
import { AppContext, DocumentInput } from "../../types/index.js";
import {
	createDocument,
	deleteDocument,
	getDocuments,
} from "../../models/documents.js";

export const documentsResolver = async (
	_: never,
	{
		month,
		schoolYear,
		semester,
		year,
	}: {
		year?: number;
		month?: number;
		schoolYear?: string;
		semester?: number;
	},
	app: AppContext
) => {
	try {
		let studentId: string | undefined = undefined;

		if (app.role === "STUDENT") {
			studentId = app.id;
		}

		return await getDocuments({
			studentId,
			month,
			schoolYear,
			semester,
			year,
		});
	} catch (err) {
		console.log(err, "qq");
		throw new GraphQLError("Internal Server Error!");
	}
};

export const createDocumentResolver = async (
	_: never,
	{ input }: { input: DocumentInput },
	app: AppContext
) => {
	try {
		const document = await createDocument({ ...input, studentId: app.id });

		if (!document) {
			throw new GraphQLError("Document creation failed");
		}
		return document;
	} catch (err) {
		console.log(err, "qq");
		throw new GraphQLError("Internal Server Error!");
	}
};

export const deleteDocumentResolver = async (
	_: never,
	{ id }: { id: string },
	app: AppContext
) => {
	try {
		const document = await deleteDocument(id, app.id);

		if (!document) {
			throw new GraphQLError("Document deletion failed");
		}
		return document;
	} catch (err) {
		console.log(err, "qq");
		throw new GraphQLError("Internal Server Error!");
	}
};
