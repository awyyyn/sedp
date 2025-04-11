import { useLocation } from "react-router-dom";

import SemesterDocumentForm from "../__components/semester-form";

export default function AddSemesterDocument() {
	const { state } = useLocation();

	if ((state && (!state.semester || !state.year || !state.yearLevel)) || !state)
		return <p>No</p>;

	return (
		<SemesterDocumentForm
			year={state.year}
			semester={state.semester}
			yearLevel={Number(state.yearLevel)}
		/>
	);
}
