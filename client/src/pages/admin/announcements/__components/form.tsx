import { Input, Textarea } from "@heroui/input";
import { Form, Formik } from "formik";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { AddAnnouncementSchema } from "@/definitions";
import { AddAnnouncementSchemaData, Announcement } from "@/types";
import {
	CREATE_ANNOUNCEMENT_MUTATION,
	READ_ANNOUNCEMENTS_QUERY,
	UPDATE_ANNOUNCEMENT_MUTATION,
} from "@/queries";

export default function AnnouncementForm({
	edit = false,
	announcement,
}: {
	edit?: boolean;
	announcement?: Announcement;
}) {
	const navigate = useNavigate();
	const [createAnnouncement] = useMutation(
		edit ? UPDATE_ANNOUNCEMENT_MUTATION : CREATE_ANNOUNCEMENT_MUTATION,
		{
			refetchQueries: [READ_ANNOUNCEMENTS_QUERY],
		}
	);

	return (
		<Formik
			validationSchema={AddAnnouncementSchema}
			enableReinitialize
			initialValues={{
				content: announcement?.content || "",
				title: announcement?.title || "",
			}}
			onSubmit={async (values: AddAnnouncementSchemaData, helpers) => {
				try {
					const { data } = await createAnnouncement({
						variables:
							edit && announcement
								? {
										id: announcement.id,
										...values,
									}
								: values,
					});

					helpers.resetForm({
						values: {
							content: "",
							title: "",
						},
					});

					navigate(`/admin/announcements/${data.announcement.id}`);

					toast.success(
						edit
							? "Announcement updated successfully"
							: "Announcement created successfully",
						{
							description: edit
								? "The announcement has been updated successfully."
								: "The announcement has been successfully created.",
							richColors: true,
							position: "top-center",
						}
					);
				} catch (err) {
					toast.error(`Failed to ${edit ? "update" : "create"} announcement`, {
						description: `There was an error ${edit ? "updating" : "creating"} the announcement. Please try again.`,
						richColors: true,
						position: "top-center",
					});
				}
			}}>
			{({
				handleSubmit,
				handleBlur,
				handleChange,
				touched,
				errors,
				isValid,
				values,
				isSubmitting,
			}) => {
				return (
					<Form
						className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-6"
						onSubmit={handleSubmit}>
						<div className="lg:col-span-6">Announcement Information</div>
						<Input
							isReadOnly={isSubmitting}
							isInvalid={touched.title && !!errors.title}
							errorMessage={errors.title}
							onBlur={handleBlur}
							onChange={handleChange}
							className="lg:col-span-6"
							value={values.title}
							name="title"
							label="Title"
						/>
						<Textarea
							isReadOnly={isSubmitting}
							isInvalid={touched.content && !!errors.content}
							errorMessage={errors.content}
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.content}
							className="lg:col-span-6"
							name="content"
							label="Content"
						/>

						<div className="lg:col-span-6 flex justify-center mt-5">
							<Button
								type="submit"
								value={values.content}
								isDisabled={!isValid || isSubmitting}
								isLoading={isSubmitting}
								className="min-w-full md:min-w-[60%] bg-[#A6F3B2]">
								{edit ? "Update" : "Create"} Announcement
							</Button>
						</div>
					</Form>
				);
			}}
		</Formik>
	);
}
