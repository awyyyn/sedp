import { Button } from "@heroui/button";
import { Icon, IconProps } from "@iconify/react/dist/iconify.js";

export function NoData({
	icon,
	title,
	description,
	onRetry,
	loading,
}: {
	title: string;
	description: string;
	icon: IconProps;
	onRetry?: () => void;
	loading?: boolean;
}) {
	return (
		<div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
			<div className="text-5xl text-primary">
				<Icon {...icon} />
			</div>
			<h1 className="text-lg font-bold">{title}</h1>
			<p className="text-sm text-gray-500">{description}</p>
			{onRetry && (
				<Button
					isLoading={loading}
					color="primary"
					variant="solid"
					onPress={onRetry}
					className="mt-4">
					Retry
				</Button>
			)}
		</div>
	);
}
