import { Album } from '@/types/album';
import { Link } from '@inertiajs/react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AlbumOtherActions from './AlbumOtherActions';

type Props = {
    album: Album;
};

const AlbumRowActions = ({ album }: Props) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center">
            <IconButton size="small" LinkComponent={Link} href={route('albums.edit', album)}>
                <EditOutlinedIcon />
            </IconButton>
            <AlbumOtherActions album={album} />
        </Stack>
    );
};

export default AlbumRowActions;
