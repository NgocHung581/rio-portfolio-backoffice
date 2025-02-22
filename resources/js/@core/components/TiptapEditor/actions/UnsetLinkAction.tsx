import LinkOffOutlinedIcon from '@mui/icons-material/LinkOffOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const UnsetLinkAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip title={t('remove_link')}>
            <span>
                <IconButton
                    centerRipple={false}
                    disabled={!editor.isActive('link')}
                    onClick={() => editor.chain().focus().unsetLink().run()}
                >
                    <LinkOffOutlinedIcon fontSize="small" sx={{ transform: 'rotate(-45deg)' }} />
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default UnsetLinkAction;
