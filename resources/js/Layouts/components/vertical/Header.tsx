import useVerticalNav from '@/@menu/hooks/useVericalNav';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import ThemeModeSwitcher from '../shared/ThemeModeSwitcher';
import UserDropdown from '../shared/UserDropdown';

const Header = () => {
    const { setOpenMobileNav } = useVerticalNav();

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    const handleOpenMobileNav = () => {
        setOpenMobileNav(true);
    };

    return (
        <AppBar
            position="sticky"
            sx={(theme) => ({
                borderBottomLeftRadius: theme.shape.borderRadius,
                borderBottomRightRadius: theme.shape.borderRadius,
                bgcolor: trigger
                    ? 'rgb(var(--mui-palette-background-paperChannel) / 0.85) !important'
                    : 'transparent !important',
                backdropFilter: 'blur(9px)',
                transition: theme.transitions.create(['background-color', 'box-shadow']),
            })}
            elevation={trigger ? undefined : 0}
        >
            <Toolbar
                sx={{ px: { xs: 0, sm: trigger ? 6 : 0 }, transition: (theme) => theme.transitions.create('padding') }}
            >
                <Box flex={1}>
                    <IconButton
                        color="inherit"
                        disableFocusRipple
                        disableRipple
                        disableTouchRipple
                        onClick={handleOpenMobileNav}
                        sx={{ p: 0, display: { lg: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Stack direction="row" alignItems="center" gap={2}>
                    <Stack direction="row" alignItems="center">
                        <LanguageSwitcher />
                        <ThemeModeSwitcher />
                    </Stack>
                    <UserDropdown />
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
