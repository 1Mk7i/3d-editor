import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * API endpoint для отримання списку доступних моделей Gemini
 */
export async function GET(request: NextRequest) {
  try {
    const userApiKey = request.headers.get('x-api-key');
    const serverApiKey = process.env.GEMINI_API_KEY;
    
    console.log('gemini-models - userApiKey присутній:', !!userApiKey);
    console.log('gemini-models - serverApiKey присутній:', !!serverApiKey);
    
    const FINAL_API_KEY = userApiKey || serverApiKey;

    if (!FINAL_API_KEY) {
      console.error('gemini-models - API ключ відсутній!');
      return NextResponse.json(
        { 
          error: 'API ключ не налаштовано. Введіть ключ у полі "Gemini API Key" або встановіть GEMINI_API_KEY в .env.local' 
        },
        { status: 401 }
      );
    }

    // Ініціалізуємо GoogleGenAI з API ключем
    const ai = new GoogleGenAI({
      apiKey: FINAL_API_KEY,
    });

    // Отримуємо список моделей через новий SDK
    const modelsPager = await ai.models.list();
    
    // Конвертуємо Pager в масив
    const models: any[] = [];
    for await (const model of modelsPager) {
      models.push(model);
    }

    // Фільтруємо тільки моделі Gemini, які підтримують generateContent
    const geminiModels = models
      .filter((model: any) => 
        model.name?.includes('gemini') && 
        model.supportedGenerationMethods?.includes('generateContent')
      )
      .map((model: any) => ({
        name: model.name,
        displayName: model.displayName || model.name,
        description: model.description || '',
        inputTokenLimit: model.inputTokenLimit || 0,
        outputTokenLimit: model.outputTokenLimit || 0,
      }))
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));

    return NextResponse.json({ models: geminiModels });
  } catch (error: any) {
    console.error('Помилка при отриманні моделей:', error);
    
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

