import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ErrorCode, FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

type SelectedImage = {
    url: string;
    file?: File;
    file_name: string;
    file_size: number;
};

type SingleFileProps = {
    onChange?: (file: File | undefined) => void;
    multiple?: false;
    initImage?: SelectedImage;
};

type MultipleFileProps = {
    onChange?: (files: File[]) => void;
    multiple: true;
    initImages?: SelectedImage[];
    onDeleteAllImages?: () => void;
};

type Props = (SingleFileProps | MultipleFileProps) & {
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    height?: number;
    maxSize?: number;
    onDeleteImage?: (url: string) => void;
    onError?: (errorMessage: string) => void;
};

const ImageDropzone = ({
    error,
    helperText,
    disabled,
    height = 300,
    maxSize,
    onDeleteImage,
    onError,
    ...props
}: Props) => {
    const { t } = useTranslation();
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDropFile,
        disabled,
        accept: { 'image/jpeg': [], 'image/png': [] },
        multiple: props.multiple,
        maxSize,
        maxFiles: 1,
    });

    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>(getInitImages);

    useEffect(() => {
        return () => {
            selectedImages.forEach((image) => URL.revokeObjectURL(image.url));
        };
    }, [selectedImages.length]);

    function handleDropFile(acceptedFiles: File[], fileRejections: FileRejection[]) {
        if (fileRejections.length > 0 && onError) {
            switch (fileRejections[0].errors[0].code) {
                case ErrorCode.FileTooLarge:
                    return onError(t('error_message_file_too_large', { max: bytesToKilobytes(maxSize) }));
                case ErrorCode.FileInvalidType:
                    return onError(t('error_message_invalid_mine_types', { mine_types: ['jpeg', 'png'].join(', ') }));
                default:
                    return onError(t('error_message_file_upload_failed'));
            }
        }

        setSelectedImages((prev) => {
            if (!props.multiple) {
                URL.revokeObjectURL(prev[0]?.url);

                return [
                    {
                        url: URL.createObjectURL(acceptedFiles[0]),
                        file: acceptedFiles[0],
                        file_name: acceptedFiles[0].name,
                        file_size: acceptedFiles[0].size,
                    },
                ];
            }

            return [
                ...prev,
                ...acceptedFiles.map((file) => ({
                    url: URL.createObjectURL(file),
                    file,
                    file_name: file.name,
                    file_size: file.size,
                })),
            ];
        });

        if (props.onChange) {
            if (props.multiple) {
                props.onChange(acceptedFiles);
            } else {
                props.onChange(acceptedFiles[0]);
            }
        }
    }

    function getInitImages(): SelectedImage[] {
        if (props.multiple) {
            return props.initImages ?? [];
        } else {
            return props.initImage ? [props.initImage] : [];
        }
    }

    const bytesToKilobytes = (bytes?: number) => {
        if (!bytes) return 0;

        const kb = bytes / 1024;

        return Number(kb % 1 === 0 ? kb.toFixed(0) : kb.toFixed(1));
    };

    const handleDeleteAllImages = () => {
        selectedImages.forEach((image) => URL.revokeObjectURL(image.url));
        setSelectedImages([]);

        if (props.multiple) {
            props.onDeleteAllImages && props.onDeleteAllImages();
        }
    };

    const handleDeleteImage = (deletedImage: SelectedImage) => () => {
        URL.revokeObjectURL(deletedImage.url);
        setSelectedImages((prev) => prev.filter((image) => image.url !== deletedImage.url));
        onDeleteImage && onDeleteImage(deletedImage.url);
    };

    return (
        <Stack spacing={4}>
            <Box>
                <Box
                    {...getRootProps()}
                    border={2}
                    borderRadius={1}
                    borderColor={
                        error
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
                            {t('drag_and_drop_your_image_here')}
                        </Typography>
                        <Typography sx={{ userSelect: 'none' }} color={disabled ? 'textDisabled' : 'textSecondary'}>
                            {t('or')}
                        </Typography>
                        <Button variant="outlined" size="small" disabled={disabled}>
                            {t('browse')}
                        </Button>
                    </Stack>
                </Box>

                {!!helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
            </Box>

            {selectedImages.length > 0 && (
                <Stack spacing={2}>
                    {props.multiple && (
                        <Box textAlign="right">
                            <Button variant="outlined" color="error" size="small" onClick={handleDeleteAllImages}>
                                {t('remove_all')}
                            </Button>
                        </Box>
                    )}

                    {selectedImages.map((selectedImage) => (
                        <Card key={selectedImage.url} variant="outlined" sx={{ p: 3, pl: 4 }}>
                            <Stack direction="row" alignItems="center" gap={4}>
                                <Stack flex={1} direction="row" alignItems="center" gap={4}>
                                    <Box
                                        height={40}
                                        width={40}
                                        p={1}
                                        border={1}
                                        borderColor="divider"
                                        borderRadius={1}
                                        overflow="hidden"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{ img: { borderRadius: 0.5, height: 1 } }}
                                    >
                                        <img src={selectedImage.url} alt="" />
                                    </Box>
                                    <Stack flex={1} overflow="hidden">
                                        <Typography variant="body2" fontWeight={500}>
                                            {selectedImage.file_name}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {bytesToKilobytes(selectedImage.file_size)} KB
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <IconButton
                                    color="error"
                                    disabled={disabled}
                                    onClick={handleDeleteImage(selectedImage)}
                                >
                                    <DeleteOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            )}
        </Stack>
    );
};

export default ImageDropzone;
