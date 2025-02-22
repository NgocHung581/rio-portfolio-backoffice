import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const AlignRightAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('align_right')}</span>
                    <span>Ctrl + Shift + R</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive({ textAlign: 'right' }) ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
                <FormatAlignRightIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default AlignRightAction;
