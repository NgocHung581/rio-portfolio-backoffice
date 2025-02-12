import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../../lang/en/translation.json';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation,
            },
        },
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: true,
        },
    });

export default i18n;
