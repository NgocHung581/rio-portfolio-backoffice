import { PropsWithChildren } from '@/types';
import iconButtonClasses from '@mui/material/IconButton/iconButtonClasses';
import Stack from '@mui/material/Stack';

type Props = {
    error?: boolean;
    height?: number | string;
    disabled?: boolean;
};

const TiptapWrapper = ({ children, error, height, disabled }: PropsWithChildren<Props>) => {
    return (
        <Stack
            sx={(theme) => ({
                border: 1,
                borderColor: error ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-action-disabled)',
                borderRadius: theme.spacing(2),
                overflow: 'hidden',
                position: 'relative',
                ...(!disabled && {
                    ':hover': {
                        borderColor: error ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-text-primary)',
                    },
                }),
                ':focus-within': {
                    borderColor: error ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-primary-main)',
                    boxShadow: `0 0 0 1px ${error ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-primary-main)'}`,
                },
                '.tiptap-wrapper': {
                    borderTop: 1,
                    borderBottom: 1,
                    borderColor: 'var(--mui-palette-divider)',
                    maxHeight: 1,
                    height,
                    overflow: 'auto',
                    '.tiptap': {
                        outline: 'none',
                        minHeight: 1,
                        px: 3.5,
                        py: 2.125,
                        fontFamily: theme.typography.fontFamily,
                        a: {
                            color: 'var(--mui-palette-primary-main)',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        },
                    },
                },
                [`.${iconButtonClasses.root}`]: {
                    borderRadius: theme.spacing(2),
                    ':hover': {
                        bgcolor: 'var(--mui-palette-action-selected)',
                    },
                    '&.tiptap-action-active': {
                        bgcolor: 'var(--mui-palette-primary-darkOpacity)',
                        color: 'var(--mui-palette-primary-main)',
                        ':hover': {
                            bgcolor: 'var(--mui-palette-primary-darkerOpacity)',
                        },
                    },
                },
            })}
        >
            {children}
        </Stack>
    );
};

export default TiptapWrapper;
