import { Language } from '@/enums/language';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTranslation } from 'react-i18next';

export const CONTENT_LANGUAGES = [Language.English, Language.Vietnamese] as const;

type ErrorBag = Partial<Record<string, string>>;

/**
 * Count the errors of translatable fields named `{field}_{language}`, e.g. `title_en`.
 */
export const countLanguageErrors = (errors: ErrorBag, fields: readonly string[], language: Language) =>
    fields.filter((field) => !!errors[`${field}_${language}`]).length;

/**
 * Find the language to show after a failed submit: keep the current one if it has errors, otherwise the first one
 * that does.
 */
export const findLanguageToShow = (errors: ErrorBag, fields: readonly string[], current: Language) =>
    countLanguageErrors(errors, fields, current)
        ? current
        : (CONTENT_LANGUAGES.find((language) => countLanguageErrors(errors, fields, language)) ?? current);

const useLanguageLabel = () => {
    const { t } = useTranslation();

    return (language: Language) => t(language === Language.English ? 'english' : 'vietnamese');
};

type Props = {
    value: Language;
    onChange: (language: Language) => void;
    errors: ErrorBag;
    /** The translatable field names, without the language suffix. */
    fields: readonly string[];
};

/**
 * Tabs for switching the language of translatable fields. A tab with errors turns red and shows how many.
 */
const LanguageTabs = ({ value, onChange, errors, fields }: Props) => {
    const { t } = useTranslation();
    const getLanguageLabel = useLanguageLabel();

    return (
        <Tabs
            value={value}
            onChange={(_, language: Language) => onChange(language)}
            sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
        >
            {CONTENT_LANGUAGES.map((language) => {
                const errorCount = countLanguageErrors(errors, fields, language);

                return (
                    <Tab
                        key={language}
                        value={language}
                        iconPosition="start"
                        icon={errorCount ? <ErrorOutlineIcon fontSize="small" /> : undefined}
                        label={
                            errorCount
                                ? `${getLanguageLabel(language)} (${t('error_count', { count: errorCount })})`
                                : getLanguageLabel(language)
                        }
                        sx={{
                            minHeight: 48,
                            gap: 1.5,
                            textTransform: 'none',
                            fontSize: 15,
                            ...(errorCount && { '&, &.Mui-selected': { color: 'error.main', fontWeight: 600 } }),
                        }}
                    />
                );
            })}
        </Tabs>
    );
};

/**
 * Point to the other language tabs that have errors, since their fields are hidden.
 */
export const OtherLanguageErrorAlerts = ({ value, onChange, errors, fields }: Props) => {
    const { t } = useTranslation();
    const getLanguageLabel = useLanguageLabel();

    return CONTENT_LANGUAGES.filter(
        (language) => language !== value && countLanguageErrors(errors, fields, language),
    ).map((language) => (
        <Alert
            key={language}
            severity="error"
            action={
                <Button color="inherit" size="small" variant="outlined" onClick={() => onChange(language)}>
                    {t('go_to_tab', { tab: getLanguageLabel(language) })}
                </Button>
            }
            sx={{ alignItems: 'center' }}
        >
            {t('tab_has_errors', {
                tab: getLanguageLabel(language),
                count: countLanguageErrors(errors, fields, language),
            })}
        </Alert>
    ));
};

export default LanguageTabs;
