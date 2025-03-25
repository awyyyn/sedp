import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { useState } from "react";

import UpdateStatusModal from "./__components/update-status";

import { Student } from "@/types";
import { READ_STUDENT_QUERY } from "@/queries";
import { formatDate } from "@/lib/utils";
import { years } from "@/constants";

export default function ScholarInfo() {
	const { id } = useParams();
	const [isOpen, setIsOpen] = useState(false);
	const { loading, error, data } = useQuery<{ student: Student }>(
		READ_STUDENT_QUERY,
		{
			variables: { id },
		}
	);

	if (loading || !data) return <h1>loading...</h1>;

	if (error) return <h1>Error: {JSON.stringify(error, null, 2)}</h1>;

	return (
		<div className="space-y-6 pb-10">
			{/* Personal Information */}
			<Card className="py-4">
				<CardHeader className="flex justify-between flex-wrap ">
					<div className="flex gap-2 ">
						<Button
							as={Link}
							to="/admin/scholars"
							color="success"
							className="text-white"
							isIconOnly
							// startContent={<Icon icon="ep:back" />}>
						>
							<Icon icon="ep:back" />
						</Button>
						<div className="leading-none">
							<h1 className="text-2xl leading-none">Scholar Information</h1>
							<p className="text-sm leading-none text-gray-500 text-muted-foreground">
								Details about the scholar&apos;s personal and academic
								information.
							</p>
						</div>
					</div>
					{!data.student.statusUpdatedAt && (
						<Button
							className="text-white"
							color="success"
							onPress={() => setIsOpen(true)}>
							Edit Status
						</Button>
					)}
				</CardHeader>
			</Card>
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
							<p className="font-medium">{data.student.status}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								First Name
							</p>
							<p className="font-medium">{data.student.firstName}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Last Name
							</p>
							<p className="font-medium">{data.student.lastName}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Middle Name
							</p>
							<p className="font-medium">{data.student.middleName || ""}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Birth Date
							</p>
							<p className="font-medium">
								{formatDate(Number(data.student.birthDate))}
							</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Gender
							</p>
							<p className="font-medium">{data.student.gender}</p>
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
							<p className="font-medium">{data.student.email}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Phone Number
							</p>
							<p className="font-medium">+63 {data.student.phoneNumber}</p>
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

							<p className="font-medium">{data.student.address.city}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Street
							</p>
							<p className="font-medium">{data.student.address.city}</p>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Academic Information */}
			<Card>
				<CardHeader className="px-6 pt-4">
					<h1 className="flex items-center gap-2">
						<Icon
							icon="solar:square-academic-cap-2-outline"
							width="24"
							height="24"
						/>
						Academic Information
					</h1>
				</CardHeader>
				<Divider />
				<CardBody className="p-6 space-y-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								School Name
							</p>
							<p className="font-medium">{data.student.schoolName}</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">
								Year Level
							</p>

							<p className="font-medium">
								{years.find(
									(year) => year.value === Number(data.student.yearLevel)
								)?.label ?? data.student.yearLevel}
							</p>
						</div>
						<div className="space-y-2 sm:col-span-2">
							<p className="text-sm font-medium text-muted-foreground">
								Course
							</p>
							<p
								className={`font-medium ${!data.student.course && "italic text-gray-400"}`}>
								{data.student.course || "No data"}
							</p>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Edit Modal */}
			<UpdateStatusModal
				data={data.student}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
		</div>
	);
}
