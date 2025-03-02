import ConfirmationModal from '@/Components/ConfirmationModal';
import { router } from '@inertiajs/react';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AlbumActionProps } from '../list/AlbumOtherActions';

const AlbumDisableAction = ({ album, onCloseMenu }: AlbumActionProps) => {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDisableAlbum = () => {
        router.patch(route('albums.delete', album), undefined, {
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
                <MenuItem onClick={handleOpenModal}>
                    <ListItemIcon>
                        <NotInterestedOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>{t('disable')}</ListItemText>
                </MenuItem>
            )}
            {route().current('albums.edit', album) && (
                <Button color="warning" startIcon={<NotInterestedOutlinedIcon />} onClick={handleOpenModal}>
                    {t('disable')}
                </Button>
            )}
            <ConfirmationModal
                open={openModal}
                onClose={handleCloseModal}
                onConfirm={handleDisableAlbum}
                content={t('disable_confirmation')}
                isLoading={isLoading}
            />
        </Fragment>
    );
};

export default AlbumDisableAction;
