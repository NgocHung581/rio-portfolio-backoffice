import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { ReactNode } from 'react';
import ReactDOMServer from 'react-dom/server';
import { RouteName } from 'ziggy-js';
import { route } from '../../vendor/tightenco/ziggy';
import ThemeProvider from './@core/components/ThemeProvider';
import './i18n';
import VerticalLayout from './Layouts/VerticalLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => {
            const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
            let page = pages[`./Pages/${name}.tsx`] as any;

            page.default.layout = page.default.layout || ((page: ReactNode) => <VerticalLayout children={page} />);

            return page;
        },
        setup: ({ App, props }) => {
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });

            return (
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            );
        },
    }),
);
