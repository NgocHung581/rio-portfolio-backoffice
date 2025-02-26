import ConfirmationModal from '@/Components/ConfirmationModal';
import { router } from '@inertiajs/react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AlbumActionProps } from '../list/AlbumOtherActions';

const AlbumDeleteAction = ({ album, onCloseMenu }: AlbumActionProps) => {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDeleteAlbum = () => {
        router.delete(route('albums.destroyAlbum', album), {
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: ({ props: { message } }) => {
                toast.success(message);
                onCloseMenu && onCloseMenu();
            },
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Fragment>
            {route().current('albums.index') && (
                <Fragment>
                    <Divider />
                    <MenuItem onClick={handleOpenModal}>
                        <ListItemIcon>
                            <DeleteOutlinedIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary={t('delete')} slotProps={{ primary: { color: 'error' } }} />
                    </MenuItem>
                </Fragment>
            )}
            {route().current('albums.edit', album) && (
                <Button color="error" onClick={handleOpenModal}>
                    {t('delete')}
                </Button>
            )}
            <ConfirmationModal
                open={openModal}
                onClose={handleCloseModal}
                onConfirm={handleDeleteAlbum}
                content={t('delete_confirmation')}
                isLoading={isLoading}
            />
        </Fragment>
    );
};

export default AlbumDeleteAction;
