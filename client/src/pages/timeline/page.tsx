import { FCalendar } from "@/components";

export default function TimelinePage() {
	return (
		<div className="container mx-auto">
			<FCalendar events={[]} type="EVENT" />
		</div>
	);
}
