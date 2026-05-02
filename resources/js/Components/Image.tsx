import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { Theme } from '@mui/material/styles';
import { SystemStyleObject } from '@mui/system/styleFunctionSx/styleFunctionSx';
import { useState } from 'react';

type Props = {
    src: string;
    alt?: string;
    imageSx?: SystemStyleObject<Theme>;
    containerSx?: SystemStyleObject<Theme>;
    skeletonSx?: SystemStyleObject<Theme>;
};

const Image = ({ src, alt, containerSx, imageSx, skeletonSx }: Props) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Box sx={{ position: 'relative', ...containerSx }}>
            {isLoading && (
                <Skeleton
                    variant="rectangular"
                    sx={{ width: 1, height: 1, position: 'absolute', top: 0, left: 0, ...skeletonSx }}
                />
            )}
            <Box
                component="img"
                src={src}
                alt={alt}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                sx={{
                    opacity: isLoading ? 0 : 1,
                    transition: (theme) => theme.transitions.create('opacity'),
                    ...imageSx,
                }}
            />
        </Box>
    );
};

export default Image;
