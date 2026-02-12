import { UploadedFile } from '@/@core/components/FileDropzone';
import FormField from '@/Components/FormField';
import { PageProps } from '@/types';
import { ProjectFormPageProps } from '@/types/project';
import { usePage } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

type ShowBannerVisibilityCheckboxProps = {
    showBannerVisibilityCheckbox: true;
    isBanner: boolean;
    onChangeIsBanner: (isBanner: boolean) => void;
    isBannerFieldError?: string;
};

type HideBannerVisibilityCheckboxProps = {
    showBannerVisibilityCheckbox?: false;
};

type Props = (ShowBannerVisibilityCheckboxProps | HideBannerVisibilityCheckboxProps) & {
    mediaItem: UploadedFile;
    onDelete: () => void;
    frame: string;
    onChangeFrame: (frame: string) => void;
    frameFieldError?: string;
    fileError?: string;
    disabled?: boolean;
};

const MediaItemCard = ({
    mediaItem,
    onDelete,
    frame,
    onChangeFrame,
    frameFieldError,
    fileError,
    disabled,
    ...props
}: Props) => {
    const { t } = useTranslation();
    const { mediaFrameOptions } = usePage<PageProps<ProjectFormPageProps>>().props;

    return (
        <Card variant="outlined" component={Stack} height={1}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box flex={1}>
                    <Box component="img" src={mediaItem.url} width={1} height="auto" />
                    {!!fileError && <FormHelperText error>{fileError}</FormHelperText>}
                </Box>
                <Stack width={1} gap={4}>
                    <FormField
                        control={
                            <Fragment>
                                <Select
                                    value={frame}
                                    onChange={(e) => onChangeFrame(e.target.value)}
                                    disabled={disabled}
                                >
                                    {mediaFrameOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {!!frameFieldError && <FormHelperText error>{frameFieldError}</FormHelperText>}
                            </Fragment>
                        }
                        label={t('frame')}
                        required
                        direction="column"
                    />
                </Stack>
            </CardContent>
            <CardActions>
                <Box flex={1}>
                    {props.showBannerVisibilityCheckbox && (
                        <FormControl>
                            <FormControlLabel
                                sx={{ m: 0 }}
                                control={
                                    <Checkbox
                                        edge="start"
                                        size="small"
                                        checked={props.isBanner}
                                        onChange={(_, checked) => props.onChangeIsBanner(checked)}
                                        disabled={disabled}
                                    />
                                }
                                label={t('banner')}
                                slotProps={{ typography: { variant: 'body2' } }}
                            />
                            {!!props.isBannerFieldError && (
                                <FormHelperText error>{props.isBannerFieldError}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                </Box>
                <Button color="error" onClick={onDelete} disabled={disabled}>
                    {t('delete')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default MediaItemCard;
