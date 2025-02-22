import grey from '@mui/material/colors/grey';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useColorScheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Editor } from '@tiptap/react';
import { useTranslation } from 'react-i18next';

type Props = {
    editor: Editor;
    limit: number;
};

const CharacterCount = ({ editor, limit }: Props) => {
    const { t } = useTranslation();
    const { mode } = useColorScheme();

    const characterCount = editor.storage.characterCount.characters();
    const wordCount = editor.storage.characterCount.words();
    const percentage = editor ? Math.round((100 / limit) * characterCount) : 0;

    return (
        <Paper square sx={{ px: 2.5, py: 2 }}>
            <Stack
                direction="row"
                alignItems="center"
                gap={2}
                sx={{
                    color: 'var(--mui-palette-text-secondary)',
                    '> svg': {
                        color: 'var(--mui-palette-primary-main)',
                    },
                    ...(characterCount === limit && {
                        color: 'var(--mui-palette-error-main)',
                        '> svg': {
                            color: 'var(--mui-palette-error-main)',
                        },
                    }),
                }}
            >
                <svg height="20" width="20" viewBox="0 0 20 20">
                    <circle r="10" cx="10" cy="10" fill="#e9ecef" />
                    <circle
                        r="5"
                        cx="10"
                        cy="10"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
                        transform="rotate(-90) translate(-20)"
                    />
                    <circle r="6" cx="10" cy="10" fill={mode === 'dark' ? grey[400] : 'white'} />
                </svg>
                <Typography variant="caption" color="inherit">
                    {characterCount} / {limit} {t('characters')}
                    <br />
                    {wordCount} {t('words')}
                </Typography>
            </Stack>
        </Paper>
    );
};

export default CharacterCount;
