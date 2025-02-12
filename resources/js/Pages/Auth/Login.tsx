import AuthLayout from '@/Layouts/AuthLayout';
import { useForm } from '@inertiajs/react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ChangeEvent, FormEvent, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LoginPayload = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, errors, processing, post } = useForm<LoginPayload>({
        email: '',
        password: '',
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof LoginPayload;
        const value = e.target.value;

        setData(name, value);
    };

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(data);
    };

    return (
        <Card sx={{ minWidth: 500, pt: 8, pb: 6, px: 6 }}>
            <CardHeader
                title={`${t('welcome')}!`}
                slotProps={{ title: { textAlign: 'center', fontWeight: 700, variant: 'h1' } }}
            />
            <Divider variant="middle" sx={{ mx: 40, borderBottomWidth: 2, mb: 6 }} />
            <CardContent>
                <Stack component="form" onSubmit={handleLogin} spacing={5}>
                    <FormGroup>
                        <FormLabel>{t('email')}</FormLabel>
                        <TextField
                            name="email"
                            value={data.email}
                            onChange={handleChangeInput}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>{t('password')}</FormLabel>
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            onChange={handleChangeInput}
                            error={!!errors.password}
                            helperText={errors.password}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword} edge="end">
                                                {showPassword ? (
                                                    <VisibilityOffOutlinedIcon />
                                                ) : (
                                                    <VisibilityOutlinedIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </FormGroup>
                    <Button loading={processing} type="submit">
                        {t('login')}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

LoginPage.layout = (page: ReactNode) => <AuthLayout children={page} />;

export default LoginPage;
