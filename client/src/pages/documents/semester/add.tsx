import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import SemesterDocumentForm from "../__components/semester-form";

export default function AddSemesterDocument() {
	const { state } = useLocation();

	if ((state && (!state.semester || !state.year || !state.yearLevel)) || !state)
		return <p>No</p>;

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>Add Semester Document | SEDP</title>
				<meta
					name="description"
					content="Add a new semester document for the SEDP scholarship program."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Helmet>
			<SemesterDocumentForm
				year={state.year}
				semester={state.semester}
				yearLevel={Number(state.yearLevel)}
			/>
		</>
	);
}
