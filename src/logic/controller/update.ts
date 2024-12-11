import { Request, Response } from "express";
import { TService } from "../service";
import { control } from "./control";

/**
 * Функция контроллера для обновления записи.
 * @param service - Сервис для обработки бизнес-логики.
 * @returns Функция для обработки HTTP-запроса на обновление записи.
 */
export const controllerPut = <T>(service: TService<T>) => {
  return async (request: Request, response: Response) => {
    control<T | null>(
      response,
      service.update({
        id: String(request.body.id || request.params.id || request.query.id),
        payload: request.body,
      }),
    );
  };
};
