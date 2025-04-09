import { Button } from "@heroui/button";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
} from "@heroui/drawer";
import { Tooltip } from "@heroui/tooltip";
import { Dispatch, SetStateAction } from "react";
import { Skeleton } from "@heroui/skeleton";
import { formatDate } from "date-fns";

interface DrawerTimelineProps {
	isOpen: boolean;
	loading?: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
	content: {
		id: string;
		title: string;
		content: string;
		date: string;
		formattedDate: string;
		time: string;
		location: string;
		link: string;
	};
	type?: "EVENT" | "MEETING";
}

export default function DrawerTimeline({
	isOpen,
	onOpenChange,
	loading = false,
	content,
}: DrawerTimelineProps) {
	return (
		<Drawer
			hideCloseButton
			backdrop="blur"
			classNames={{
				base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2  rounded-medium",
			}}
			isOpen={isOpen}
			onOpenChange={onOpenChange}>
			<DrawerContent>
				{(onClose) => (
					<>
						<DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
							<Tooltip content="Close">
								<Button
									isIconOnly
									className="text-default-400"
									size="sm"
									variant="light"
									onPress={onClose}>
									<svg
										fill="none"
										height="20"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										width="20"
										xmlns="http://www.w3.org/2000/svg">
										<path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
									</svg>
								</Button>
							</Tooltip>
							<div className="w-full flex justify-start gap-2">
								{/* <Button
									className="font-medium text-small text-default-500"
									size="sm"
									onPress={() => {
										navigator.clipboard.writeText(content.link || "");
									}}
									startContent={
										<svg
											height="16"
											viewBox="0 0 16 16"
											width="16"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M3.85.75c-.908 0-1.702.328-2.265.933-.558.599-.835 1.41-.835 2.29V7.88c0 .801.23 1.548.697 2.129.472.587 1.15.96 1.951 1.06a.75.75 0 1 0 .185-1.489c-.435-.054-.752-.243-.967-.51-.219-.273-.366-.673-.366-1.19V3.973c0-.568.176-.993.433-1.268.25-.27.632-.455 1.167-.455h4.146c.479 0 .828.146 1.071.359.246.215.43.54.497.979a.75.75 0 0 0 1.483-.23c-.115-.739-.447-1.4-.99-1.877C9.51 1 8.796.75 7.996.75zM7.9 4.828c-.908 0-1.702.326-2.265.93-.558.6-.835 1.41-.835 2.29v3.905c0 .879.275 1.69.833 2.289.563.605 1.357.931 2.267.931h4.144c.91 0 1.705-.326 2.268-.931.558-.599.833-1.41.833-2.289V8.048c0-.879-.275-1.69-.833-2.289-.563-.605-1.357-.931-2.267-.931zm-1.6 3.22c0-.568.176-.992.432-1.266.25-.27.632-.454 1.168-.454h4.145c.54 0 .92.185 1.17.453.255.274.43.698.43 1.267v3.905c0 .569-.175.993-.43 1.267-.25.268-.631.453-1.17.453H7.898c-.54 0-.92-.185-1.17-.453-.255-.274-.43-.698-.43-1.267z"
												fill="currentColor"
												fillRule="evenodd"
											/>
										</svg>
									}
									variant="flat">
									Copy Link
								</Button>
								<Button
									as={Link}
									to={content.link}
									className="font-medium text-small text-default-500"
									endContent={
										<svg
											fill="none"
											height="16"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											width="16"
											xmlns="http://www.w3.org/2000/svg">
											<path d="M7 17 17 7M7 7h10v10" />
										</svg>
									}
									size="sm"
									variant="flat">
									Go to page
								</Button> */}
							</div>
							<div className="flex gap-1 items-center">
								{/* <Tooltip content="Previous">
									<Button
										isIconOnly
										className="text-default-500"
										size="sm"
										variant="flat">
										<svg
											fill="none"
											height="16"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											width="16"
											xmlns="http://www.w3.org/2000/svg">
											<path d="m18 15-6-6-6 6" />
										</svg>
									</Button>
								</Tooltip>
								<Tooltip content="Next">
									<Button
										isIconOnly
										className="text-default-500"
										size="sm"
										variant="flat">
										<Icon icon="line-md:chevron-right" width="24" height="24" />
									</Button>
								</Tooltip> */}
							</div>
						</DrawerHeader>
						<DrawerBody className="pt-16">
							{loading ? (
								<TimelineDrawerSkeleton />
							) : (
								<div className="flex flex-col gap-2 py-4">
									<h1 className="text-2xl font-bold leading-7">
										{content.title}
									</h1>

									<p className="text-sm text-default-500">{content.location}</p>
									<div className="mt-4 flex flex-col gap-3">
										<div className="flex gap-3 items-center">
											<div className="flex-none border-1 border-default-200/50 rounded-small text-center w-11 overflow-hidden">
												<div className="text-tiny bg-default-100 py-0.5 text-default-500">
													{formatDate(new Date(content.date), "MMM")}
												</div>
												<div className="flex items-center justify-center font-semibold text-medium h-6 text-default-500">
													{formatDate(new Date(content.date), "dd")}
												</div>
											</div>
											<div className="flex flex-col gap-0.5">
												<p className="text-medium text-foreground font-medium">
													{/* Tuesday, November 19 */}
													{content.formattedDate}
												</p>
												<p className="text-small text-default-500">
													{/* 5:00 PM - 9:00 PM PST */}
													{content.time}
												</p>
											</div>
										</div>
										<div className="flex gap-3 items-center">
											<div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
												<svg
													className="text-default-500"
													height="20"
													viewBox="0 0 16 16"
													width="20"
													xmlns="http://www.w3.org/2000/svg">
													<g
														fill="none"
														fillRule="evenodd"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="1.5">
														<path d="M2 6.854C2 11.02 7.04 15 8 15s6-3.98 6-8.146C14 3.621 11.314 1 8 1S2 3.62 2 6.854" />
														<path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
													</g>
												</svg>
											</div>
											<div className="flex flex-col gap-0.5">
												<p className="text-medium text-foreground font-medium">
													{content.location}
												</p>
												<p className="text-small text-default-500">
													Event Location
												</p>
											</div>
										</div>
										<div className="flex flex-col mt-4 gap-3 items-start">
											<span className="text-medium font-medium">
												About the event
											</span>
											<div className="text-medium text-default-500 flex flex-col gap-2">
												<p>{content.content}</p>

												{/* 	<p className="mt-4">
												Brought to you by the{" "}
												<Button
													as={Link}
													variant="ghost"
													className="text-default-700"
													to="https://heroui.com">
													HeroUI team
												</Button>
												.
											</p> */}
											</div>
										</div>
									</div>
								</div>
							)}
						</DrawerBody>
						{/* 						<DrawerFooter className="flex flex-col gap-1">
							<Button
								as={Link}
								variant="ghost"
								className="text-default-400"
								to="mailto:hello@heroui.com"
								size="sm">
								Contact the host
							</Button>
							<Button
								as={Link}
								variant="ghost"
								className="text-default-400"
								to="mailto:hello@heroui.com"
								size="sm">
								Report event
							</Button>
						</DrawerFooter> */}
					</>
				)}
			</DrawerContent>
		</Drawer>
	);
}

const TimelineDrawerSkeleton = () => (
	<div className="flex flex-col gap-2 py-4">
		<div className="space-y-3">
			<Skeleton className="h-10" />
			<Skeleton className="h-5 w-8/12" />
		</div>
		<div className="flex gap-2 ">
			<Skeleton className="h-10 w-10 rounded-lg" />
			<div className="flex flex-col justify-evenly w-full">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-3.5 w-full" />
			</div>
		</div>
		<div className="flex gap-2 ">
			<Skeleton className="h-10 w-10 rounded-lg" />
			<div className="flex flex-col justify-evenly w-full">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-3.5 w-full" />
			</div>
		</div>
		<div className="  mt-3">
			<Skeleton className="h-6 w-11/12" />
			<div className="space-y-2 mt-5">
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className=" h-4 w-8/12" />
			</div>
			<div className="space-y-2 mt-5">
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className=" h-4 w-8/12" />
			</div>
			<div className="space-y-2 mt-5">
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className="w-full h-4" />
				<Skeleton className=" h-4 w-8/12" />
			</div>
		</div>
	</div>
);
