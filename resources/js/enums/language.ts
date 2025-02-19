import { Option } from '@/types';

export enum Language {
    English = 'en',
    Vietnamese = 'vi',
}

export const getLanguageOptions = (): Option<Language>[] => {
    return [
        { value: Language.English, label: 'english' },
        { value: Language.Vietnamese, label: 'vietnamese' },
    ];
};
