import { Request, Response } from "express";
import { TService } from "../service";
import { controllerSet } from "./create";
import { controllerCut } from "./delete";
import { controllerGet } from "./read";
import { controllerPut } from "./update";

/**
 * Типы контроллера.
 */
export type TController = {
  create: (request: Request, response: Response) => Promise<void>;
  read: (request: Request, response: Response) => Promise<void>;
  update: (request: Request, response: Response) => Promise<void>;
  delete: (request: Request, response: Response) => Promise<void>;
};

/**
 * Функция для создания контроллеров.
 * @param service - Сервис для обработки бизнес-логики.
 * @returns Объект с функциями контроллеров.
 */
export const controller = <T>(service: TService<T>): TController => ({
  create: controllerSet<T>(service),
  read: controllerGet<T>(service),
  update: controllerPut<T>(service),
  delete: controllerCut<T>(service),
});
