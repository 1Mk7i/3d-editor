'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatPropsWithSceneManager } from './types';
import { MessageBubble } from './MessageBubble';
import { useChat } from '@/hooks/useChat';
import { generateAgentPrompt, parseAgentCommand } from '@/shared/prompts/agentPrompt';
import { CONNECTION_STATUS } from '@/shared/constants/gemini.constants';
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  SmartToy as AgentIcon,
  DeleteSweep as ClearIcon,
} from '@mui/icons-material';
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
  const [userApiKey, setUserApiKey] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('geminiApiKey');
    if (stored) setUserApiKey(stored);
  }, []);

  const handleApiKeyChange = (val: string) => {
    setUserApiKey(val);
    if (val.trim()) {
      localStorage.setItem('geminiApiKey', val.trim());
    } else {
      localStorage.removeItem('geminiApiKey');
    }
  };

  const getSceneInfo = useCallback((): string => {
    if (objects.length === 0) return 'На сцені немає об\'єктів.';

    const sceneObjects = objects.map((obj, index) => {
      const mesh = obj.mesh;
      const position = mesh.position;
      const color = (mesh as any).material?.color;
      const colorHex = color ? `#${color.getHexString()}` : 'не вказано';
      return `${index + 1}. ${obj.name || 'Unnamed'} - ID: "${obj.id}", позиція: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}), колір: ${colorHex}`;
    });

    const selectedObj = selectedObjectId ? objects.find(o => o.id === selectedObjectId) : null;
    return `Об'єктів на сцені: ${objects.length}\n${sceneObjects.join('\n')}\nВибраний ID: "${selectedObj?.id || 'немає'}"`;
  }, [objects, selectedObjectId]);

  const agentPrompt = React.useMemo(() => {
    return chatMode === 'agent' ? generateAgentPrompt(getSceneInfo()) : 'Ти — дружній AI-помічник. Відповідай лаконічно.';
  }, [chatMode, getSceneInfo]);

  const {
    chatState,
    availableModels,
    handleInputChange,
    handleSendMessage,
    handleModelChange,
    retryConnection,
  } = useChat(agentPrompt, userApiKey);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages, chatState.isLoading]);

  const handleAgentResponse = useCallback((responseText: string) => {
    if (chatMode === 'agent' && onAgentCommand) {
      const commands = parseAgentCommand(responseText);
      commands?.forEach((command, index) => {
        setTimeout(() => onAgentCommand(command), index * 100);
      });
    }
  }, [chatMode, onAgentCommand]);

  const handleSend = async () => {
    if (!chatState.inputText.trim() || !userApiKey) return;
    await handleSendMessage(handleAgentResponse, userApiKey);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = async (text: string, messageId: number | string) => {
    await navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const statusConfig = {
    [CONNECTION_STATUS.IDLE]: { color: 'default' as const, text: 'Очікування ключа' },
    [CONNECTION_STATUS.CONNECTING]: { color: 'warning' as const, text: 'Підключення...' },
    [CONNECTION_STATUS.CONNECTED]: { color: 'success' as const, text: 'Online' },
    [CONNECTION_STATUS.ERROR]: { color: 'error' as const, text: 'Помилка' },
    [CONNECTION_STATUS.DISCONNECTED]: { color: 'default' as const, text: 'Offline' },
  };

  const currentStatus = statusConfig[chatState.connectionStatus] || statusConfig[CONNECTION_STATUS.IDLE];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default' }}>
      
      {/* Header: Режими та Статус */}
      <Paper elevation={0} sx={{ p: 2, borderBottom: 1, borderColor: 'divider', borderRadius: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="bold">Gemini AI Workspace</Typography>
          <Chip label={currentStatus.text} color={currentStatus.color} size="small" variant="outlined" />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={chatMode}
            exclusive
            onChange={(_, val) => val && setChatMode(val)}
            size="small"
            fullWidth
          >
            <ToggleButton value="chat" sx={{ gap: 1 }}>
              <ChatIcon fontSize="small" /> Чат
            </ToggleButton>
            <ToggleButton value="agent" sx={{ gap: 1 }}>
              <AgentIcon fontSize="small" /> Агент
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Settings: API Key & Model */}
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          label="Google API Key"
          type="password"
          size="small"
          fullWidth
          value={userApiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)}
          placeholder="Вставте AIZA... ключ"
          helperText={!userApiKey ? "Ключ зберігається локально у вашому браузері" : ""}
        />

        <FormControl fullWidth size="small">
          <InputLabel>Модель Gemini</InputLabel>
          <Select
            value={chatState.selectedModel}
            label="Модель Gemini"
            onChange={(e) => handleModelChange(e.target.value as any)}
            disabled={availableModels.length === 0}
          >
            {availableModels.length === 0 ? (
              <MenuItem disabled value=""><em>Спочатку введіть валідний ключ</em></MenuItem>
            ) : (
              availableModels.map((m) => (
                <MenuItem key={m.name} value={m.name}>{m.displayName}</MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Box>

      {/* Messages: Область повідомлень */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {chatState.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isCopied={copiedMessageId === msg.id}
            onCopy={() => handleCopyMessage(msg.text, msg.id)}
          />
        ))}
        {chatState.isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="caption" color="text.secondary">Gemini думає...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Footer: Поле введення */}
      <Paper elevation={3} sx={{ p: 2, borderTop: 1, borderColor: 'divider', borderRadius: 0 }}>
        {chatState.error && (
          <Alert severity="error" sx={{ mb: 1, py: 0 }} action={
            <IconButton size="small" onClick={() => retryConnection(userApiKey)}>
              <Typography variant="caption" sx={{ textDecoration: 'underline' }}>Retry</Typography>
            </IconButton>
          }>
            {chatState.error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder={!userApiKey ? "Введіть API ключ вище..." : "Напишіть команду або запитання..."}
            value={chatState.inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={!userApiKey || chatState.isLoading}
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            disabled={!chatState.inputText.trim() || !userApiKey || chatState.isLoading}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
        {chatMode === 'agent' && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            💡 Агент бачить поточні об'єкти на сцені та може ними керувати.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};