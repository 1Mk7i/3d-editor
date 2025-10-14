/**
 * Утиліта для логування з підтримкою різних рівнів та умовного виводу
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Логування для розробки (показується тільки в dev режимі)
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log('[DEV]', ...args);
    }
  },

  /**
   * Попередження (показується тільки в dev режимі)
   */
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn('[DEV WARN]', ...args);
    }
  },

  /**
   * Помилки (показуються завжди)
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },

  /**
   * Інформаційні повідомлення (показуються тільки в dev режимі)
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info('[DEV INFO]', ...args);
    }
  },

  /**
   * Debug повідомлення з контекстом (показуються тільки в dev режимі)
   */
  debug: (context: string, ...args: any[]) => {
    if (isDev) {
      console.log(`[DEBUG ${context}]`, ...args);
    }
  },

  /**
   * Групування логів для кращої читабельності
   */
  group: (label: string, callback: () => void) => {
    if (isDev) {
      console.group(`[DEV GROUP] ${label}`);
      callback();
      console.groupEnd();
    }
  },
};

/**
 * Хелпер для логування об'єктів з форматуванням
 */
export const logObject = (label: string, obj: any) => {
  logger.group(label, () => {
    logger.log(JSON.stringify(obj, null, 2));
  });
};

/**
 * Хелпер для логування помилок з контекстом
 */
export const logError = (context: string, error: unknown) => {
  logger.error(`Error in ${context}:`, error);
  
  if (error instanceof Error) {
    logger.error('Stack trace:', error.stack);
  }
};
