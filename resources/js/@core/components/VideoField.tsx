import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChangeEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import VisuallyHiddenInput from './mui/VisuallyHiddenInput';

type Props = {
    value: File | undefined;
    onChange: (file: File | undefined) => void;
    maxSize?: number;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    onError?: (errorMessage: string) => void;
    onDeleteVideo: () => void;
};

const VideoField = ({ value, onChange, maxSize, disabled, error, helperText, onDeleteVideo, onError }: Props) => {
    const { t } = useTranslation();

    const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (maxSize && file.size > maxSize) {
                onError?.(t('messages.file_too_large', { max: maxSize, fileSizeUnit: 'GB' }));

                return;
            }

            onChange(file);
        }
    };

    return (
        <FormControl>
            <Stack direction="row" alignItems="center" gap={2}>
                <Button
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadOutlinedIcon />}
                    disabled={disabled}
                >
                    {t('choose_file')}
                    <VisuallyHiddenInput type="file" onChange={handleChangeFile} accept="video/*" />
                </Button>
                {!!value && (
                    <Fragment>
                        <Typography>{value.name}</Typography>
                        <IconButton size="small" color="error" onClick={onDeleteVideo} disabled={disabled}>
                            <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Fragment>
                )}
            </Stack>
            {!!helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default VideoField;
