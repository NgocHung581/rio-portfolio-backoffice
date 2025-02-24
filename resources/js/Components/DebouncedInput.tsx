import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { ChangeEvent, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
    initValue: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    delay?: number;
    placeholder?: string;
};

const DebouncedInput = ({ initValue, onChange, disabled, error, helperText, delay = 1000, placeholder }: Props) => {
    const [value, setValue] = useState(initValue);

    const debounced = useDebouncedCallback((debouncedValue) => onChange(debouncedValue), delay);

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        setValue(newValue);
        debounced(newValue);
    };

    const handleClear = () => {
        debounced.cancel();

        setValue('');
        onChange('');
    };

    return (
        <TextField
            value={value}
            onChange={handleChangeInput}
            disabled={disabled}
            error={error}
            helperText={helperText}
            placeholder={placeholder}
            slotProps={{
                input: {
                    endAdornment: !!value && (
                        <InputAdornment position="end">
                            <IconButton edge="end" onClick={handleClear}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

export default DebouncedInput;
