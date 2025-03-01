import { AlbumMediaItem } from '@/types/album';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AlbumMediaItemDeleteAction from './AlbumMediaItemDeleteAction';

type Props = {
    albumMediaItem: AlbumMediaItem;
};

const AlbumMediaItemRowActions = ({ albumMediaItem }: Props) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center">
            <IconButton size="small" color="info">
                <EditOutlinedIcon />
            </IconButton>
            <AlbumMediaItemDeleteAction albumMediaItem={albumMediaItem} />
        </Stack>
    );
};

export default AlbumMediaItemRowActions;
