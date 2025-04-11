import { Spinner } from "@heroui/spinner";

export const Loader = () => {
	return (
		<div className="fixed h-screen w-screen  inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
			<div className="flex flex-col items-center gap-2">
				<Spinner
					classNames={{ label: "text-foreground mt-4" }}
					label=""
					size="lg"
				/>
			</div>
		</div>
	);
};
