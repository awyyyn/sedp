import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

interface RichTextEditorProps {
	content: string;
	onChange?: (html: string) => void;
	editable?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
	content = "",
	onChange = () => {},
	editable = true,
}) => {
	const editor = useEditor({
		extensions: [StarterKit],
		content,
		editable,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	// Optional: Add a toolbar for formatting options
	const renderToolbar = () => {
		if (!editor || !editable) return null;

		return (
			<div className="flex space-x-2 mb-2 p-2 border-b border-gray-200">
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={`p-2 rounded ${editor.isActive("bold") ? "bg-gray-200" : ""}`}>
					Bold
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={`p-2 rounded ${editor.isActive("italic") ? "bg-gray-200" : ""}`}>
					Italic
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={`p-2 rounded ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}>
					Heading
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`p-2 rounded ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}>
					Bullet List
				</button>
			</div>
		);
	};

	return (
		<div className="border rounded-md">
			{renderToolbar()}
			<div className="p-4">
				<EditorContent editor={editor} />
			</div>
		</div>
	);
};

export default RichTextEditor;
