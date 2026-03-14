import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';
import { ChatMessage } from '@/shared/types/chat.types';

interface MessageBubbleProps {
  message: ChatMessage;
  isCopied: boolean;
  onCopy: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCopied, onCopy }) => {
  const isUserMessage = message.sender === 'user';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 2,
        maxWidth: '80%',
        alignSelf: isUserMessage ? 'flex-end' : 'flex-start',
        bgcolor: isUserMessage ? 'primary.main' : 'background.paper',
        border: message.error ? 1 : 0,
        borderColor: message.error ? 'error.main' : 'transparent',
        position: 'relative',
        '&:hover .copy-button': {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            flex: 1,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: isUserMessage ? 'primary.contrastText' : 'text.primary',
          }}
        >
          {message.text}
        </Typography>
        <Tooltip title={isCopied ? 'Скопійовано!' : 'Копіювати'}>
          <IconButton
            size="small"
            className="copy-button"
            onClick={onCopy}
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s',
              color: isUserMessage ? 'primary.contrastText' : 'text.secondary',
              '&:hover': {
                bgcolor: isUserMessage 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {isCopied ? (
              <CheckIcon fontSize="small" />
            ) : (
              <CopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      {message.timestamp && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'block',
            opacity: 0.7,
            textAlign: isUserMessage ? 'right' : 'left',
            color: isUserMessage ? 'primary.contrastText' : 'text.secondary',
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      )}
    </Paper>
  );
};
