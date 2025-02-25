import ConfirmationModal from '@/Components/ConfirmationModal';
import { router } from '@inertiajs/react';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AlbumActionProps } from './AlbumOtherActions';

const AlbumRestoreAction = ({ album, onCloseMenu }: AlbumActionProps) => {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleRestoreAlbum = () => {
        router.patch(route('albums.restoreAlbum', album), undefined, {
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: ({ props: { message } }) => {
                toast.success(message);
                onCloseMenu();
            },
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Fragment>
            <MenuItem onClick={handleOpenModal}>
                <ListItemIcon>
                    <RestoreOutlinedIcon />
                </ListItemIcon>
                <ListItemText>{t('restore')}</ListItemText>
            </MenuItem>

            <ConfirmationModal
                open={openModal}
                onClose={handleCloseModal}
                onConfirm={handleRestoreAlbum}
                content={t('restore_confirmation')}
                isLoading={isLoading}
            />
        </Fragment>
    );
};

export default AlbumRestoreAction;
