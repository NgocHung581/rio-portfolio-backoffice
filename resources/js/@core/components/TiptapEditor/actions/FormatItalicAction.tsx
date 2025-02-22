import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const FormatItalicAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('italic')}</span>
                    <span>Ctrl + I</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive('italic') ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <FormatItalicIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default FormatItalicAction;
