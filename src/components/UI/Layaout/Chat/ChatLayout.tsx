'use client';

import React, { useState } from 'react';
import './Chat.css';
import { ChatProps, ChatData } from './types';
import Input from '@/components/UI/Input/Input';
import { Button } from '@/components/UI/Button/Button';


export const Chat: React.FC<ChatProps> = ({ onClose }) => {
  const [chat, setChat] = useState<ChatData>({
    messages: [],
    inputText: '',
  });
  
  const SendIcon = () => <img src="/assets/send.svg" alt="Send" width={20} height={20} />;
  // const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChat(prev => ({ ...prev, inputText: e.target.value }));
  };

  const handleSendMessage = () => {
    if (chat.inputText.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: chat.inputText,
      sender: 'user' as const,
    };

    setChat(prev => ({
      messages: [...prev.messages, newMessage],
      inputText: '',
    }));
    
    // Імітація відповіді бота
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: 'Це відповідь бота на ваше повідомлення: ' + newMessage.text,
        sender: 'bot' as const,
      };
      setChat(prev => ({
        messages: [...prev.messages, botMessage],
        inputText: '',
      }));
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 style={{ color: '#ffffff' }}>Чат</h2>
        <Button 
          onClick={onClose} 
          className="close-button"
          variant="secondary"
        >
          Скасувати
        </Button>
      </div>
      <div className="chat-messages">
        {chat.messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {index > 0 && <div className="message-divider" />}
            <div className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="chat-input">
        <Input
          type="text"
          value={chat.inputText}
          onChange={handleInputChange}
          placeholder="Введіть повідомлення..."
          className="input-field"
        />
        <Button
          onClick={handleSendMessage}
          variant="primary"
          className="send-button"
          icon={<SendIcon />}
        />
      </div>
    </div>
  );
};