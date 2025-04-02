import { useLocation } from "react-router-dom";

export default function AddSemesterDocument() {
	const { state } = useLocation();

	if ((state && (state.month || state.year)) || !state) return <p>No</p>;

	return <div>AddMonthlyDocument</div>;
}
