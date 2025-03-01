import { AlbumMedia } from '@/types/album';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AlbumMediaDeleteAction from './AlbumMediaDeleteAction';

type Props = {
    albumMedia: AlbumMedia;
};

const AlbumMediaRowActions = ({ albumMedia }: Props) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center">
            <IconButton size="small" color="info">
                <EditOutlinedIcon />
            </IconButton>
            <AlbumMediaDeleteAction albumMedia={albumMedia} />
        </Stack>
    );
};

export default AlbumMediaRowActions;
