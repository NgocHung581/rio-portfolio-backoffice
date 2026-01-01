import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import { Breakpoint } from '@mui/material/styles';
import { ReactNode } from 'react';

type Props = {
    direction?: 'row' | 'column';
    fullWidth?: boolean;
    required?: boolean;
    label?: ReactNode;
    control: ReactNode;
    labelSize?: Partial<Record<Breakpoint, number>>;
    controlSize?: Partial<Record<Breakpoint, number>>;
};

const FormField = ({ direction = 'row', fullWidth, required, label, control, labelSize, controlSize }: Props) => {
    return (
        <Grid container spacing={1}>
            <Grid
                size={direction === 'row' ? { xs: 12, sm: 3, lg: 2, ...labelSize } : { xs: 12, ...labelSize }}
                alignSelf="center"
            >
                <FormLabel required={required}>{label}</FormLabel>
            </Grid>
            <Grid
                size={
                    direction === 'row'
                        ? { xs: 12, sm: 9, lg: fullWidth ? 10 : 5, ...controlSize }
                        : { xs: 12, ...controlSize }
                }
            >
                {control}
            </Grid>
        </Grid>
    );
};

export default FormField;
