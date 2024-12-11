import { Request, Response } from "express";
import { TService } from "../service";
import { control } from "./control";

/**
 * Функция контроллера для создания записей.
 * @param service - Сервис для обработки бизнес-логики.
 * @returns Функция для обработки HTTP-запроса на создание записей.
 */
export const controllerSet = <T>(service: TService<T>) => {
  return async (request: Request, response: Response) => {
    const payload = Array.isArray(request.body) ? request.body : [request.body];

    control<T[]>(response, service.create({ payload }));
  };
};
