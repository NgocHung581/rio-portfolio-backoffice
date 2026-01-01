import { VerticalNavProvider } from '@/@menu/contexts/verticalNavContext';
import { PropsWithChildren } from '@/types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Header from './components/vertical/Header';
import Navigation from './components/vertical/Navigation';

const VerticalLayout = ({ children }: PropsWithChildren) => {
    return (
        <VerticalNavProvider>
            <Stack direction="row" minHeight="100vh">
                <Navigation />
                <Box flex={1} minWidth={0}>
                    <Stack height={1} px={6}>
                        <Header />
                        <Box component="main" flex={1} pb={6}>
                            {children}
                        </Box>
                    </Stack>
                </Box>
            </Stack>
        </VerticalNavProvider>
    );
};

export default VerticalLayout;
