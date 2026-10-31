import Image from '@/Components/Image';
import SortableItem, { SortableHandle } from '@/Components/SortableItem';
import { Option } from '@/types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ViewCarouselOutlinedIcon from '@mui/icons-material/ViewCarouselOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { GalleryMediaItemData } from '../types';
import FrameAutocomplete from './FrameAutocomplete';

type Props = {
    mediaItem: GalleryMediaItemData;
    index: number;
    sortableGroup: string;
    isSortable: boolean;
    isVideo: boolean;
    frameOptions: Option<string>[];
    disabled: boolean;
    errors: { fileUrl?: string; frame?: string; isBanner?: string };
    onSort: (fromIndex: number, toIndex: number) => void;
    onChangeFrame: (frame: string) => void;
    onChangeBanner: (isBanner: boolean) => void;
    onDelete: () => void;
};

const MediaItemTile = ({
    mediaItem,
    index,
    sortableGroup,
    isSortable,
    isVideo,
    frameOptions,
    disabled,
    errors,
    onSort,
    onChangeFrame,
    onChangeBanner,
    onDelete,
}: Props) => {
    const { t } = useTranslation();
    const errorMessages = [errors.fileUrl, errors.frame, errors.isBanner].filter(Boolean);

    return (
        <SortableItem group={sortableGroup} index={index} onSort={onSort} disabled={disabled || !isSortable} height={1}>
            <Stack
                gap={2}
                height={1}
                p={2}
                bgcolor="background.paper"
                border={1}
                borderColor={errorMessages.length ? 'error.main' : 'divider'}
                borderRadius={1}
            >
                <Box
                    position="relative"
                    overflow="hidden"
                    borderRadius={0.75}
                    bgcolor="action.selected"
                    sx={{ aspectRatio: mediaItem.frame }}
                >
                    {isVideo ? (
                        <Box
                            component="video"
                            controls
                            src={mediaItem.file_url}
                            width={1}
                            height={1}
                            display="block"
                            sx={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <Image
                            src={mediaItem.file_url}
                            alt={t('media_item_number', { number: index + 1 })}
                            containerSx={{ width: 1, height: 1 }}
                            imageSx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
                        />
                    )}
                    {!isVideo && (
                        <Tooltip title={t('display_on_banner')}>
                            <Chip
                                icon={mediaItem.is_banner ? <ViewCarouselIcon /> : <ViewCarouselOutlinedIcon />}
                                label={t('banner')}
                                color={mediaItem.is_banner ? 'primary' : 'default'}
                                onClick={() => onChangeBanner(!mediaItem.is_banner)}
                                disabled={disabled}
                                aria-pressed={mediaItem.is_banner}
                                sx={{
                                    position: 'absolute',
                                    top: 6,
                                    left: 6,
                                    boxShadow: 1,
                                    ...(!mediaItem.is_banner && {
                                        bgcolor: 'background.paper',
                                        '&:hover': { bgcolor: 'background.paper', color: 'primary.main' },
                                    }),
                                }}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title={t('delete')}>
                        <IconButton
                            size="small"
                            aria-label={t('delete')}
                            onClick={onDelete}
                            disabled={disabled}
                            sx={{
                                position: 'absolute',
                                top: 6,
                                right: 6,
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                '&:hover': { bgcolor: 'background.paper', color: 'error.main' },
                            }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Stack direction="row" alignItems="center" gap={1} mt="auto">
                    {isSortable && <SortableHandle group={sortableGroup} disabled={disabled} />}
                    <FrameAutocomplete
                        value={mediaItem.frame}
                        options={frameOptions}
                        onChange={onChangeFrame}
                        disabled={disabled}
                        error={!!errors.frame}
                        sx={{ flex: 1, minWidth: 0 }}
                    />
                </Stack>
                {errorMessages.map((message) => (
                    <FormHelperText key={message} error sx={{ m: 0 }}>
                        {message}
                    </FormHelperText>
                ))}
            </Stack>
        </SortableItem>
    );
};

export default MediaItemTile;
