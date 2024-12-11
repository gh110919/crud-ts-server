import { Request, Response } from "express";
import { TService } from "../service";
import { control } from "./control";

/**
 * Функция контроллера для удаления записи.
 * @param service - Сервис для обработки бизнес-логики.
 * @returns Функция для обработки HTTP-запроса на удаление записи.
 */
export const controllerCut = <T>(service: TService<T>) => {
  return async (request: Request, response: Response) => {
    control<T | null>(
      response,
      service.delete({
        id: String(request.params.id || request.query.id || request.body.id),
      }),
    );
  };
};
