import ConfirmationModal from '@/Components/ConfirmationModal';
import { EditAlbumPageProps } from '@/Pages/Album/Edit';
import { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import Button from '@mui/material/Button';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type Props = {
    selectedAlbumMediaIds: number[];
    onSuccess: () => void;
};

const BulkDeleteAlbumMediaItemsButton = ({ selectedAlbumMediaIds, onSuccess }: Props) => {
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

    const handleBulkDeleteAlbumMediaItems = () => {
        router.patch(
            route('albums.media.bulkDestroy', { album }),
            { ids: selectedAlbumMediaIds },
            {
                preserveScroll: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                onSuccess: ({ props: { message } }) => {
                    toast.success(message);
                    handleCloseModal();
                    onSuccess();
                },
                onError: (error) => toast.error(error.message),
            },
        );
    };

    return (
        <Fragment>
            <Button
                color="error"
                startIcon={<DeleteSweepOutlinedIcon />}
                onClick={handleOpenModal}
                disabled={selectedAlbumMediaIds.length === 0}
            >
                {t('bulk_delete')}
            </Button>
            <ConfirmationModal
                open={openModal}
                onClose={handleCloseModal}
                onConfirm={handleBulkDeleteAlbumMediaItems}
                content={t('delete_confirmation')}
                isLoading={isLoading}
            />
        </Fragment>
    );
};

export default BulkDeleteAlbumMediaItemsButton;
