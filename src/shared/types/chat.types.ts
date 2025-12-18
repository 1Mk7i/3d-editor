/**
 * Типи для роботи з чатом
 */

import { ConnectionStatus, GeminiModel } from '@/shared/constants/gemini.constants';

export interface ChatMessage {
  id: number | string;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: number;
  error?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  inputText: string;
  selectedModel: GeminiModel;
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  error: string | null;
}

export interface ChatProps {
  onClose?: () => void;
}

export interface GeminiModelInfo {
  name: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
}

