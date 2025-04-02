import BlankLayout from '@/Layouts/BlankLayout';
import { Link } from '@inertiajs/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

type Props = {
    status: number;
};

const ErrorPage = ({ status }: Props) => {
    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status];

    return (
        <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap={6}
                divider={<Divider flexItem orientation="vertical" />}
            >
                <Typography variant="h4">{status}</Typography>
                <Stack alignItems="start" gap={2}>
                    <Typography>{description}</Typography>
                    <Button LinkComponent={Link} href={route('dashboard')} startIcon={<ArrowBackIcon />}>
                        Dashboard
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

ErrorPage.layout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default ErrorPage;
