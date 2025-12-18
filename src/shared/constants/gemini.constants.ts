/**
 * Константи для роботи з Gemini API
 */

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

export const GEMINI_MODELS = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Найновіша швидка модель' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: 'Швидка та ефективна модель' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'Покращена версія Pro' },
  { value: 'gemini-pro', label: 'Gemini Pro', description: 'Стандартна модель для загального використання' },
  { value: 'gemini-pro-vision', label: 'Gemini Pro Vision', description: 'Модель з підтримкою зображень' },
] as const;

export type GeminiModel = typeof GEMINI_MODELS[number]['value'];

export const CONNECTION_STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
  DISCONNECTED: 'disconnected',
} as const;

export type ConnectionStatus = typeof CONNECTION_STATUS[keyof typeof CONNECTION_STATUS];

