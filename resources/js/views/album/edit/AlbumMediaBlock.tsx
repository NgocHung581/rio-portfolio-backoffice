import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import AlbumMediaListTable from './AlbumMediaListTable';

const AlbumMediaBlock = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader title={t('media_of_album')} />
            <Divider />
            <CardContent>
                <AlbumMediaListTable />
            </CardContent>
        </Card>
    );
};

export default AlbumMediaBlock;
