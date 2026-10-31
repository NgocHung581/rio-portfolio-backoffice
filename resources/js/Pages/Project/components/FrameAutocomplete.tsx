import { Option } from '@/types';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { SxProps, Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import FrameGlyph from './FrameGlyph';

type Props = {
    value: string;
    options: Option<string>[];
    onChange: (frame: string) => void;
    disabled?: boolean;
    error?: boolean;
    sx?: SxProps<Theme>;
};

// Match the label ("4:3") as well as the raw value ("4/3"), so either way of typing a ratio finds it.
const filterOptions = createFilterOptions<Option<string>>({
    stringify: (option) => `${option.label} ${option.value}`,
});

/**
 * Pick a media frame by typing a ratio or choosing from the list. Each option shows the shape of its frame.
 */
const FrameAutocomplete = ({ value, options, onChange, disabled, error, sx }: Props) => {
    const { t } = useTranslation();
    const selectedOption = options.find((option) => option.value === value) ?? null;

    return (
        <Autocomplete
            size="small"
            disableClearable
            autoHighlight
            openOnFocus
            selectOnFocus
            options={options}
            value={selectedOption as Option<string>}
            onChange={(_, option) => onChange(option.value)}
            isOptionEqualToValue={(option, selected) => option.value === selected.value}
            filterOptions={filterOptions}
            disabled={disabled}
            noOptionsText={t('no_data_available')}
            renderOption={({ key, ...props }, option) => (
                <Box component="li" key={key} {...props} sx={{ gap: 2.5 }}>
                    <Box width={16} display="flex" justifyContent="center">
                        <FrameGlyph frame={option.value} />
                    </Box>
                    {option.label}
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={error}
                    slotProps={{
                        htmlInput: { ...params.inputProps, 'aria-label': t('frame') },
                        input: {
                            ...params.InputProps,
                            startAdornment: (
                                <Box display="flex" alignItems="center" width={16} justifyContent="center" mr={1}>
                                    <FrameGlyph frame={value} size={14} />
                                </Box>
                            ),
                        },
                    }}
                />
            )}
            sx={sx}
        />
    );
};

export default FrameAutocomplete;
