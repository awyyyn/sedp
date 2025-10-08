import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import MonthlyDocumentForm from "../__components/monthly-form";

export default function AddMonthlyDocument() {
	const { state } = useLocation();

	if ((state && (!state.month || !state.year)) || !state) return <p>No</p>;

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Add Monthly Document | SEDP</title>
				<meta
					name="description"
					content="Add a new monthly document for the SEDP scholarship program."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<MonthlyDocumentForm
				month={Number(state.month)}
				year={Number(state.year)}
			/>
		</>
	);
}
