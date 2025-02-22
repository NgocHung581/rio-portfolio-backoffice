import { router } from '@inertiajs/react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    href: string;
};

const BackListButton = ({ href }: Props) => {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleBackList = () => {
        router.get(href);
    };

    return (
        <Fragment>
            <Button color="secondary" onClick={handleOpenModal}>
                {t('list')}
            </Button>

            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle variant="h5">{t('confirmation')}</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>{t('leave_page_confirmation')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleBackList}>OK</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default BackListButton;
