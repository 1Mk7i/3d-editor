const isDev = process.env.NODE_ENV === 'development';

/**
 * Словник для перекладу технічних помилок у зрозумілі користувачу
 */
export const getFriendlyErrorMessage = (error: any): string => {
  const message = error?.message || String(error);
  
  if (message.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
    return 'Перевищено ліміт запитів Gemini. Спробуйте через хвилину або перевірте квоту.';
  }
  if (message.includes('API ключ') || message.includes('401') || message.includes('invalid key')) {
    return 'Проблема з API ключем. Перевірте правильність ключа у налаштуваннях.';
  }
  if (message.includes('network') || message.includes('fetch') || message.includes('Failed to fetch')) {
    return 'Помилка мережі. Перевірте з’єднання з інтернетом.';
  }
  if (message.includes('model not found') || message.includes('404')) {
    return 'Обрана модель тимчасово недоступна. Спробуйте іншу.';
  }

  return message || 'Сталася невідома помилка. Спробуйте ще раз.';
};

export const logger = {
  log: (...args: any[]) => isDev && console.log('%c[DEV]', 'color: #2196F3; font-weight: bold;', ...args),
  warn: (...args: any[]) => isDev && console.warn('%c[WARN]', 'color: #FF9800; font-weight: bold;', ...args),
  info: (...args: any[]) => isDev && console.info('%c[INFO]', 'color: #4CAF50; font-weight: bold;', ...args),
  error: (...args: any[]) => console.error('%c[ERROR]', 'color: #F44336; font-weight: bold;', ...args),
  
  debug: (context: string, ...args: any[]) => {
    if (isDev) console.log(`%c[DEBUG ${context}]`, 'color: #9C27B0; font-weight: bold;', ...args);
  },

  group: (label: string, callback: () => void) => {
    if (isDev) {
      console.group(`%c[GROUP] ${label}`, 'color: #795548; font-weight: bold;');
      callback();
      console.groupEnd();
    }
  },
};

export const logError = (context: string, error: unknown) => {
  logger.error(`Error in ${context}:`, error);
  if (error instanceof Error && isDev && error.stack) {
    logger.debug(`${context}_STACK`, error.stack);
  }
};