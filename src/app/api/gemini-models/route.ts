import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

/**
 * API endpoint для отримання списку доступних моделей Gemini
 */
export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API ключ не налаштовано' },
        { status: 500 }
      );
    }

    // Ініціалізуємо GoogleGenAI з API ключем
    const ai = new GoogleGenAI({
      apiKey: apiKey,
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

