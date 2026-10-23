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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { GalleryMediaItemData } from '../types';
import FrameGlyph from './FrameGlyph';

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
    const frameLabel = frameOptions.find((option) => option.value === mediaItem.frame)?.label ?? mediaItem.frame;

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
                    <Select
                        value={mediaItem.frame}
                        onChange={(e) => onChangeFrame(e.target.value)}
                        disabled={disabled}
                        error={!!errors.frame}
                        inputProps={{ 'aria-label': t('frame') }}
                        renderValue={() => (
                            <Stack direction="row" alignItems="center" gap={1.5} whiteSpace="nowrap">
                                <FrameGlyph frame={mediaItem.frame} size={14} />
                                {frameLabel}
                            </Stack>
                        )}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            // Tighter than the default padding, so the label fits in narrow tiles.
                            '& .MuiSelect-select.MuiOutlinedInput-input': { pl: 2.5, pr: 7 },
                            '& .MuiSelect-icon': { right: 4 },
                        }}
                    >
                        {frameOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value} sx={{ gap: 2.5 }}>
                                <Box width={16} display="flex" justifyContent="center">
                                    <FrameGlyph frame={option.value} />
                                </Box>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
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
