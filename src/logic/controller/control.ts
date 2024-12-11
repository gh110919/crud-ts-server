import { Response } from "express";

/**
 * Универсальная функция для обработки запросов и отправки ответов.
 * @param response - Объект ответа.
 * @param data - Промис с данными для отправки.
 */
export const control = async <T>(response: Response, data: Promise<T>) => {
  try {
    return response.status(200).json({
      success: true,
      message: await data,
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      success: false,
      message: `Исключение рест-сервера ${error}`,
    });
  }
};
