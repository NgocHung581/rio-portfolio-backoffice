import { PropsWithChildren } from '@/types';
import { Head } from '@inertiajs/react';
import Box from '@mui/material/Box';

type Props = {
    title?: string;
};

const BlankLayout = ({ children, title }: PropsWithChildren<Props>) => {
    return (
        <Box component="main" minHeight="100vh">
            <Head title={title} />
            {children}
        </Box>
    );
};

export default BlankLayout;
