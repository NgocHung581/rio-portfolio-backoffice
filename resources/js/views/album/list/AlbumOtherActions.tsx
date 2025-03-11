import { Album } from '@/types/album';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { Fragment, useRef, useState } from 'react';
import AlbumDeleteAction from '../shared/AlbumDeleteAction';
import AlbumDisableAction from '../shared/AlbumDisableAction';
import AlbumRestoreAction from '../shared/AlbumRestoreAction';

type Props = {
    album: Album;
};

export type AlbumActionProps<T = unknown> = T & {
    album: Album;
    onCloseMenu?: () => void;
    disabled?: boolean;
};

const AlbumOtherActions = ({ album }: Props) => {
    const containerRef = useRef<HTMLButtonElement>(null);

    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenMenu = () => {
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
    };

    return (
        <Fragment>
            <IconButton ref={containerRef} size="small" onClick={handleOpenMenu}>
                <MoreVertOutlinedIcon />
            </IconButton>
            <Menu
                open={openMenu}
                anchorEl={containerRef.current}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {!!album.deleted_at ? (
                    <AlbumRestoreAction album={album} onCloseMenu={handleCloseMenu} />
                ) : (
                    <AlbumDisableAction album={album} onCloseMenu={handleCloseMenu} />
                )}
                <AlbumDeleteAction album={album} onCloseMenu={handleCloseMenu} />
            </Menu>
        </Fragment>
    );
};

export default AlbumOtherActions;
