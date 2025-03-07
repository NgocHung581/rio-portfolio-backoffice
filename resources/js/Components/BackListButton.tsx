import { router } from '@inertiajs/react';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import Button from '@mui/material/Button';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from './ConfirmationModal';

type Props = {
    href: string;
    disabled?: boolean;
};

const BackListButton = ({ href, disabled }: Props) => {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleBackList = () => {
        router.get(href, undefined, {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <Fragment>
            <Button
                color="secondary"
                startIcon={<FormatListBulletedOutlinedIcon />}
                disabled={disabled}
                onClick={handleOpenModal}
            >
                {t('list')}
            </Button>

            <ConfirmationModal
                open={openModal}
                onClose={handleCloseModal}
                onConfirm={handleBackList}
                content={t('leave_page_confirmation')}
                isLoading={isLoading}
            />
        </Fragment>
    );
};

export default BackListButton;
