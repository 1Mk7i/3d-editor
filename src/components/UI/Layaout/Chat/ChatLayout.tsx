'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatPropsWithSceneManager } from './types';
import { useChat } from '@/hooks/useChat';
import { generateAgentPrompt, parseAgentCommand, AgentCommand } from '@/shared/prompts/agentPrompt';
import { CONNECTION_STATUS } from '@/shared/constants/gemini.constants';
import { GEMINI_MODELS } from '@/shared/constants/gemini.constants';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Send as SendIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  SmartToy as AgentIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ChatMode } from '@/shared/prompts/agentPrompt';

export const Chat: React.FC<ChatPropsWithSceneManager> = ({ 
  onClose, 
  onAgentCommand,
  selectedObjectId,
  objects = []
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | string | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>('chat');
  const theme = useTheme();

  const {
    chatState,
    availableModels,
    handleInputChange,
    handleSendMessage,
    handleModelChange,
    retryConnection,
  } = useChat(chatMode === 'agent' ? generateAgentPrompt() : undefined);

  // Автоматичне прокручування до останнього повідомлення
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatState.messages, chatState.isLoading]);

  const handleAgentResponse = useCallback((responseText: string) => {
    if (chatMode === 'agent' && onAgentCommand) {
      const command = parseAgentCommand(responseText);
      if (command) {
        onAgentCommand(command);
      }
    }
  }, [chatMode, onAgentCommand]);

  const handleSend = useCallback(async () => {
    await handleSendMessage(handleAgentResponse);
  }, [handleSendMessage, handleAgentResponse]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleCopyMessage = useCallback(async (text: string, messageId: number | string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error('Помилка при копіюванні:', error);
      // Fallback для старих браузерів
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedMessageId(messageId);
        setTimeout(() => {
          setCopiedMessageId(null);
        }, 2000);
      } catch (err) {
        console.error('Помилка fallback копіювання:', err);
      }
      document.body.removeChild(textArea);
    }
  }, []);

  const getConnectionStatusColor = () => {
    switch (chatState.connectionStatus) {
      case CONNECTION_STATUS.CONNECTING:
        return 'warning';
      case CONNECTION_STATUS.CONNECTED:
        return 'success';
      case CONNECTION_STATUS.ERROR:
        return 'error';
      default:
        return 'default';
    }
  };

  const getConnectionStatusText = () => {
    switch (chatState.connectionStatus) {
      case CONNECTION_STATUS.CONNECTING:
        return 'Підключення...';
      case CONNECTION_STATUS.CONNECTED:
        return 'Підключено';
      case CONNECTION_STATUS.ERROR:
        return 'Помилка підключення';
      case CONNECTION_STATUS.DISCONNECTED:
        return 'Відключено';
      default:
        return 'Не підключено';
    }
  };

  const getCurrentModelDisplayName = () => {
    const model = availableModels.find(m => m.name === chatState.selectedModel);
    if (model) return model.displayName;
    
    const defaultModel = GEMINI_MODELS.find(m => m.value === chatState.selectedModel);
    return defaultModel?.label || chatState.selectedModel;
  };

  // Використовуємо доступні моделі з API або fallback до констант
  const modelsToShow = availableModels.length > 0 
    ? availableModels.map(m => ({ value: m.name, label: m.displayName, description: m.description }))
    : GEMINI_MODELS;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            AI Чат
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              value={chatMode}
              exclusive
              onChange={(_, newMode) => {
                if (newMode !== null) {
                  setChatMode(newMode);
                }
              }}
              size="small"
              sx={{ mr: 1 }}
            >
              <ToggleButton value="chat">
                <ChatIcon sx={{ mr: 0.5, fontSize: 16 }} />
                Чат
              </ToggleButton>
              <ToggleButton value="agent">
                <AgentIcon sx={{ mr: 0.5, fontSize: 16 }} />
                Агент
              </ToggleButton>
            </ToggleButtonGroup>
            <Chip
              label={getConnectionStatusText()}
              color={getConnectionStatusColor() as any}
              size="small"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
            {chatState.connectionStatus === CONNECTION_STATUS.ERROR && (
              <IconButton
                size="small"
                onClick={retryConnection}
                sx={{ ml: 1 }}
              >
                <Typography variant="caption">Повторити</Typography>
              </IconButton>
            )}
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Paper>

      {/* Model Selector */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <FormControl fullWidth size="small">
          <InputLabel id="model-select-label">Модель</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={chatState.selectedModel}
            label="Модель"
            onChange={(e) => handleModelChange(e.target.value as any)}
            disabled={chatState.connectionStatus !== CONNECTION_STATUS.CONNECTED || chatState.isLoading}
          >
            {modelsToShow.map((model) => (
              <MenuItem key={model.value} value={model.value}>
                {model.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {chatState.messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              {chatMode === 'agent' 
                ? 'Введіть команду для управління 3D сценою...'
                : 'Почніть розмову з AI...'}
            </Typography>
            {chatMode === 'agent' && (
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', px: 2 }}>
                Приклад: "Створи червоний куб", "Додай сферу на позиції 2, 0, 0", 
                "Оберни вибраний об'єкт на 90 градусів"
              </Typography>
            )}
          </Box>
        ) : (
          chatState.messages.map((msg, index) => (
            <React.Fragment key={msg.id}>
              {index > 0 && (
                <Box
                  sx={{
                    height: 1,
                    bgcolor: 'divider',
                    my: 0.5,
                  }}
                />
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: '80%',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                  border: msg.error ? 1 : 0,
                  borderColor: msg.error ? 'error.main' : 'transparent',
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
                      color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    {msg.text}
                  </Typography>
                  <Tooltip title={copiedMessageId === msg.id ? 'Скопійовано!' : 'Копіювати'}>
                    <IconButton
                      size="small"
                      className="copy-button"
                      onClick={() => handleCopyMessage(msg.text, msg.id)}
                      sx={{
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        color: msg.sender === 'user' ? 'primary.contrastText' : 'text.secondary',
                        '&:hover': {
                          bgcolor: msg.sender === 'user' 
                            ? 'rgba(255, 255, 255, 0.2)' 
                            : 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      {copiedMessageId === msg.id ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <CopyIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
                {msg.timestamp && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: 'block',
                      opacity: 0.7,
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                      color: msg.sender === 'user' ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString('uk-UA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                )}
              </Paper>
            </React.Fragment>
          ))
        )}
        {chatState.isLoading && (
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 2,
              maxWidth: '80%',
              alignSelf: 'flex-start',
              bgcolor: 'background.paper',
            }}
          >
            <CircularProgress size={16} />
          </Paper>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Error Banner */}
      {chatState.error && chatState.connectionStatus === CONNECTION_STATUS.ERROR && (
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          {chatState.error}
        </Alert>
      )}

      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderRadius: 0,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Введіть повідомлення..."
            value={chatState.inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={chatState.connectionStatus !== CONNECTION_STATUS.CONNECTED || chatState.isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.default',
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={
              chatState.connectionStatus !== CONNECTION_STATUS.CONNECTED ||
              chatState.isLoading ||
              !chatState.inputText.trim()
            }
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};
