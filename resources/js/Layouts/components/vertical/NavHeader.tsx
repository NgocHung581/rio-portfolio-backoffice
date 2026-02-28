import Logo from '@/Components/Logo';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
    isCollapsedNav: boolean;
    isHoveredNav: boolean;
    onToggleNav: () => void;
    onCloseMobileNav: () => void;
};

const NavHeader = ({ isCollapsedNav, isHoveredNav, onToggleNav, onCloseMobileNav }: Props) => {
    const isDownLgScreen = useMediaQuery((theme) => theme.breakpoints.down('lg'));

    const handleClickIcon = () => {
        if (!isDownLgScreen) {
            onToggleNav();
        } else {
            onCloseMobileNav();
        }
    };

    return (
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'inherit !important', color: 'inherit !important' }}>
            <Toolbar
                sx={(theme) => ({
                    justifyContent: isDownLgScreen
                        ? 'space-between'
                        : isCollapsedNav && !isHoveredNav
                          ? 'center'
                          : 'space-between',
                    gap: 4,
                    transition: theme.transitions.create('padding'),
                    ...(isCollapsedNav && !isHoveredNav && { px: { lg: 4 } }),
                    pl: { xs: 5.5 },
                    pr: { xs: 4 },
                })}
            >
                <Logo href="/" />

                <IconButton
                    color="inherit"
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    onClick={handleClickIcon}
                    sx={{
                        p: 0,
                        ...(!isDownLgScreen && { display: isCollapsedNav && !isHoveredNav ? 'none' : 'flex' }),
                    }}
                >
                    {isDownLgScreen ? (
                        <CloseIcon fontSize="small" />
                    ) : (
                        <KeyboardDoubleArrowLeftIcon
                            sx={{
                                transform: isCollapsedNav ? 'rotate(180deg)' : 'rotate(0)',
                                transition: (theme) => theme.transitions.create('transform'),
                            }}
                        />
                    )}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default NavHeader;
