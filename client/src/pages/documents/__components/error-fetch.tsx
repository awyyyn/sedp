import { Button } from "@heroui/button";

interface ErrorFetchingProps {
	handleRefetch: VoidFunction;
}

export default function ErrorFetching({ handleRefetch }: ErrorFetchingProps) {
	return (
		<div className="min-h-[300px] space-y-2  grid place-content-center">
			<div>
				<h1 className="text-2xl text-center font-semibold text-gray-500">
					Error fetching documents.
				</h1>
				<p className="text-sm text-gray-500 max-w-sm text-center">
					There was an issue retrieving the documents. Please try refreshing or
					contact support if the problem persists.
				</p>
			</div>
			<Button
				variant="shadow"
				color="primary"
				className="max-w-fit px-10 mx-auto"
				onPress={handleRefetch}>
				Refresh
			</Button>
		</div>
	);
}
