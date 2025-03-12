import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const ToggleBlockquoteAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('quote')}</span>
                    <span>Ctrl + Shift + B</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive('blockquote') ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <FormatQuoteIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default ToggleBlockquoteAction;
