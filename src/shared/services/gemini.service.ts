/**
 * Сервіс для роботи з Gemini API
 */

import { DEFAULT_GEMINI_MODEL, GeminiModel } from '@/shared/constants/gemini.constants';
import { ChatMessage, GeminiModelInfo } from '@/shared/types/chat.types';

export interface GenerateContentResponse {
  text: string;
  model: string;
}

// Експортуємо типи для зручності
export type { GeminiModelInfo, ChatMessage };

/**
 * Отримує список доступних моделей Gemini
 */
export async function fetchGeminiModels(): Promise<GeminiModelInfo[]> {
  try {
    const response = await fetch('/api/gemini-models');
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Якщо не вдалося розпарсити JSON
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch {
          // Залишаємо стандартне повідомлення
        }
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Перевіряємо наявність помилки в успішній відповіді
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.models || [];
  } catch (error) {
    console.error('Помилка при отриманні моделей:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Невідома помилка при отриманні моделей');
  }
}

/**
 * Генерує контент через Gemini API
 */
export async function generateContent(
  message: string,
  model: GeminiModel = DEFAULT_GEMINI_MODEL,
  history: Array<{ role: 'user' | 'bot'; text: string }> = []
): Promise<GenerateContentResponse> {
  try {
    const response = await fetch('/api/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        message,
        history: history.map(msg => ({
          role: msg.role,
          text: msg.text,
        })),
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Якщо не вдалося розпарсити JSON, використовуємо текст
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch {
          // Якщо і це не спрацювало, залишаємо стандартне повідомлення
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Перевіряємо наявність помилки в успішній відповіді
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Помилка при генерації контенту:', error);
    // Перекидаємо помилку далі, але з більш зрозумілим повідомленням
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Невідома помилка при генерації контенту');
  }
}

/**
 * Перевіряє доступність API
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    const response = await fetch('/api/gemini-models');
    return response.ok;
  } catch (error) {
    return false;
  }
}

