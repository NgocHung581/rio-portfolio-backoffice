import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const BulletListAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip
            title={
                <Stack alignItems="center">
                    <span>{t('bullet_list')}</span>
                    <span>Ctrl + Shift + 8</span>
                </Stack>
            }
        >
            <IconButton
                centerRipple={false}
                className={editor.isActive('bulletList') ? 'tiptap-action-active' : ''}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <FormatListBulletedIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default BulletListAction;
