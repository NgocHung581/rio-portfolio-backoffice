import { convertBytes } from '@/utils/file';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Accept, ErrorCode, FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

export type UploadedFile = {
    url: string;
    file: File | undefined;
};

type SingleFileProps = {
    multiple?: false;
    file: UploadedFile | undefined;
    onUpload: (file: UploadedFile) => void;
};

type MultipleFilesProps = {
    multiple: true;
    files: UploadedFile[];
    onUpload: (files: UploadedFile[]) => void;
};

type Props = (SingleFileProps | MultipleFilesProps) & {
    accept?: Accept;
    hasError?: boolean;
    disabled?: boolean;
    height?: number;
    maxFileSize?: number;
    onError?: (message: string) => void;
    maxFiles?: number;
};

const FileDropzone = ({
    accept,
    hasError,
    disabled,
    height = 300,
    maxFileSize,
    onError,
    maxFiles,
    ...props
}: Props) => {
    const { t } = useTranslation();
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        disabled,
        accept,
        multiple: props.multiple,
        maxSize: maxFileSize,
        maxFiles,
    });

    const initUploadedFiles = props.multiple ? props.files : props.file ? [props.file] : [];
    const [uploadedFiles, setUploadedFiles] = useState(initUploadedFiles);

    useEffect(() => {
        return () => {
            uploadedFiles.forEach((file) => URL.revokeObjectURL(file.url));
        };
    }, [initUploadedFiles.length]);

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
                    return onError(t('messages.file_upload_failed'));
            }
        }

        const newUploadedFiles: UploadedFile[] = acceptedFiles.map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }));

        if (props.multiple) {
            uploadedFiles.forEach((file) => URL.revokeObjectURL(file.url));

            props.onUpload(newUploadedFiles);
            setUploadedFiles(newUploadedFiles);
        } else {
            !!uploadedFiles[0] && URL.revokeObjectURL(uploadedFiles[0].url);

            props.onUpload(newUploadedFiles[0]);
            setUploadedFiles([newUploadedFiles[0]]);
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
        </Box>
    );
};

export default FileDropzone;
