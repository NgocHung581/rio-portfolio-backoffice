import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const AlignCenterAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('align_center')}</span>
                    <span>Ctrl + Shift + E</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive({ textAlign: 'center' }) ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
                <FormatAlignCenterIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default AlignCenterAction;
