import { Language } from '@/enums/language';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { t } = useTranslation();

    const containerRef = useRef<HTMLButtonElement>(null);

    const [openMenu, setOpenMenu] = useState(false);
    const [activeLang, setActiveLang] = useState<Language>(Language.English);

    const handleOpenMenu = () => {
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
    };

    const handleChangeLanguage = (selectedLang: Language) => () => {
        if (selectedLang !== activeLang) {
            setActiveLang(selectedLang);
        }

        handleCloseMenu();
    };

    return (
        <Fragment>
            <IconButton ref={containerRef} sx={{ color: 'text.primary' }} onClick={handleOpenMenu}>
                <TranslateOutlinedIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={containerRef.current}
                open={openMenu}
                onClose={handleCloseMenu}
                disableScrollLock
                slotProps={{ paper: { sx: { mt: 4 } } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem selected={activeLang === Language.English} onClick={handleChangeLanguage(Language.English)}>
                    {t('english')}
                </MenuItem>
                <MenuItem
                    selected={activeLang === Language.Vietnamese}
                    onClick={handleChangeLanguage(Language.Vietnamese)}
                >
                    {t('vietnamese')}
                </MenuItem>
            </Menu>
        </Fragment>
    );
};

export default LanguageSwitcher;
