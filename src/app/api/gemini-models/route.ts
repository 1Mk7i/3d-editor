import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userApiKey = request.headers.get('x-api-key');

    if (!userApiKey) {
      return NextResponse.json(
        { error: 'Будь ласка, введіть API ключ у полі налаштувань чату.' },
        { status: 401 }
      );
    }

    const googleResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${userApiKey}`
    );

    if (!googleResponse.ok) {
      const errorData = await googleResponse.json();
      throw new Error(errorData.error?.message || 'Помилка Google API (можливо, ключ невірний)');
    }

    const data = await googleResponse.json();

    const geminiModels = data.models
      .filter((model: any) => 
        model.name?.includes('gemini') && 
        model.supportedGenerationMethods?.includes('generateContent')
      )
      .map((model: any) => ({
        name: model.name,
        displayName: model.displayName || model.name,
      }));

    return NextResponse.json({ models: geminiModels });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Помилка підключення' },
      { status: 500 }
    );
  }
}