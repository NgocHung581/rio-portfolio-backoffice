import CircularProgressWithLabel from '@/Components/CircularProgressWithLabel';
import { convertBytes } from '@/utils/file';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Accept, ErrorCode, FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

type SingleFileProps = {
    multiple?: false;
    onUpload: (file: File) => void;
};

type MultipleFilesProps = {
    multiple: true;
    onUpload: (files: File[]) => void;
};

type Props = (SingleFileProps | MultipleFilesProps) & {
    accept?: Accept;
    hasError?: boolean;
    disabled?: boolean;
    height?: number;
    maxFileSize?: number;
    onError?: (message: string) => void;
    maxFiles?: number;
    progress?: number;
};

const FileDropzone = ({
    accept,
    hasError,
    disabled,
    height = 300,
    maxFileSize,
    onError,
    maxFiles,
    progress,
    ...props
}: Props) => {
    const { t } = useTranslation();
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        disabled: disabled || progress !== undefined,
        accept,
        multiple: props.multiple,
        maxSize: maxFileSize,
        maxFiles,
    });

    function handleDrop(acceptedFiles: File[], fileRejections: FileRejection[]) {
        if (fileRejections.length > 0 && !!onError) {
            const errorCode = fileRejections[0].errors[0].code;

            switch (errorCode) {
                case ErrorCode.FileTooLarge:
                    return onError(t('messages.file_too_large', { max: convertBytes(maxFileSize) }));
                case ErrorCode.FileInvalidType:
                    return onError(t('messages.invalid_mine_types', { mine_types: Object.keys(accept!).join(', ') }));
                case ErrorCode.TooManyFiles:
                    return onError(t('messages.too_many_files', { max: maxFiles, count: maxFiles }));
                default:
                    return onError(t('messages.file_uploaded_failed'));
            }
        }

        if (props.multiple) {
            props.onUpload(acceptedFiles);
        } else {
            props.onUpload(acceptedFiles[0]);
        }
    }

    return (
        <Box
            {...getRootProps()}
            border={2}
            borderRadius={1}
            borderColor={
                hasError
                    ? 'var(--mui-palette-error-main)'
                    : isDragActive
                      ? 'var(--mui-palette-primary-main)'
                      : 'var(--mui-palette-action-disabled)'
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={height}
            sx={{ borderStyle: 'dashed', cursor: disabled ? 'default' : 'pointer' }}
        >
            <input {...getInputProps()} />
            {progress !== undefined ? (
                <CircularProgressWithLabel value={progress} />
            ) : (
                <Stack alignItems="center" gap={1} mx={2}>
                    <CloudUploadOutlinedIcon fontSize="large" color={disabled ? 'disabled' : 'action'} />
                    <Typography
                        component="p"
                        variant="h5"
                        sx={{ userSelect: 'none' }}
                        color={disabled ? 'textDisabled' : 'textPrimary'}
                        textAlign="center"
                    >
                        {t('drag_and_drop_file_here')}
                    </Typography>
                    <Typography sx={{ userSelect: 'none' }} color={disabled ? 'textDisabled' : 'textSecondary'}>
                        {t('or')}
                    </Typography>
                    <Button variant="outlined" size="small" disabled={disabled}>
                        {t('browse')}
                    </Button>
                </Stack>
            )}
        </Box>
    );
};

export default FileDropzone;
