import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const FormatUnderlineAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('underline')}</span>
                    <span>Ctrl + U</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive('underline') ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default FormatUnderlineAction;
