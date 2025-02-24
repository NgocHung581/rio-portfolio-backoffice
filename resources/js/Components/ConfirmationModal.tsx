import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    content: string;
    isLoading?: boolean;
};

const ConfirmationModal = ({ open, onClose, onConfirm, content, isLoading }: Props) => {
    const { t } = useTranslation();

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle variant="h5">{t('confirmation')}</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose} disabled={isLoading}>
                    {t('cancel')}
                </Button>
                <Button loading={isLoading} onClick={onConfirm}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
