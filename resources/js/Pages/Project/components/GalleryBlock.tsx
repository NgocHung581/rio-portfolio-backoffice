import FileDropzone from '@/@core/components/FileDropzone';
import ConfirmationModal from '@/Components/ConfirmationModal';
import FormField from '@/Components/FormField';
import SortableItem, { SortableHandle } from '@/Components/SortableItem';
import { Option } from '@/types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { Accept } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { GalleryData, GalleryMediaItemData } from '../types';
import MediaItemTile from './MediaItemTile';

type Props = {
    gallery: GalleryData;
    index: number;
    isSortable: boolean;
    isVideo: boolean;
    maxMediaItemsCount: number;
    frameOptions: Option<string>[];
    accept: Accept;
    maxFileSize?: number;
    requirements: ReactNode;
    disabled: boolean;
    isUploadDisabled: boolean;
    uploadProgress?: number;
    getError: (key: string) => string | undefined;
    onSort: (fromIndex: number, toIndex: number) => void;
    onDelete: () => void;
    onUpload: (file: File) => void;
    onUploadError: (message: string) => void;
    onSortMediaItems: (fromIndex: number, toIndex: number) => void;
    onChangeMediaItem: <T extends 'frame' | 'is_banner'>(
        mediaItemId: string | number,
        field: T,
        value: GalleryMediaItemData[T],
    ) => void;
    onDeleteMediaItem: (mediaItemId: string | number) => void;
    onChangeCaption: (caption: string) => void;
};

const GalleryBlock = ({
    gallery,
    index,
    isSortable,
    isVideo,
    maxMediaItemsCount,
    frameOptions,
    accept,
    maxFileSize,
    requirements,
    disabled,
    isUploadDisabled,
    uploadProgress,
    getError,
    onSort,
    onDelete,
    onUpload,
    onUploadError,
    onSortMediaItems,
    onChangeMediaItem,
    onDeleteMediaItem,
    onChangeCaption,
}: Props) => {
    const { t } = useTranslation();
    const errorKey = `galleries.${gallery.id}`;
    const mediaItemsError = getError(`${errorKey}.media_items`);
    const captionError = getError(`${errorKey}.caption`);
    const mediaItemsCount = gallery.media_items.length;
    const isFull = mediaItemsCount >= maxMediaItemsCount;
    const sortableGroup = `gallery-${gallery.id}-media-items`;

    const renderDeleteButton = (onClick: () => void) => (
        <Tooltip title={t('delete_gallery')}>
            <IconButton
                aria-label={t('delete_gallery')}
                onClick={onClick}
                disabled={disabled}
                sx={{ '&:hover': { color: 'error.main' } }}
            >
                <DeleteOutlineIcon />
            </IconButton>
        </Tooltip>
    );

    return (
        <SortableItem group="galleries" index={index} onSort={onSort} axis="y" disabled={disabled || !isSortable}>
            <Box
                component="section"
                aria-label={t('gallery_number', { number: index + 1 })}
                p={{ xs: 3, sm: 4 }}
                bgcolor="background.paper"
                border={1}
                borderColor={mediaItemsError ? 'error.main' : 'divider'}
                borderRadius={1}
            >
                <Stack direction="row" alignItems="center" gap={2} mb={3}>
                    {isSortable && <SortableHandle group="galleries" disabled={disabled} />}
                    <Typography variant="h5" component="h3">
                        {t('gallery_number', { number: index + 1 })}
                    </Typography>
                    <Typography variant="body2" color={isFull ? 'textPrimary' : 'textSecondary'}>
                        {t('files_count', { count: mediaItemsCount, max: maxMediaItemsCount })}
                    </Typography>
                    <Box flex={1} />
                    {mediaItemsCount ? (
                        <ConfirmationModal
                            content={t('delete_gallery_confirmation', { count: mediaItemsCount })}
                            onConfirm={({ closeModal }) => {
                                closeModal();
                                onDelete();
                            }}
                            renderTrigger={({ openModal }) => renderDeleteButton(openModal)}
                        />
                    ) : (
                        renderDeleteButton(onDelete)
                    )}
                </Stack>
                <Box
                    display="grid"
                    gap={{ xs: 2, sm: 3 }}
                    p={{ xs: 2, sm: 3 }}
                    bgcolor="action.hover"
                    borderRadius={1}
                    sx={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}
                >
                    {gallery.media_items.map((mediaItem, mediaItemIndex) => (
                        <MediaItemTile
                            key={mediaItem.id}
                            mediaItem={mediaItem}
                            index={mediaItemIndex}
                            sortableGroup={sortableGroup}
                            isSortable={mediaItemsCount > 1}
                            isVideo={isVideo}
                            frameOptions={frameOptions}
                            disabled={disabled}
                            errors={{
                                fileUrl: getError(`${errorKey}.media_items.${mediaItem.id}.file_url`),
                                frame: getError(`${errorKey}.media_items.${mediaItem.id}.frame`),
                                isBanner: getError(`${errorKey}.media_items.${mediaItem.id}.is_banner`),
                            }}
                            onSort={onSortMediaItems}
                            onChangeFrame={(frame) => onChangeMediaItem(mediaItem.id, 'frame', frame)}
                            onChangeBanner={(isBanner) => onChangeMediaItem(mediaItem.id, 'is_banner', isBanner)}
                            onDelete={() => onDeleteMediaItem(mediaItem.id)}
                        />
                    ))}
                    {!isFull && (
                        <Box minHeight={mediaItemsCount ? 0 : 200}>
                            <FileDropzone
                                compact
                                height="100%"
                                accept={accept}
                                maxFileSize={maxFileSize}
                                maxFiles={maxMediaItemsCount}
                                onUpload={onUpload}
                                onError={onUploadError}
                                disabled={isUploadDisabled}
                                hasError={!!mediaItemsError}
                                progress={uploadProgress}
                            />
                        </Box>
                    )}
                </Box>
                <Box mt={1}>
                    {mediaItemsError ? (
                        <FormHelperText error>{mediaItemsError}</FormHelperText>
                    ) : (
                        !isFull && <FormHelperText>{requirements}</FormHelperText>
                    )}
                </Box>
                <Box mt={4}>
                    <FormField
                        control={
                            <TextField
                                multiline
                                maxRows={4}
                                placeholder={t('caption_placeholder')}
                                value={gallery.caption}
                                onChange={(e) => onChangeCaption(e.target.value)}
                                disabled={disabled}
                                error={!!captionError}
                                helperText={captionError}
                            />
                        }
                        label={t('caption')}
                        direction="column"
                    />
                </Box>
            </Box>
        </SortableItem>
    );
};

export default GalleryBlock;
