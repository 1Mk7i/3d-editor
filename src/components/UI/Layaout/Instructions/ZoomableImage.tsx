'use client';

import React, { useState } from 'react';
import { Box, Dialog, IconButton, Fade, Tooltip, Typography } from '@mui/material';
import { 
    Close as CloseIcon, 
    ZoomIn as ZoomInIcon,
    Fullscreen as FullscreenIcon 
} from '@mui/icons-material';

interface ZoomableImageProps {
    src: string;
    alt: string;
    maxWidth?: string | number;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({ 
    src, 
    alt, 
    maxWidth = '100%' 
}) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Tooltip title="Натисніть, щоб збільшити" arrow>
                <Box 
                    onClick={handleOpen}
                    sx={{ 
                        position: 'relative', 
                        cursor: 'zoom-in', 
                        display: 'inline-block',
                        width: '100%',
                        maxWidth: maxWidth,
                        lineHeight: 0,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'scale(1.01)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                            '& .zoom-overlay': { opacity: 1 }
                        }
                    }}
                >
                    <Box
                        component="img"
                        src={src}
                        alt={alt}
                        sx={{ 
                            width: '100%', 
                            height: 'auto', 
                            display: 'block' 
                        }}
                    />
                    
                    <Box 
                        className="zoom-overlay"
                        sx={{ 
                            position: 'absolute', 
                            inset: 0, 
                            bgcolor: 'rgba(0,0,0,0.2)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <ZoomInIcon sx={{ color: '#fff', fontSize: 32 }} />
                    </Box>
                </Box>
            </Tooltip>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                transitionDuration={300}
                PaperProps={{
                    sx: { 
                        bgcolor: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        position: 'relative',
                        boxShadow: 'none'
                    }
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16, 
                        color: '#fff', 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        zIndex: 10 
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    component="img"
                    src={src}
                    alt={alt}
                    onClick={handleClose}
                    sx={{ 
                        maxWidth: '95vw', 
                        maxHeight: '95vh', 
                        objectFit: 'contain', 
                        cursor: 'zoom-out',
                        userSelect: 'none',
                        boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                        borderRadius: 1
                    }}
                />
                
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: 'rgba(255,255,255,0.5)', 
                        position: 'absolute', 
                        bottom: 16,
                        letterSpacing: 1
                    }}
                >
                    {alt.toUpperCase()}
                </Typography>
            </Dialog>
        </>
    );
};