import { useMutation, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Divider } from "@heroui/divider";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { toast } from "sonner";
import { useState } from "react";

import { DeleteModal } from "../__components";

import {
	systemUserQuery,
	systemUsersQuery,
	UPDATE_SYSTEM_USER_MUTATION,
} from "@/queries";
import { SystemUser } from "@/types";
import { formatDate, getRoleDescription } from "@/lib/utils";

export default function SystemUserPage() {
	const { id } = useParams();
	const [isOpen, setIsOpen] = useState(false);
	const { data, loading } = useQuery<{ systemUser: SystemUser }>(
		systemUserQuery,
		{
			variables: {
				id,
			},
		}
	);

	const [updateSystemUserStatus, { loading: updatingSystemUser }] = useMutation(
		UPDATE_SYSTEM_USER_MUTATION,
		{
			refetchQueries: [systemUsersQuery, systemUserQuery],
		}
	);

	if (loading || !data) return "loading...";

	const isBlocked = data.systemUser.status === "DELETED";

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

					<Button
						className="text-white"
						color="danger"
						onPress={() => setIsOpen(true)}>
						{isBlocked ? "Unblock" : "Block"}
					</Button>
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

			<DeleteModal
				deleteLabel={`${isBlocked ? "Unblock" : "Block"} `}
				loading={updatingSystemUser}
				handleDeletion={async () => {
					try {
						await updateSystemUserStatus({
							variables: {
								values: {
									id: data.systemUser.id,
									status: isBlocked
										? data.systemUser.verifiedAt
											? "VERIFIED"
											: "UNVERIFIED"
										: "DELETED",
								},
							},
						});
						toast.success(
							isBlocked
								? "System user status updated successfully"
								: "System user status reverted successfully",
							{
								description: isBlocked
									? "The system user's status has been updated."
									: "The system user's status has been reverted.",
								position: "top-center",
								richColors: true,
							}
						);
						setIsOpen(false);
					} catch (erro) {
						toast.error("Please try again later.", {
							description: "If the problem persists, contact support.",
							position: "top-center",
							richColors: true,
						});
					}
				}}
				open={isOpen}
				setOpen={setIsOpen}
				hideNote={isBlocked}
				title={isBlocked ? "Unblock System User" : "Delete System User"}
				description={
					isBlocked
						? "Are you sure you want to unblock this system user?"
						: "Are you sure you want to delete this system user?"
				}
			/>
		</div>
	);
}
