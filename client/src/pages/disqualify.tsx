import { Card, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function DisqualifyPage() {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-content2 p-4">
			<Card className="max-w-lg w-full">
				<CardBody className="gap-5 text-center py-8">
					<div className="flex justify-center">
						<div className="rounded-full bg-danger-50 p-3">
							<Icon icon="lucide:x-circle" className="text-danger h-12 w-12" />
						</div>
					</div>

					<div className="space-y-2">
						<h1 className="text-2xl font-bold text-danger">
							Scholarship Disqualified
						</h1>
						<p className="text-default-600">
							We regret to inform you that your scholarship application has been
							disqualified.
						</p>
					</div>

					<div className="bg-default-50 rounded-lg p-4 text-left">
						<h2 className="font-semibold mb-2">Reason for Disqualification:</h2>
						<ul className="list-disc list-inside space-y-1 text-default-600">
							<li>Incomplete academic records submission</li>
							<li>GPA below minimum requirement (3.0)</li>
							<li>Missing recommendation letters</li>
						</ul>
					</div>

					<div className="text-small text-default-500">
						If you believe this is an error, please contact the scholarship
						committee within 5 business days.
					</div>
				</CardBody>

				<Divider />

				<CardFooter className="justify-center gap-2 py-5">
					{/* <Button
						variant="flat"
						color="default"
						startContent={<Icon icon="lucide:mail" />}>
						Contact Support
					</Button> */}
					<Button
						as={Link}
						to={"/login"}
						color="primary"
						startContent={<Icon icon="lucide:redo-2" />}>
						Go back to log in
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
