import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const AlignJustifyAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('align_justify')}</span>
                    <span>Ctrl + Shift + J</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive({ textAlign: 'justify' }) ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            >
                <FormatAlignCenterIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default AlignJustifyAction;
