import ConfirmationModal from '@/Components/ConfirmationModal';
import Button from '@mui/material/Button';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    selectedAlbumMediaIds: number[];
};

const DeleteMultipleAlbumMediaButton = ({ selectedAlbumMediaIds }: Props) => {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDeleteMultipleAlbumMedia = () => {
        console.log('DELETING...', selectedAlbumMediaIds);
    };

    return (
        <Fragment>
            <Button color="error" onClick={handleOpenModal} disabled={selectedAlbumMediaIds.length === 0}>
                {t('delete')}
            </Button>
            <ConfirmationModal
                open={openModal}
                onClose={handleCloseModal}
                onConfirm={handleDeleteMultipleAlbumMedia}
                content={t('delete_confirmation')}
                isLoading={isLoading}
            />
        </Fragment>
    );
};

export default DeleteMultipleAlbumMediaButton;
