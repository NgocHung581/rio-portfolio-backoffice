import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import { Property } from 'csstype';
import { Fragment, useState } from 'react';

type Props = {
    src: string;
    alt: string;
    aspectRatio?: Property.AspectRatio;
};

const ImageInTable = ({ src, alt, aspectRatio }: Props) => {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Fragment>
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
                sx={(theme) => ({
                    cursor: 'pointer',
                    position: 'relative',
                    '::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'transparent',
                        transition: theme.transitions.create('background-color'),
                    },
                    ':hover': {
                        '::before': {
                            bgcolor: 'var(--mui-palette-action-selected)',
                        },
                        img: {
                            opacity: 0.5,
                        },
                    },
                    img: {
                        borderRadius: 0.5,
                        height: 1,
                        transition: theme.transitions.create('opacity'),
                    },
                })}
                onClick={handleOpenModal}
            >
                <img src={src} alt={alt} />
            </Box>
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                slotProps={{ paper: { sx: { bgcolor: 'transparent' } } }}
            >
                <Box component="img" src={src} alt={alt} sx={{ aspectRatio }} />
            </Dialog>
        </Fragment>
    );
};

export default ImageInTable;
