import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";

import { Divider } from "@heroui/divider";

import { systemUserQuery } from "@/queries";
import { SystemUser } from "@/types";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { formatDate, getRoleDescription } from "@/lib/utils";

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

	if (loading || !data) return "loading...";

	return (
		<div className="space-y-6 pb-10">
			<Card className="py-4">
				<CardHeader className="flex justify-between flex-wrap ">
					<div className="flex gap-2 ">
						<Button
							as={Link}
							to="/admin/system-users"
							color="success"
							className="text-white"
							isIconOnly
							// startContent={<Icon icon="ep:back" />}>
						>
							<Icon icon="ep:back" />
						</Button>
						<div className="leading-none">
							<h1 className="text-2xl leading-none">System User Information</h1>
							<p className="text-sm leading-none text-gray-500 text-muted-foreground">
								Details about the system user&apos;s personal information.
							</p>
						</div>
					</div>
					{/* {!data.systemUser.statusUpdatedAt && (
						<Button
							className="text-white"
							color="success"
							onPress={() => setIsOpen(true)}>
							Edit Status
						</Button>
					)} */}
				</CardHeader>
			</Card>

			{/* Personal Information */}
			<Card>
				<CardHeader className="px-6 pt-4">
					<h1 className="flex items-center gap-2">
						<Icon icon="solar:info-square-broken" width="24" height="24" />
						Personal Information
					</h1>
				</CardHeader>
				<Divider />
				<CardBody className="p-6 space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Status
							</p>
							<p className="font-medium">{data.systemUser.status}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								First Name
							</p>
							<p className="font-medium">{data.systemUser.firstName}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Last Name
							</p>
							<p className="font-medium">{data.systemUser.lastName}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Middle Name
							</p>
							<p className="font-medium">{data.systemUser.middleName || ""}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Birth Date
							</p>
							<p className="font-medium">
								{formatDate(data.systemUser.birthDate)}
							</p>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Contact Information */}
			<Card>
				<CardHeader className="px-6 pt-4">
					<h1 className="flex items-center gap-2">
						<Icon icon="solar:phone-rounded-broken" width="24" height="24" />
						Contact Information
					</h1>
				</CardHeader>
				<Divider />
				<CardBody className="p-6 space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Email</p>
							<p className="font-medium">{data.systemUser.email}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Phone Number
							</p>
							<p className="font-medium">+63{data.systemUser.phoneNumber}</p>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Address */}
			<Card>
				<CardHeader className="px-6 pt-4">
					<h1 className="flex items-center gap-2">
						<Icon icon="solar:point-on-map-broken" width="24" height="24" />
						Address
					</h1>
				</CardHeader>
				<Divider />
				<CardBody className="p-6 space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								City / Municipality
							</p>

							<p className="font-medium">{data.systemUser.address.city}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Street
							</p>
							<p className="font-medium">{data.systemUser.address.city}</p>
						</div>
					</div>
				</CardBody>
			</Card>

			<Card>
				<CardHeader className="px-6 pt-4">
					<h1 className="flex items-center gap-2">
						<Icon icon="hugeicons:security-check" width="24" height="24" />
						Security
					</h1>
				</CardHeader>
				<Divider />
				<CardBody className="p-6 space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Role</p>
							<p className="font-medium">
								{getRoleDescription(data.systemUser.role)}
							</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Status
							</p>
							<p className="font-medium">{data.systemUser.status}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Two Factor Authentication
							</p>
							<p className="font-medium">
								{data.systemUser.mfaEnabled ? "Enabled" : "Disabled"}
							</p>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
