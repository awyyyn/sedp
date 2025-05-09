import React from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Icon } from "@iconify/react";

interface ErrorUIProps {
	title?: string;
	description?: string;
	onRefresh?: () => void;
}

export const ErrorUI: React.FC<ErrorUIProps> = ({
	title = "Something went wrong",
	description = "An error occurred while loading the content. Please try again.",
	onRefresh,
}) => {
	return (
		<Card className="w-full max-w-md mx-auto p-6 text-center">
			<div className="flex flex-col items-center gap-4">
				<div className="rounded-full bg-danger-50 p-3">
					<Icon
						icon="lucide:alert-circle"
						className="w-8 h-8 text-danger"
						aria-hidden="true"
					/>
				</div>

				<div className="space-y-2">
					<h3 className="text-xl font-semibold tracking-tight">{title}</h3>
					<p className="text-default-500">{description}</p>
				</div>

				{onRefresh && (
					<Button
						color="primary"
						variant="flat"
						onPress={onRefresh}
						startContent={
							<Icon icon="lucide:refresh-cw" className="w-4 h-4" />
						}>
						Try Again
					</Button>
				)}
			</div>
		</Card>
	);
};
