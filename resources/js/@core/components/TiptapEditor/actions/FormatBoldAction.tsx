import FormatBoldIcon from '@mui/icons-material/FormatBold';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const FormatBoldAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('bold')}</span>
                    <span>Ctrl + B</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive('bold') ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <FormatBoldIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default FormatBoldAction;
