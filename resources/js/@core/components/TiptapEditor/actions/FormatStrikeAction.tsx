import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const FormatStrikeAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('strikethrough')}</span>
                    <span>Ctrl + Shift + S</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive('strike') ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <StrikethroughSIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default FormatStrikeAction;
