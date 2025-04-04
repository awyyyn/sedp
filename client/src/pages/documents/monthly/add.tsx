import { useLocation } from "react-router-dom";

import MonthlyDocumentForm from "../__components/monthly-form";

export default function AddMonthlyDocument() {
	const { state } = useLocation();

	if ((state && (!state.month || !state.year)) || !state) return <p>No</p>;

	return (
		<MonthlyDocumentForm
			month={Number(state.month)}
			year={Number(state.year)}
		/>
	);
}
