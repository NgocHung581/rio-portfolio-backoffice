import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Breakpoint } from '@mui/material/styles';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    maxWidth?: Breakpoint;
    okText?: string;
    closeText?: string;
    onOk?: () => void;
    isLoading?: boolean;
};

const Modal = ({ open, onClose, title, children, maxWidth, closeText, okText, onOk, isLoading }: Props) => {
    const { t } = useTranslation();

    const handleClose = () => {
        if (isLoading) return;

        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth={maxWidth}>
            <DialogTitle variant="h4">{title}</DialogTitle>
            <DialogContent dividers>{children}</DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose} disabled={isLoading}>
                    {!closeText ? t('close') : closeText}
                </Button>
                <Button onClick={!onOk ? handleClose : onOk} loading={isLoading}>
                    {!okText ? t('ok') : okText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Modal;
