import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import { EditAlbumPageProps } from '../Edit';

const AlbumMediaBlock = () => {
    const { t } = useTranslation();
    const { album } = usePage<PageProps<EditAlbumPageProps>>().props;

    return (
        <Card>
            <CardHeader title={t('media_of_album')} />
            <Divider />
            <CardContent>Content</CardContent>
        </Card>
    );
};

export default AlbumMediaBlock;
