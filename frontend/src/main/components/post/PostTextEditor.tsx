import {RichTextEditor} from "@mantine/tiptap";
import {type Editor} from '@tiptap/react';


interface PostTextEditorProps {
    editor: Editor
}

function PostTextEditor({ editor }: PostTextEditorProps) {

    return (
        <RichTextEditor editor={editor} variant="subtle">
            <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
        </RichTextEditor>
    );
}

export default PostTextEditor;
