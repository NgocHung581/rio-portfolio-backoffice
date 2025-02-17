import { Head } from '@inertiajs/react';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';

export default function Dashboard() {
    return (
        <Fragment>
            <Head title="Dashboard" />
            <Typography variant="h1">Dashboard</Typography>
        </Fragment>
    );
}
