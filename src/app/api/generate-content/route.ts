import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * API endpoint для генерації контенту через Gemini API
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API ключ не налаштовано' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { model, message, history = [], systemInstruction } = body;

    if (!model || !message) {
      return NextResponse.json(
        { error: 'Модель та повідомлення обов\'язкові' },
        { status: 400 }
      );
    }

    // Ініціалізуємо GoogleGenAI з API ключем
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    // Формуємо контент для генерації
    // Якщо є історія, додаємо її до контенту
    let contents: string | Array<{ role: string; parts: Array<{ text: string }> }>;
    
    if (history.length > 0) {
      // Формуємо історію повідомлень для контексту
      contents = [
        ...history.map((msg: { role: string; text: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ] as Array<{ role: string; parts: Array<{ text: string }> }>;
    } else {
      // Якщо історії немає, використовуємо просто текст
      contents = message;
    }

    // Генеруємо контент через новий SDK
    const config: any = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    // Додаємо системну інструкцію якщо вона є
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: config,
    });

    // Отримуємо текст відповіді
    const generatedText = response.text || 'Не вдалося отримати відповідь';

    return NextResponse.json({
      text: generatedText,
      model: model,
    });
  } catch (error: any) {
    console.error('Помилка при генерації контенту:', error);
    
    let errorMessage = 'Внутрішня помилка сервера';
    
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

