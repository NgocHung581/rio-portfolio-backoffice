import { useForm, usePage } from '@inertiajs/react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ListItemButton from '@mui/material/ListItemButton';
import Modal from '@/Components/Modal';
import FormField from '@/Components/FormField';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { toast } from 'react-toastify';

type ProfileFormData = {
    name: string;
    password: string;
    password_confirmation: string;
};

const UserDropdown = () => {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    const containerRef = useRef<HTMLDivElement>(null);

    const { post, processing } = useForm();

    const [openMenu, setOpenMenu] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const profileForm = useForm<ProfileFormData>({
        name: auth.user.name,
        password: '',
        password_confirmation: '',
    });

    const handleOpenMenu = () => {
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
        setShowPassword(false);
        profileForm.clearErrors();
        profileForm.reset('password', 'password_confirmation');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleLogout = () => {
        post(route('logout'));
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const renderTogglePassword = () => {
        return (
            <InputAdornment position="end">
                <IconButton disabled={profileForm.processing} onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </IconButton>
            </InputAdornment>
        );
    };

    const handleSaveProfile = () => {
        profileForm.put(route('updateProfile'), {
            preserveScroll: true,
            preserveState: true,
            onStart: () => profileForm.clearErrors(),
            onSuccess: ({ props: { message } }) => {
                toast.success(message);
                handleCloseModal();
            },
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Fragment>
            <Avatar ref={containerRef} onClick={handleOpenMenu} sx={{ cursor: 'pointer', width: 38, height: 38 }}>
                {auth.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Menu
                anchorEl={containerRef.current}
                open={openMenu}
                onClose={handleCloseMenu}
                disableScrollLock
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <ListItem>
                    <Stack direction="row" alignItems="center" gap={2}>
                        <Avatar>{auth.user.name.charAt(0).toUpperCase()}</Avatar>
                        <Stack>
                            <Typography variant="body2" fontWeight={500}>
                                {auth.user.name}
                            </Typography>
                            <Typography variant="caption" color="textDisabled">
                                {auth.user.email}
                            </Typography>
                        </Stack>
                    </Stack>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItemButton sx={{ gap: 2 }} onClick={handleOpenModal}>
                    <ListItemIcon>
                        <PersonOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('my_profile')} />
                </ListItemButton>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                    <Button
                        fullWidth
                        size="small"
                        color="error"
                        endIcon={<LogoutOutlinedIcon />}
                        loading={processing}
                        onClick={handleLogout}
                    >
                        {t('logout')}
                    </Button>
                </ListItem>
            </Menu>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                title={t('edit_profile')}
                isLoading={profileForm.processing}
                closeText={t('cancel')}
                okText={t('save')}
                maxWidth="xs"
                onOk={handleSaveProfile}
            >
                <Stack spacing={4}>
                    <FormField
                        control={
                            <TextField
                                fullWidth
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                error={!!profileForm.errors.name}
                                helperText={profileForm.errors.name}
                                disabled={profileForm.processing}
                            />
                        }
                        label={t('full_name')}
                        required
                        direction="column"
                    />
                    <FormField
                        control={
                            <TextField
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={profileForm.data.password}
                                onChange={(e) => profileForm.setData('password', e.target.value)}
                                error={!!profileForm.errors.password}
                                helperText={profileForm.errors.password}
                                disabled={profileForm.processing}
                                slotProps={{ input: { endAdornment: renderTogglePassword() } }}
                            />
                        }
                        label={t('password')}
                        direction="column"
                    />
                    <FormField
                        control={
                            <TextField
                                type={showPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={profileForm.data.password_confirmation}
                                onChange={(e) => profileForm.setData('password_confirmation', e.target.value)}
                                error={!!profileForm.errors.password_confirmation}
                                helperText={profileForm.errors.password_confirmation}
                                disabled={profileForm.processing}
                                slotProps={{ input: { endAdornment: renderTogglePassword() } }}
                            />
                        }
                        label={t('password_confirmation')}
                        direction="column"
                    />
                </Stack>
            </Modal>
        </Fragment>
    );
};

export default UserDropdown;
