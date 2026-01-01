import { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { changeLanguage } from 'i18next';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LocaleSwitcher = () => {
    const { t, i18n } = useTranslation();
    const { localeOptions } = usePage<PageProps>().props;

    const containerRef = useRef<HTMLButtonElement>(null);

    const [openMenu, setOpenMenu] = useState(false);

    const currentLocale = i18n.language;

    const handleOpenMenu = () => {
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
    };

    const handleChangeLanguage = (selectedLocale: string) => () => {
        if (selectedLocale !== currentLocale) {
            router.put(
                route('locale.set'),
                { locale: selectedLocale },
                {
                    onSuccess: () => changeLanguage(selectedLocale),
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }

        handleCloseMenu();
    };

    return (
        <Fragment>
            <Tooltip title={t('language')}>
                <IconButton ref={containerRef} sx={{ color: 'text.primary' }} onClick={handleOpenMenu}>
                    <TranslateOutlinedIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={containerRef.current}
                open={openMenu}
                onClose={handleCloseMenu}
                disableScrollLock
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {localeOptions.map((option) => (
                    <MenuItem
                        key={option.value}
                        selected={option.value === currentLocale}
                        onClick={handleChangeLanguage(option.value)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </Fragment>
    );
};

export default LocaleSwitcher;
