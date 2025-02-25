import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { EditAlbumPageProps } from '../../../Pages/Album/Edit';

type Props = {};

const AlbumMediaListTable = (props: Props) => {
    const { album } = usePage<PageProps<EditAlbumPageProps>>().props;

    return <div>AlbumMediaListTable</div>;
};

export default AlbumMediaListTable;
