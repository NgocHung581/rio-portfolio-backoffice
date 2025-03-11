import { PropsWithChildren } from '@/types';
import LocaleProvider from './LocaleProvider';
import ThemeProvider from './ThemeProvider';

const Providers = ({ children }: PropsWithChildren) => {
    return (
        <LocaleProvider>
            <ThemeProvider>{children}</ThemeProvider>
        </LocaleProvider>
    );
};

export default Providers;
