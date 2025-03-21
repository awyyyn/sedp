import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import RichTextEditor from "@/components/RichTextEditor";

const validationSchema = Yup.object({
	title: Yup.string().required("Title is required"),
	content: Yup.string().required("Content is required"),
});

const AddAnnouncementsForm = () => {
	const formik = useFormik({
		initialValues: {
			title: "",
			content: "",
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			// Handle form submission
			console.log("Form data", values);
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Input
				fullWidth
				name="title"
				label="Title"
				value={formik.values.title}
				isInvalid={formik.touched.title && !!formik.errors.title}
				onChange={formik.handleChange}
				errorMessage={formik.touched.title && formik.errors.title}
			/>
			<RichTextEditor
				content={formik.values.content}
				onChange={formik.handleChange}
			/>
			<Button color="primary" fullWidth type="submit">
				Add Announcement
			</Button>
		</form>
	);
};

export default function AddAnnouncements() {
	return (
		<div>
			<h1>Add Announcement</h1>
			<AddAnnouncementsForm />
		</div>
	);
}
