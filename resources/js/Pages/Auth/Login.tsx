import AuthLayout from '@/Layouts/AuthLayout';
import { PropsWithChildren } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ChangeEvent, FormEvent, ReactNode, SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LoginFormPayload = {
    email: string;
    password: string;
    remember: boolean;
};

const LoginPage = () => {
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, errors, processing, post } = useForm<LoginFormPayload>({
        email: '',
        password: '',
        remember: false,
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof LoginFormPayload;
        const value = e.target.value;

        setData(name, value);
    };

    const handleToggleRememberMe = (_: SyntheticEvent, checked: boolean) => {
        setData('remember', checked);
    };

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <Stack component="form" onSubmit={handleLogin} spacing={4}>
            <TextField
                name="email"
                label={t('email')}
                value={data.email}
                onChange={handleChangeInput}
                error={!!errors.email}
                helperText={errors.email}
                disabled={processing}
                slotProps={{ inputLabel: { required: true } }}
            />
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
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton disabled={processing} onClick={handleTogglePassword} edge="end">
                                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                    inputLabel: { required: true },
                }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <FormControlLabel
                    name="remember"
                    checked={data.remember}
                    onChange={handleToggleRememberMe}
                    control={<Checkbox size="small" />}
                    label={t('remember_me')}
                    disabled={processing}
                    slotProps={{ typography: { variant: 'body2' } }}
                />
                <MuiLink component={Link} href={route('password.request')} variant="body2" underline="hover">
                    {t('forgot_password')}?
                </MuiLink>
            </Stack>
            <Button type="submit" loading={processing}>
                {t('login')}
            </Button>
        </Stack>
    );
};

const Layout = ({ children }: PropsWithChildren) => {
    const { t } = useTranslation();

    return (
        <AuthLayout title={t('login')} header={`${t('welcome')} 👋🏻`}>
            {children}
        </AuthLayout>
    );
};

LoginPage.layout = (page: ReactNode) => <Layout>{page}</Layout>;

export default LoginPage;
