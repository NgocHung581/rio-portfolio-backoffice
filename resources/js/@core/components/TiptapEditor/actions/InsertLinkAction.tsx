import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { Editor } from '@tiptap/react';
import { ChangeEvent, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
};

const InsertLinkAction = ({ editor }: Props) => {
    const { t } = useTranslation();

    const currentHref = editor.getAttributes('link').href ?? '';
    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})([\/\w .-]*)*\/?$/i;

    const [openModal, setOpenModal] = useState(false);
    const [link, setLink] = useState(currentHref);
    const [errorMessage, setErrorMessage] = useState('');

    const handleOpenModal = () => {
        setOpenModal(true);
        setLink(currentHref);
        setErrorMessage('');
    };

    const handleCloseModal = () => {
        setOpenModal(false);

        editor.chain().focus().run();
    };

    const handleChangeLink = (e: ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value);
    };

    const handleInsertLink = () => {
        const isValidLink = urlRegex.test(link);

        if (!isValidLink) {
            setErrorMessage(t('error_message_invalid_link'));

            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run();

        handleCloseModal();
    };

    return (
        <Fragment>
            <Tooltip title={t('insert_link')}>
                <IconButton
                    centerRipple={false}
                    className={editor.isActive('link') ? 'tiptap-action-active' : ''}
                    onClick={handleOpenModal}
                >
                    <InsertLinkOutlinedIcon fontSize="small" sx={{ transform: 'rotate(-45deg)' }} />
                </IconButton>
            </Tooltip>

            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle variant="h5">{t('insert_link')}</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label={t('link')}
                        value={link}
                        onChange={handleChangeLink}
                        error={!!errorMessage}
                        helperText={errorMessage}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleInsertLink}>{t('insert')}</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default InsertLinkAction;
