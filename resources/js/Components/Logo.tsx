import { Link } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
    size?: number;
    href?: string;
    hideText?: boolean;
};

const Logo = ({ size = 40, href, hideText }: Props) => {
    const appName = import.meta.env.VITE_APP_NAME;

    return (
        <Stack direction="row" alignItems="center" gap={2} {...(!!href && { component: Link, href })}>
            <Box display="flex" alignItems="center" justifyContent="center" width={size} height={size}>
                <img src="/images/logos/fake_app.png" alt={appName} />
            </Box>
            {!hideText && (
                <Typography variant="h5" color="inherit" noWrap>
                    {appName}
                </Typography>
            )}
        </Stack>
    );
};

export default Logo;
