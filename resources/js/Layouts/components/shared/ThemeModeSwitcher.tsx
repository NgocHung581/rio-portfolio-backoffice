import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { PaletteMode, useColorScheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ThemeModeSwitcher = () => {
    const { t } = useTranslation();
    const { mode, setMode } = useColorScheme();

    const containerRef = useRef<HTMLButtonElement>(null);

    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenMenu = () => {
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
    };

    const handleChangeMode = (selectedMode: PaletteMode) => () => {
        if (mode !== selectedMode) {
            setMode(selectedMode);
        }

        handleCloseMenu();
    };

    return (
        <Fragment>
            <Tooltip title={t('mode')}>
                <IconButton ref={containerRef} sx={{ color: 'text.primary' }} onClick={handleOpenMenu}>
                    {mode === 'light' ? (
                        <LightModeOutlinedIcon fontSize="small" />
                    ) : (
                        <DarkModeOutlinedIcon fontSize="small" />
                    )}
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={containerRef.current}
                open={openMenu}
                onClose={handleCloseMenu}
                disableScrollLock
                slotProps={{ paper: { sx: { mt: 4 } } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem selected={mode === 'light'} onClick={handleChangeMode('light')}>
                    <Stack direction="row" alignItems="center" gap={3}>
                        <LightModeOutlinedIcon />
                        <Typography color="inherit">{t('light')}</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem selected={mode === 'dark'} onClick={handleChangeMode('dark')}>
                    <Stack direction="row" alignItems="center" gap={3}>
                        <DarkModeOutlinedIcon />
                        <Typography color="inherit">{t('dark')}</Typography>
                    </Stack>
                </MenuItem>
            </Menu>
        </Fragment>
    );
};

export default ThemeModeSwitcher;
