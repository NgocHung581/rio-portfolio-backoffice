import ScrollToTopButton from '@/Components/ScrollTopButton';
import { PropsWithChildren } from '@/types';
import CssBaseline from '@mui/material/CssBaseline';
import MuiThemeProvider from '@mui/material/styles/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import theme from '../../theme';

const ThemeProvider = ({ children }: PropsWithChildren) => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer autoClose={3000} />
            <ScrollToTopButton />
            {children}
        </MuiThemeProvider>
    );
};

export default ThemeProvider;
