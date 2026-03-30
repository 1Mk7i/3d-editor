'use client';

import React, { useState } from 'react';
import { 
    Box, Button, Typography, List, ListItem, Paper, 
    IconButton, TextField, ListItemText,
    Tooltip, useMediaQuery, useTheme, Stack
} from '@mui/material';
import { 
    PlayArrow, Pause, Stop, Download, Delete, 
    History as HistoryIcon 
} from '@mui/icons-material';

import { useTimerContext } from '@/context/TimerContext';

export const Timer: React.FC = () => {
    const theme = useTheme();
    const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));

    const { 
        seconds, 
        setSeconds, 
        isActive, 
        setIsActive, 
        logs, 
        setLogs,
        formatTime,
        downloadReport 
    } = useTimerContext();

    const [comment, setComment] = useState('');

    const handleCapture = () => {
        if (!isActive && seconds === 0) return;
        
        const newLog = {
            id: crypto.randomUUID(),
            systemTime: new Date().toLocaleTimeString('uk-UA'),
            timerValue: formatTime(seconds),
            comment: comment.trim() || 'Ручна мітка'
        };
        
        setLogs((prev: any[]) => [newLog, ...prev]);
        setComment(''); 
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobileUI ? 'column' : 'row', 
            height: '100%', 
            bgcolor: 'background.default',
            overflow: 'hidden'
        }}>
            <Box sx={{ 
                width: isMobileUI ? '100%' : '220px', 
                minWidth: isMobileUI ? '100%' : '200px',
                p: 2.5,
                borderRight: isMobileUI ? 0 : 1, 
                borderBottom: isMobileUI ? 1 : 0,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                bgcolor: 'action.hover'
            }}>
                <Box sx={{ 
                    textAlign: 'center',
                    p: 1.5,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                        STATUS: {isActive ? 'RUNNING' : 'PAUSED'}
                    </Typography>
                    <Typography variant="h4" sx={{ 
                        fontFamily: 'monospace', 
                        fontWeight: 800, 
                        color: isActive ? 'success.main' : 'text.primary',
                        mt: 1,
                        fontSize: '1.75rem'
                    }}>
                        {formatTime(seconds)}
                    </Typography>
                </Box>

                <Stack gap={1.5}>
                    <Button 
                        fullWidth
                        variant="contained" 
                        size="large"
                        color={isActive ? "warning" : "success"} 
                        onClick={() => setIsActive(!isActive)}
                        startIcon={isActive ? <Pause /> : <PlayArrow />}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                        {isActive ? "Пауза" : "Старт"}
                    </Button>
                    <Button 
                        fullWidth
                        variant="outlined" 
                        size="small"
                        onClick={() => { setSeconds(0); setIsActive(false); }}
                        startIcon={<Stop />}
                        sx={{ borderRadius: 2, color: 'text.secondary', borderColor: 'divider' }}
                    >
                        Скидання
                    </Button>
                </Stack>

                {!isMobileUI && <Box sx={{ flexGrow: 1 }} />}
                
                <Button 
                    fullWidth 
                    variant="text" 
                    size="small" 
                    onClick={downloadReport} 
                    disabled={logs.length === 0}
                    startIcon={<Download />}
                    sx={{ opacity: 0.8 }}
                >
                    Експорт звіту
                </Button>
            </Box>

            <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                minWidth: 0,
                p: 2.5,
                gap: 2.5
            }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <TextField
                        placeholder="Яке завдання виконуєте зараз?"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCapture()}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleCapture}
                        disabled={!isActive && seconds === 0}
                        sx={{ px: 3, borderRadius: 2, whiteSpace: 'nowrap' }}
                    >
                        Записати
                    </Button>
                </Box>

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                            <HistoryIcon fontSize="small" sx={{ color: 'primary.main' }} />
                            ІСТОРІЯ АКТИВНОСТІ
                        </Typography>
                        {logs.length > 0 && (
                            <Tooltip title="Очистити список">
                                <IconButton size="small" onClick={() => setLogs([])} color="error">
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    
                    <Paper variant="outlined" sx={{ 
                        flexGrow: 1, 
                        overflowY: 'auto', 
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 10 }
                    }}>
                        <List dense>
                            {logs.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center', opacity: 0.4 }}>
                                    <Typography variant="body2">Тут з'являтимуться ваші часові мітки</Typography>
                                </Box>
                            ) : (
                                logs.map((log: any) => (
                                    <ListItem key={log.id} divider sx={{ py: 1.5 }}>
                                        <ListItemText 
                                            primary={log.comment}
                                            secondary={`${log.systemTime} — Тривалість: ${log.timerValue}`}
                                            primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: 'text.primary' }}
                                            secondaryTypographyProps={{ variant: 'caption', sx: { mt: 0.5, display: 'block' } }}
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};