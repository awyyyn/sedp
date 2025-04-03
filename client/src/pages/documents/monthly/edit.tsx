import { useLocation } from "react-router-dom";

import MonthlyDocumentForm from "../__components/monthly-form";

import { Document } from "@/types";

export default function EditMonthlyDocument() {
	const { state }: { state: { document: Document } } = useLocation();

	if ((state && !state.document) || !state) return <p>No</p>;

	return (
		<MonthlyDocumentForm
			month={Number(state.document.month)}
			isEditing
			document={state.document}
			year={Number(state.document.year)}
		/>
	);
}
