import { PropsWithChildren } from '@/types';
import LanguageProvider from './LanguageProvider';
import ThemeProvider from './ThemeProvider';

const Providers = ({ children }: PropsWithChildren) => {
    return (
        <LanguageProvider>
            <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
    );
};

export default Providers;
