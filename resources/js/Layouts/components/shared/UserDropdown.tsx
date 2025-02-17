import { useForm, usePage } from '@inertiajs/react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const UserDropdown = () => {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    const containerRef = useRef<HTMLDivElement>(null);

    const { post, processing } = useForm();

    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenMenu = () => {
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
    };

    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <Fragment>
            <Avatar ref={containerRef} onClick={handleOpenMenu} sx={{ cursor: 'pointer', width: 38, height: 38 }}>
                {auth.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Menu
                anchorEl={containerRef.current}
                open={openMenu}
                onClose={handleCloseMenu}
                disableScrollLock
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <ListItem>
                    <Stack direction="row" alignItems="center" gap={2}>
                        <Avatar>{auth.user.name.charAt(0).toUpperCase()}</Avatar>
                        <Stack>
                            <Typography variant="body2" fontWeight={500}>
                                {auth.user.name}
                            </Typography>
                            <Typography variant="caption" color="textDisabled">
                                {auth.user.email}
                            </Typography>
                        </Stack>
                    </Stack>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                    <Button
                        fullWidth
                        size="small"
                        color="error"
                        endIcon={<LogoutOutlinedIcon />}
                        loading={processing}
                        onClick={handleLogout}
                    >
                        {t('logout')}
                    </Button>
                </ListItem>
            </Menu>
        </Fragment>
    );
};

export default UserDropdown;
