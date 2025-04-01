import { PropsWithChildren } from '@/types';
import { Head } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { ReactNode } from 'react';

type Props = {
    header: ReactNode;
    subheader?: ReactNode;
    title?: string;
};

const AuthLayout = ({ children, header, subheader, title }: PropsWithChildren<Props>) => {
    return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
            <Head title={title} />
            <Card sx={{ width: { xs: 1, sm: 500 }, py: 6, px: { xs: 2, sm: 6 }, mx: 4 }}>
                <CardHeader
                    title={header}
                    subheader={subheader}
                    slotProps={{
                        title: { textAlign: 'center', fontWeight: 700, variant: 'h1' },
                        subheader: { textAlign: 'center' },
                    }}
                />
                <CardContent>{children}</CardContent>
            </Card>
        </Box>
    );
};

export default AuthLayout;
