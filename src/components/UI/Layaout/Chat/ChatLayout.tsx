'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Chat.css';
import { ChatProps } from './types';
import Input from '@/components/UI/Input/Input';
import { Button } from '@/components/UI/Button/Button';
import { useChat } from '@/hooks/useChat';
import { CONNECTION_STATUS } from '@/shared/constants/gemini.constants';
import { GEMINI_MODELS } from '@/shared/constants/gemini.constants';
import clsx from 'clsx';

export const Chat: React.FC<ChatProps> = ({ onClose }) => {
  const {
    chatState,
    availableModels,
    handleInputChange,
    handleSendMessage,
    handleModelChange,
    retryConnection,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | string | null>(null);

  // Автоматичне прокручування до останнього повідомлення
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatState.messages, chatState.isLoading]);

  const SendIcon = () => <img src="/assets/send.svg" alt="Send" width={20} height={20} />;

  const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 4.5V1.5C5.5 1.22386 5.72386 1 6 1H12.5C12.7761 1 13 1.22386 13 1.5V8.5C13 8.77614 12.7761 9 12.5 9H9.5V12.5C9.5 12.7761 9.27614 13 9 13H2.5C2.22386 13 2 12.7761 2 12.5V5.5C2 5.22386 2.22386 5 2.5 5H5.5V4.5ZM6 2V4.5C6 4.77614 6.22386 5 6.5 5H9V8H12.5V2H6ZM3 6V12H8.5V6H3Z" fill="currentColor"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

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

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

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

  const getConnectionStatusClass = () => {
    switch (chatState.connectionStatus) {
      case CONNECTION_STATUS.CONNECTING:
        return 'status-connecting';
      case CONNECTION_STATUS.CONNECTED:
        return 'status-connected';
      case CONNECTION_STATUS.ERROR:
        return 'status-error';
      case CONNECTION_STATUS.DISCONNECTED:
        return 'status-disconnected';
      default:
        return 'status-idle';
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
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <h2 style={{ color: '#ffffff', margin: 0 }}>AI Чат</h2>
          <div className="chat-status">
            <span className={clsx('status-indicator', getConnectionStatusClass())} />
            <span className="status-text">{getConnectionStatusText()}</span>
            {chatState.connectionStatus === CONNECTION_STATUS.ERROR && (
              <Button
                onClick={retryConnection}
                variant="secondary"
                size="small"
                className="retry-button"
              >
                Повторити
              </Button>
            )}
          </div>
        </div>
        <Button 
          onClick={onClose} 
          className="close-button"
          variant="secondary"
          size="small"
        >
          Закрити
        </Button>
      </div>

      <div className="chat-model-selector">
        <label htmlFor="model-select" className="model-label">
          Модель:
        </label>
        <select
          id="model-select"
          value={chatState.selectedModel}
          onChange={(e) => handleModelChange(e.target.value as any)}
          className="model-select"
          disabled={chatState.connectionStatus !== CONNECTION_STATUS.CONNECTED || chatState.isLoading}
        >
          {modelsToShow.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
        <div className="current-model">
          <span className="model-name">{getCurrentModelDisplayName()}</span>
        </div>
      </div>

      <div className="chat-messages" id="chat-messages" ref={messagesContainerRef}>
        {chatState.messages.length === 0 ? (
          <div className="chat-empty">
            <p>Почніть розмову з AI...</p>
          </div>
        ) : (
          chatState.messages.map((msg, index) => (
            <React.Fragment key={msg.id}>
              {index > 0 && <div className="message-divider" />}
              <div className={clsx('chat-message', msg.sender, { 'message-error': msg.error })}>
                <div className="message-header">
                  <div className="message-content">{msg.text}</div>
                  <button
                    className={clsx('copy-button', { 'copied': copiedMessageId === msg.id })}
                    onClick={() => handleCopyMessage(msg.text, msg.id)}
                    title={copiedMessageId === msg.id ? 'Скопійовано!' : 'Копіювати'}
                    aria-label="Копіювати повідомлення"
                  >
                    {copiedMessageId === msg.id ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
                {msg.timestamp && (
                  <div className="message-timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString('uk-UA', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                )}
              </div>
            </React.Fragment>
          ))
        )}
        {chatState.isLoading && (
          <div className="chat-message bot loading">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {chatState.error && chatState.connectionStatus === CONNECTION_STATUS.ERROR && (
        <div className="chat-error-banner">
          {chatState.error}
        </div>
      )}

      <div className="chat-input">
        <Input
          type="text"
          value={chatState.inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Введіть повідомлення..."
          className="input-field"
          disabled={chatState.connectionStatus !== CONNECTION_STATUS.CONNECTED || chatState.isLoading}
        />
        <Button
          onClick={handleSendMessage}
          variant="primary"
          className="send-button"
          icon={<SendIcon />}
          disabled={chatState.connectionStatus !== CONNECTION_STATUS.CONNECTED || chatState.isLoading || !chatState.inputText.trim()}
        />
      </div>
    </div>
  );
};
