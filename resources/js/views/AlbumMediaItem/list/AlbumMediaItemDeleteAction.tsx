import ConfirmationModal from '@/Components/ConfirmationModal';
import { EditAlbumPageProps } from '@/Pages/Album/Edit';
import { PageProps } from '@/types';
import { AlbumMediaItem } from '@/types/album';
import { router, usePage } from '@inertiajs/react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import IconButton from '@mui/material/IconButton';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type Props = {
    albumMediaItem: AlbumMediaItem;
};

const AlbumMediaItemDeleteAction = ({ albumMediaItem }: Props) => {
    const { t } = useTranslation();
    const { album } = usePage<PageProps<EditAlbumPageProps>>().props;

    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDeleteAlbumMedia = () => {
        router.delete(route('albums.media.destroy', { album, albumMediaItem }), {
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: ({ props: { message } }) => toast.success(message),
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Fragment>
            <IconButton size="small" color="error" onClick={handleOpenModal} disabled={!!album.deleted_at}>
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
