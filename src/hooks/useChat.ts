'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  ChatMessage, 
  ChatState, 
  GeminiModelInfo 
} from '@/shared/types/chat.types';
import { 
  ConnectionStatus, 
  CONNECTION_STATUS, 
  DEFAULT_GEMINI_MODEL,
  GeminiModel 
} from '@/shared/constants/gemini.constants';
import { 
  fetchGeminiModels, 
  generateContent, 
  checkApiConnection 
} from '@/shared/services/gemini.service';
import { logger } from '@/shared/utils/logger';

export interface UseChatReturn {
  chatState: ChatState;
  availableModels: GeminiModelInfo[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: (onAgentResponse?: (text: string) => void, userApiKey?: string) => Promise<void>;
  handleModelChange: (model: GeminiModel) => void;
  retryConnection: (userApiKey?: string) => Promise<void>;
}

export const useChat = (systemInstruction?: string, userApiKey?: string): UseChatReturn => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    inputText: '',
    selectedModel: DEFAULT_GEMINI_MODEL,
    connectionStatus: CONNECTION_STATUS.IDLE,
    isLoading: false,
    error: null,
  });

  const [availableModels, setAvailableModels] = useState<GeminiModelInfo[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const systemInstructionRef = useRef<string | undefined>(systemInstruction);

  // Оновлюємо ref при зміні systemInstruction
  useEffect(() => {
    systemInstructionRef.current = systemInstruction;
  }, [systemInstruction]);

  // Перевірка підключення та завантаження моделей при ініціалізації
  useEffect(() => {
    const initializeChat = async () => {
      setChatState(prev => ({ ...prev, connectionStatus: CONNECTION_STATUS.CONNECTING }));
      
      try {
        // Перевіряємо підключення
        const isConnected = await checkApiConnection(userApiKey);
        
        if (!isConnected) {
          setChatState(prev => ({ 
            ...prev, 
            connectionStatus: CONNECTION_STATUS.ERROR,
            error: 'Не вдалося підключитися до API'
          }));
          return;
        }

        // Завантажуємо список моделей
        const models = await fetchGeminiModels(userApiKey);
        setAvailableModels(models);
        
        setChatState(prev => ({ 
          ...prev, 
          connectionStatus: CONNECTION_STATUS.CONNECTED,
          error: null 
        }));
      } catch (error) {
        logger.error('Помилка ініціалізації чату:', error);
        setChatState(prev => ({ 
          ...prev, 
          connectionStatus: CONNECTION_STATUS.ERROR,
          error: error instanceof Error ? error.message : 'Невідома помилка'
        }));
      }
    };

    // Виконуємо тільки якщо є ключ (серверний чи користувацький)
    if (userApiKey || process.env.NODE_ENV === 'development') {
      initializeChat();
    }
  }, [userApiKey]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setChatState(prev => ({ ...prev, inputText: e.target.value }));
  }, []);

  const handleSendMessage = useCallback(async (onAgentResponse?: (text: string) => void, userApiKey?: string) => {
    if (chatState.inputText.trim() === '' || chatState.isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: chatState.inputText,
      sender: 'user',
      timestamp: Date.now(),
    };

    // Додаємо повідомлення користувача
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      inputText: '',
      isLoading: true,
      error: null,
    }));

    // Скасовуємо попередній запит, якщо він є
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      // Формуємо історію повідомлень для контексту
      const history: Array<{ role: 'user' | 'bot'; text: string }> = chatState.messages
        .filter(msg => !msg.error) // Виключаємо повідомлення з помилками
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'bot',
          text: msg.text,
        }));

      const response = await generateContent(
        userMessage.text,
        chatState.selectedModel,
        history,
        systemInstructionRef.current,
        userApiKey
      );

      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: Date.now(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
        connectionStatus: CONNECTION_STATUS.CONNECTED,
      }));

      // Викликаємо callback для обробки відповіді агента
      if (onAgentResponse && systemInstructionRef.current) {
        onAgentResponse(response.text);
      }
    } catch (error) {
      logger.error('Помилка при відправці повідомлення:', error);

      // Формуємо зрозуміле повідомлення про помилку
      let userFriendlyMessage = 'Помилка при отриманні відповіді';
      
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        // Перевіряємо, чи це помилка про перевищення квоти
        if (errorMessage.includes('429') || 
            errorMessage.includes('квоти') || 
            errorMessage.includes('quota') ||
            errorMessage.includes('RESOURCE_EXHAUSTED')) {
          userFriendlyMessage = errorMessage.includes('квоти') 
            ? errorMessage 
            : 'Перевищено денну квоту API Gemini. Спробуйте пізніше або оновіть тарифний план.';
        } else if (errorMessage.includes('API ключ')) {
          userFriendlyMessage = 'Проблема з API ключем. Перевірте налаштування.';
        } else if (errorMessage.includes('підключення') || errorMessage.includes('connection')) {
          userFriendlyMessage = 'Помилка підключення до API. Перевірте інтернет-з\'єднання.';
        } else {
          userFriendlyMessage = errorMessage;
        }
      }

      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: userFriendlyMessage,
        sender: 'bot',
        timestamp: Date.now(),
        error: true,
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        connectionStatus: CONNECTION_STATUS.ERROR,
        error: userFriendlyMessage,
      }));
    } finally {
      abortControllerRef.current = null;
    }
  }, [chatState.inputText, chatState.messages, chatState.selectedModel, chatState.isLoading]);

  const handleModelChange = useCallback((model: GeminiModel) => {
    setChatState(prev => ({ ...prev, selectedModel: model }));
  }, []);

  const retryConnection = useCallback(async (userApiKey?: string) => {
    setChatState(prev => ({ ...prev, connectionStatus: CONNECTION_STATUS.CONNECTING }));
    
    try {
      const isConnected = await checkApiConnection();
      
      if (!isConnected) {
        setChatState(prev => ({ 
          ...prev, 
          connectionStatus: CONNECTION_STATUS.ERROR,
          error: 'Не вдалося підключитися до API'
        }));
        return;
      }

      const models = await fetchGeminiModels(userApiKey);
      setAvailableModels(models);
      
      setChatState(prev => ({ 
        ...prev, 
        connectionStatus: CONNECTION_STATUS.CONNECTED,
        error: null 
      }));
    } catch (error) {
      logger.error('Помилка повторного підключення:', error);
      setChatState(prev => ({ 
        ...prev, 
        connectionStatus: CONNECTION_STATUS.ERROR,
        error: error instanceof Error ? error.message : 'Невідома помилка'
      }));
    }
  }, []);

  return {
    chatState,
    availableModels,
    handleInputChange,
    handleSendMessage,
    handleModelChange,
    retryConnection,
  };
};

