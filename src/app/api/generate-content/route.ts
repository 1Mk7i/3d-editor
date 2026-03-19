import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const userApiKey = request.headers.get('x-api-key');

    if (!userApiKey) {
      return NextResponse.json(
        { error: 'API ключ не вказано. Будь ласка, введіть його в налаштуваннях чату.' },
        { status: 401 }
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

    const ai = new GoogleGenAI({
      apiKey: userApiKey,
    });

    const contents = [
      ...history.map((msg: { role: string; text: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const config: any = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: config,
    });

    const generatedText = response.text || 'Не вдалося отримати відповідь';

    return NextResponse.json({
      text: generatedText,
      model: model,
    });

  } catch (error: any) {
    console.error('Помилка при генерації контенту:', error);
    
    let errorMessage = error.message || 'Внутрішня помилка сервера';
    let statusCode = 500;

    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      statusCode = 429;
      errorMessage = 'Перевищено ліміт запитів Gemini. Спробуйте через хвилину.';
    } else if (errorMessage.includes('API key not valid')) {
      statusCode = 401;
      errorMessage = 'Ваш API ключ недійсний. Перевірте його в налаштуваннях.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}