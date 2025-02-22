import FormHelperText from '@mui/material/FormHelperText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CharacterCountExtension from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, EditorEvents, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ForwardedRef, forwardRef, Fragment } from 'react';
import CharacterCount from './CharacterCount';
import TiptapWrapper from './TiptapWrapper';
import AlignCenterAction from './actions/AlignCenterAction';
import AlignJustifyAction from './actions/AlignJustifyAction';
import AlignLeftAction from './actions/AlignLeftAction';
import AlignRightAction from './actions/AlignRightAction';
import FormatBoldAction from './actions/FormatBoldAction';
import FormatItalicAction from './actions/FormatItalicAction';
import FormatStrikeAction from './actions/FormatStrikeAction';
import FormatUnderlineAction from './actions/FormatUnderlineAction';
import InsertLinkAction from './actions/InsertLinkAction';
import UnsetLinkAction from './actions/UnsetLinkAction';

type Props = {
    value?: string;
    onChange?: (content: string) => void;
    onBlur?: (props: EditorEvents['blur']) => void;
    characterLimit?: number;
    error?: boolean;
    helperText?: string;
    height?: number;
};

const TiptapEditor = forwardRef(
    (
        { value, onChange, onBlur, characterLimit, error, helperText, height = 200 }: Props,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const editor = useEditor({
            content: value,
            onUpdate: handleUpdateEditor,
            onBlur,
            extensions: [
                StarterKit,
                Underline,
                TextAlign.configure({ types: ['heading', 'paragraph'], defaultAlignment: 'left' }),
                Link.configure({ autolink: false }),
                CharacterCountExtension.configure({ limit: characterLimit }),
            ],
        });

        function handleUpdateEditor({ editor }: EditorEvents['update']) {
            onChange && onChange(editor?.isEmpty ? '' : editor.getHTML());
        }

        if (!editor) return null;

        return (
            <Fragment>
                <TiptapWrapper height={height} error={error}>
                    <Paper elevation={0} square sx={{ px: 3.5, py: 4 }}>
                        <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                            <FormatBoldAction editor={editor} />
                            <FormatItalicAction editor={editor} />
                            <FormatUnderlineAction editor={editor} />
                            <FormatStrikeAction editor={editor} />
                            <AlignLeftAction editor={editor} />
                            <AlignCenterAction editor={editor} />
                            <AlignRightAction editor={editor} />
                            <AlignJustifyAction editor={editor} />
                            <InsertLinkAction editor={editor} />
                            <UnsetLinkAction editor={editor} />
                        </Stack>
                    </Paper>

                    <EditorContent ref={ref} editor={editor} className="tiptap-wrapper" />

                    {!!characterLimit && <CharacterCount editor={editor} limit={characterLimit} />}
                </TiptapWrapper>

                {!!helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
            </Fragment>
        );
    },
);

export default TiptapEditor;
