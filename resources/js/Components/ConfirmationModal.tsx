import DialogContentText from '@mui/material/DialogContentText';
import { Fragment, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';

type RenderTriggerProps = {
    openModal: () => void;
};

type OnConfirmProps = {
    closeModal: () => void;
};

export type ConfirmationModalProps = {
    renderTrigger: (props: RenderTriggerProps) => ReactNode;
    content: ReactNode;
    onConfirm: (props: OnConfirmProps) => void;
    isLoading?: boolean;
};

const ConfirmationModal = ({ onConfirm, content, isLoading, renderTrigger }: ConfirmationModalProps) => {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Fragment>
            {renderTrigger({ openModal: handleOpenModal })}
            <Modal
                title={t('confirmation')}
                open={openModal}
                onClose={handleCloseModal}
                onOk={() => onConfirm({ closeModal: handleCloseModal })}
                isLoading={isLoading}
                okText={t('confirm')}
                closeText={t('cancel')}
            >
                {typeof content === 'string' ? <DialogContentText>{content}</DialogContentText> : content}
            </Modal>
        </Fragment>
    );
};

export default ConfirmationModal;
