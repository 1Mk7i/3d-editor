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
      // Збільшуємо ліміт токенів для великих команд (наприклад, створення складних сцен)
      maxOutputTokens: 8192,
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
    let statusCode = 500;
    
    // Обробка помилок Gemini API - перевіряємо різні формати
    let apiError = error?.error || error;
    
    // Якщо помилка вже в правильному форматі
    if (apiError) {
      // Помилка 429 - перевищення квоти
      if (apiError.code === 429 || 
          apiError.status === 'RESOURCE_EXHAUSTED' ||
          (typeof apiError.message === 'string' && apiError.message.includes('quota'))) {
        statusCode = 429;
        const quotaInfo = apiError.details?.find((d: any) => 
          d?.['@type']?.includes('QuotaFailure') || d?.quotaMetric
        );
        const retryInfo = apiError.details?.find((d: any) => 
          d?.['@type']?.includes('RetryInfo') || d?.retryDelay
        );
        
        let retrySeconds = 30;
        if (retryInfo?.retryDelay) {
          // Парсимо "30s" або "30.2s" до секунд
          const retryDelayStr = typeof retryInfo.retryDelay === 'string' 
            ? retryInfo.retryDelay 
            : String(retryInfo.retryDelay);
          const retryMatch = retryDelayStr.match(/(\d+\.?\d*)/);
          if (retryMatch) {
            retrySeconds = Math.ceil(parseFloat(retryMatch[1]));
          }
        }
        
        const limit = quotaInfo?.violations?.[0]?.quotaValue || 
                     apiError.message?.match(/limit:\s*(\d+)/)?.[1] || 
                     'невідомо';
        const model = quotaInfo?.violations?.[0]?.quotaDimensions?.model || 
                     apiError.message?.match(/model:\s*([^\s,]+)/)?.[1] || 
                     'модель';
        
        errorMessage = `Перевищено денну квоту API Gemini (ліміт: ${limit} запитів/день для ${model}). Спробуйте пізніше або оновіть тарифний план.`;
        if (retrySeconds > 0) {
          errorMessage += ` Повтор через ${retrySeconds} секунд.`;
        }
      } else {
        errorMessage = apiError.message || errorMessage;
        statusCode = apiError.code || statusCode;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

