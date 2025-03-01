import ConfirmationModal from '@/Components/ConfirmationModal';
import { AlbumMediaItem } from '@/types/album';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import IconButton from '@mui/material/IconButton';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    albumMediaItem: AlbumMediaItem;
};

const AlbumMediaItemDeleteAction = ({ albumMediaItem }: Props) => {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDeleteAlbumMedia = () => {
        console.log('DELETING...', albumMediaItem);
    };

    return (
        <Fragment>
            <IconButton size="small" color="error" onClick={handleOpenModal}>
                <DeleteOutlinedIcon />
            </IconButton>
            <ConfirmationModal
                open={openModal}
                onClose={handleCloseModal}
                onConfirm={handleDeleteAlbumMedia}
                content={t('delete_confirmation')}
                isLoading={isLoading}
            />
        </Fragment>
    );
};

export default AlbumMediaItemDeleteAction;
