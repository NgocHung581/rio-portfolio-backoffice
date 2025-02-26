import { PropsWithChildren } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageProvider = ({ children }: PropsWithChildren) => {
    const { i18n } = useTranslation();

    useEffect(() => {
        router.put(route('locale.update'), { locale: i18n.language });
    }, []);

    return children;
};

export default LanguageProvider;
