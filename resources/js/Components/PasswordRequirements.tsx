import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { useTranslation } from 'react-i18next';

// Mirrors the server rule: Password::min(10)->letters()->mixedCase()->numbers()->symbols().
export const PASSWORD_MIN_LENGTH = 10;

const REQUIREMENTS = [
    { key: 'password_rule_length', test: (password: string) => password.length >= PASSWORD_MIN_LENGTH },
    {
        key: 'password_rule_mixed_case',
        test: (password: string) => /\p{Ll}/u.test(password) && /\p{Lu}/u.test(password),
    },
    { key: 'password_rule_number', test: (password: string) => /\p{N}/u.test(password) },
    { key: 'password_rule_symbol', test: (password: string) => /[\p{P}\p{S}\p{Z}]/u.test(password) },
] as const;

type Props = {
    password: string;
};

/**
 * The password rules, ticked off while typing, so they are known before saving.
 */
const PasswordRequirements = ({ password }: Props) => {
    const { t } = useTranslation();

    return (
        <Stack
            component="ul"
            aria-label={t('password_requirements')}
            m={0}
            mt={2}
            p={0}
            gap={1}
            sx={{
                listStyle: 'none',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
        >
            {REQUIREMENTS.map(({ key, test }) => {
                const isMet = test(password);

                return (
                    <Stack
                        key={key}
                        component="li"
                        direction="row"
                        alignItems="center"
                        gap={1.5}
                        color={isMet ? 'success.main' : 'text.disabled'}
                    >
                        {isMet ? (
                            <CheckCircleIcon sx={{ fontSize: 16 }} />
                        ) : (
                            <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
                        )}
                        <Typography variant="body2" color={isMet ? 'textPrimary' : 'textSecondary'}>
                            {t(key, { count: PASSWORD_MIN_LENGTH })}
                            <Typography component="span" variant="body2" sx={visuallyHidden}>
                                {isMet ? `, ${t('done')}` : ''}
                            </Typography>
                        </Typography>
                    </Stack>
                );
            })}
        </Stack>
    );
};

export default PasswordRequirements;
