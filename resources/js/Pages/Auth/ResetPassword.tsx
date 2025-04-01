import AuthLayout from '@/Layouts/AuthLayout';
import { PropsWithChildren } from '@/types';
import { useForm } from '@inertiajs/react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ChangeEvent, FormEvent, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type Props = {
    email: string;
    token: string;
};

type ResetPasswordFormPayload = {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
};

const ResetPasswordPage = ({ email, token }: Props) => {
    const { t } = useTranslation();

    const { data, setData, errors, clearErrors, processing, post } = useForm<ResetPasswordFormPayload>({
        email,
        token,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof ResetPasswordFormPayload;
        const value = e.target.value;

        setData(name, value);
    };

    const handleResetPassword = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        post(route('password.reset'), {
            onSuccess: ({ props: { message } }) => toast.success(message),
            onError: (error) => toast.error(error.message),
        });
    };

    const renderTogglePassword = () => {
        return (
            <InputAdornment position="end">
                <IconButton disabled={processing} onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </IconButton>
            </InputAdornment>
        );
    };

    return (
        <Stack component="form" onSubmit={handleResetPassword} spacing={4}>
            <Typography>
                <strong>{t('email')}:</strong> {data.email}
            </Typography>
            <TextField
                type={showPassword ? 'text' : 'password'}
                label={t('password')}
                name="password"
                value={data.password}
                onChange={handleChangeInput}
                error={!!errors.password}
                helperText={errors.password}
                disabled={processing}
                slotProps={{
                    input: { endAdornment: renderTogglePassword() },
                    inputLabel: { required: true },
                }}
            />
            <TextField
                type={showPassword ? 'text' : 'password'}
                label={t('confirm_password')}
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={handleChangeInput}
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation}
                disabled={processing}
                slotProps={{
                    input: { endAdornment: renderTogglePassword() },
                    inputLabel: { required: true },
                }}
            />
            <Button type="submit" loading={processing}>
                {t('reset_password')}
            </Button>
        </Stack>
    );
};

const Layout = ({ children }: PropsWithChildren) => {
    const { t } = useTranslation();

    return (
        <AuthLayout title={t('reset_your_password')} header={t('reset_your_password')}>
            {children}
        </AuthLayout>
    );
};

ResetPasswordPage.layout = (page: ReactNode) => <Layout>{page}</Layout>;

export default ResetPasswordPage;
