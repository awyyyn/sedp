import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import MonthlyDocumentForm from "../__components/monthly-form";

import { Document } from "@/types";

export default function EditMonthlyDocument() {
	const { state }: { state: { document: Document } } = useLocation();

	if ((state && !state.document) || !state) return <p>No</p>;

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Edit Monthly Document | SEDP</title>
				<meta
					name="description"
					content="Edit an existing monthly document for the SEDP scholarship program."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<MonthlyDocumentForm
				month={Number(state.document.month)}
				isEditing
				document={state.document}
				year={Number(state.document.year)}
			/>
		</>
	);
}
