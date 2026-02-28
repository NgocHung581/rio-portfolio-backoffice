import { Link } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

type Props = {
    size?: number;
    href?: string;
};

const Logo = ({ size = 28, href }: Props) => {
    const appName = import.meta.env.VITE_APP_NAME;

    return (
        <Stack direction="row" alignItems="center" gap={2} {...(!!href && { component: Link, href })}>
            <Box display="flex" alignItems="center" justifyContent="center" width={size} height={size}>
                <img src="/images/logos/dark-logo.png" alt={appName} />
            </Box>
        </Stack>
    );
};

export default Logo;
