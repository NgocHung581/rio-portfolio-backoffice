import AuthLayout from '@/Layouts/AuthLayout';
import { PropsWithChildren } from '@/types';
import { useForm } from '@inertiajs/react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FormEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type ForgotPasswordFormPayload = {
    email: string;
};

const ForgotPasswordPage = () => {
    const { t } = useTranslation();

    const { data, setData, errors, clearErrors, reset, processing, post } = useForm<ForgotPasswordFormPayload>({
        email: '',
    });

    const handleSend = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        post(route('password.sendResetLink'), {
            onSuccess: ({ props: { message } }) => {
                toast.success(message);
                reset();
            },
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Stack component="form" onSubmit={handleSend} spacing={4}>
            <TextField
                label={t('email')}
                name="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                disabled={processing}
                slotProps={{ inputLabel: { required: true } }}
            />
            <Button type="submit" loading={processing}>
                {t('send')}
            </Button>
        </Stack>
    );
};

const Layout = ({ children }: PropsWithChildren) => {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('reset_your_password')}
            header={t('reset_your_password')}
            subheader={t('password_reset_prompt')}
        >
            {children}
        </AuthLayout>
    );
};

ForgotPasswordPage.layout = (page: ReactNode) => <Layout>{page}</Layout>;

export default ForgotPasswordPage;
