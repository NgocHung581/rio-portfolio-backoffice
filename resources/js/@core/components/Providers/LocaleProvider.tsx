import { PropsWithChildren } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LocaleProvider = ({ children }: PropsWithChildren) => {
    const { i18n } = useTranslation();

    useEffect(() => {
        router.put(route('locale.set'), { locale: i18n.language }, { preserveScroll: true });
    }, []);

    return children;
};

export default LocaleProvider;
