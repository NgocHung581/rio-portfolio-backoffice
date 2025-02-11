import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import ThemeProvider from './@core/components/ThemeProvider';
import VerticalLayout from './Layouts/VerticalLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
        let page = pages[`./Pages/${name}.tsx`] as any;

        page.default.layout =
            page.default.layout ||
            ((page: ReactNode) => <VerticalLayout children={page} />);

        return page;
    },
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(
                el,
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>,
            );
            return;
        }

        createRoot(el).render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
