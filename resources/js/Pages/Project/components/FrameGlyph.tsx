import Box from '@mui/material/Box';

type Props = {
    frame: string;
    size?: number;
};

/**
 * Draw a small rectangle in the shape of a media frame (e.g. "4/5"), so ratios can be compared at a glance.
 */
const FrameGlyph = ({ frame, size = 16 }: Props) => {
    const [width, height] = frame.split('/').map(Number);
    const ratio = width && height ? width / height : 1;

    return (
        <Box
            component="span"
            aria-hidden
            sx={{
                display: 'inline-block',
                flexShrink: 0,
                width: ratio >= 1 ? size : size * ratio,
                height: ratio >= 1 ? size / ratio : size,
                border: 1.5,
                borderColor: 'currentcolor',
                borderRadius: '2px',
            }}
        />
    );
};

export default FrameGlyph;
