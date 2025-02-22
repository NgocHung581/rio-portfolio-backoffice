import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const AlignLeftAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('align_left')}</span>
                    <span>Ctrl + Shift + L</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive({ textAlign: 'left' }) ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
                <FormatAlignLeftIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default AlignLeftAction;
