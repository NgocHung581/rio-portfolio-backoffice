import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const OrderedListAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('number_list')}</span>
                    <span>Ctrl + Shift + 7</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive('orderedList') ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <FormatListNumberedIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default OrderedListAction;
