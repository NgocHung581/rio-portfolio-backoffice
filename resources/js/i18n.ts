import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import enJson from '../lang/en.json';
import viJson from '../lang/vi.json';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enJson },
            vi: { translation: viJson },
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
            defaultVariables: {
                fileSizeUnit: 'KB',
            },
        },
        react: {
            useSuspense: true,
        },
    });

export default i18n;
