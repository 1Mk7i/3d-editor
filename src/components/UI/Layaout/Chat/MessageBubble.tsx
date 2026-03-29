import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';
import { ChatMessage } from '@/shared/types/chat.types';
import ReactMarkdown from 'react-markdown';

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
        maxWidth: '85%',
        alignSelf: isUserMessage ? 'flex-end' : 'flex-start',
        bgcolor: isUserMessage ? 'primary.main' : 'background.paper',
        border: message.error ? 1 : 0,
        borderColor: message.error ? 'error.main' : 'transparent',
        position: 'relative',
        boxShadow: isUserMessage ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)',
        '&:hover .copy-button': {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Typography
          variant="body2"
          component="div"
          sx={{
            flex: 1,
            wordBreak: 'break-word',
            color: isUserMessage ? 'primary.contrastText' : 'text.primary',
            '& p': { m: 0, whiteSpace: 'pre-wrap' },
            '& a': {
              color: isUserMessage ? 'inherit' : 'primary.main',
              textDecoration: 'underline',
              fontWeight: 600,
              '&:hover': { opacity: 0.8 },
            },
            '& ul, & ol': {
              paddingLeft: '20px',
              margin: '8px 0',
            },
            '& code': {
              backgroundColor: isUserMessage ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '0.9em',
              fontFamily: 'monospace',
            }
          }}
        >
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
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
                  : 'rgba(0, 0, 0, 0.05)',
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
            opacity: 0.6,
            textAlign: isUserMessage ? 'right' : 'left',
            color: isUserMessage ? 'primary.contrastText' : 'text.secondary',
            fontSize: '0.7rem',
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