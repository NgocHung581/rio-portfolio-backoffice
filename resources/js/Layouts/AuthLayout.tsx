import { PropsWithChildren } from '@/types';
import Box from '@mui/material/Box';

const AuthLayout = ({ children }: PropsWithChildren) => {
    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            {children}
        </Box>
    );
};

export default AuthLayout;
