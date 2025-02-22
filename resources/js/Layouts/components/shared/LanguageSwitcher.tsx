import { getLanguageOptions, Language } from '@/enums/language';
import { router } from '@inertiajs/react';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { changeLanguage } from 'i18next';
import { Fragment, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation();

    const containerRef = useRef<HTMLButtonElement>(null);

    const [openMenu, setOpenMenu] = useState(false);

    const languageOptions = useMemo(getLanguageOptions, []);

    const currentLang = i18n.language;

    const handleOpenMenu = () => {
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
    };

    const handleChangeLanguage = (selectedLang: Language) => () => {
        if (selectedLang !== currentLang) {
            router.put(
                route('locale.update'),
                { locale: selectedLang },
                { onSuccess: () => changeLanguage(selectedLang), preserveScroll: true },
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
                slotProps={{ paper: { sx: { mt: 4 } } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {languageOptions.map((option) => (
                    <MenuItem
                        key={option.value}
                        selected={option.value === currentLang}
                        onClick={handleChangeLanguage(option.value)}
                    >
                        {t(option.label)}
                    </MenuItem>
                ))}
            </Menu>
        </Fragment>
    );
};

export default LanguageSwitcher;
