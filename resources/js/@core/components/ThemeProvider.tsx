import { PropsWithChildren } from '@/types';
import CssBaseline from '@mui/material/CssBaseline';
import MuiThemeProvider from '@mui/material/styles/ThemeProvider';
import theme from '../theme';

const ThemeProvider = ({ children }: PropsWithChildren) => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
};

export default ThemeProvider;
