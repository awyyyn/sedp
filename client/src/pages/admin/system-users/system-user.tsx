import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

import { systemUserQuery } from "@/queries";
import { SystemUser } from "@/types";

export default function SystemUserPage() {
	const { id } = useParams();

	const { data, loading } = useQuery<{ systemUser: SystemUser }>(
		systemUserQuery,
		{
			variables: {
				id,
			},
		}
	);

	if (loading) return "loading...";

	return (
		<div className="">
			<div className="flex gap-2">
				<div>
					<Button isIconOnly variant="light" href="/system-users" as={Link}>
						<Icon icon="famicons:return-down-back-outline" fontSize={24} />
					</Button>
				</div>
				<div className="leading-loose">
					<h1 className="text-lg leading-none font-medium">
						System User Details
					</h1>
					<p className="text-sm leading-loose text-gray-400">
						Back to System Users
					</p>
				</div>
			</div>

			<div className="mt-3 space-y-2 px-4">
				<h1>Personal Information</h1>
				<div className="flex gap-2 flex-col md:flex-row">
					<Input
						label="First Name"
						variant="flat"
						classNames={{
							inputWrapper: "bg-transparent shadow-none",
						}}
						isReadOnly
						value={data?.systemUser.firstName}
					/>
					<Input
						label="Last Name"
						variant="flat"
						classNames={{
							inputWrapper: "bg-transparent shadow-none",
						}}
						isReadOnly
						value={data?.systemUser.lastName}
					/>
					{data?.systemUser.middleName && (
						<Input
							label="Last Name"
							variant="flat"
							isReadOnly
							classNames={{
								inputWrapper: "bg-transparent shadow-none",
							}}
							value={data?.systemUser.middleName}
						/>
					)}
				</div>

				<div className="flex gap-2  flex-col md:flex-row  ">
					<Input
						label="Email"
						variant="flat"
						isReadOnly
						classNames={{
							inputWrapper: "bg-transparent shadow-none",
						}}
						value={data?.systemUser.email}
					/>
					<Input
						label="Phone Number"
						variant="flat"
						isReadOnly
						classNames={{
							inputWrapper: "bg-transparent shadow-none",
						}}
						startContent={<p className="text-sm text-gray-600">+63</p>}
						value={data?.systemUser.phoneNumber}
					/>
				</div>
			</div>
			<Divider className="mt-5" />
			<div className="mt-3 space-y-2 px-4">
				<h1>Address</h1>
				<div className="flex gap-2 flex-col md:flex-row">
					<Input
						label="City"
						variant="flat"
						classNames={{
							inputWrapper: "bg-transparent shadow-none",
						}}
						isReadOnly
						value={data?.systemUser.address.city}
					/>
					<Input
						label="Barangay"
						variant="flat"
						classNames={{
							inputWrapper: "bg-transparent shadow-none",
						}}
						isReadOnly
						value={data?.systemUser.address.street}
					/>
				</div>
			</div>
		</div>
	);
}
