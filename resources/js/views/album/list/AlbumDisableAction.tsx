import ConfirmationModal from '@/Components/ConfirmationModal';
import { router } from '@inertiajs/react';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AlbumActionProps } from './AlbumOtherActions';

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
        router.patch(route('albums.deleteAlbum', album), undefined, {
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
                    <NotInterestedOutlinedIcon />
                </ListItemIcon>
                <ListItemText>{t('disable')}</ListItemText>
            </MenuItem>

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
