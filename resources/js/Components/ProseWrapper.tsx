import Box from '@mui/material/Box';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren;

const ProseWrapper = ({ children }: Props) => {
    return (
        <Box
            sx={(theme) => ({
                '& :where(p)': {
                    mb: 4,
                    ':last-child': {
                        mb: 0,
                    },
                },
                '& :where(blockquote)': {
                    fontWeight: 500,
                    fontStyle: 'italic',
                    my: 5,
                    pl: 4,
                    mx: { xs: 2, md: 10 },
                    borderLeft: 4,
                    borderLeftColor: 'primary.main',
                    ...theme.applyStyles('light', {
                        color: 'black',
                    }),
                    ...theme.applyStyles('dark', {
                        color: 'white',
                    }),
                },
                '& :where(ul), & :where(ol)': {
                    my: 5,
                    pl: { xs: 6, lg: 10 },
                },
                '& :where(ol)': {
                    listStyle: 'auto',
                },
                '& :where(ul)': {
                    listStyle: 'disc',
                    '& :where(ul)': {
                        listStyle: 'circle',
                    },
                },
                '& :where(li)': {
                    pl: 2,
                    my: 2,
                    listStyle: 'inherit',
                },
                '& :where(a)': {
                    textDecoration: 'underline',
                    fontWeight: 500,
                    color: 'primary.main',
                    '&:hover': {
                        color: 'primary.dark',
                    },
                },
            })}
        >
            {children}
        </Box>
    );
};

export default ProseWrapper;
