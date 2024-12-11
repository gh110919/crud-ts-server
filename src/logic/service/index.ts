import { TCreate, TRead, TReadReturn, TUpdate, TDelete } from "../../types";
import { TModel } from "../model";
import { serviceSet } from "./create";
import { serviceCut } from "./delete";
import { serviceGet } from "./read";
import { servicePut } from "./update";

/**
 * Типы сервиса.
 */
export type TService<T> = {
  create: ({ payload }: TCreate<T[]>) => Promise<T[]>;
  read: ({
    params,
    query,
    body,
    filters,
    pagination,
    sorting,
  }: TRead) => Promise<TReadReturn<T>>;
  update: ({ id, payload }: TUpdate<T>) => Promise<T | null>;
  delete: ({ id }: TDelete) => Promise<T | null>;
};

/**
 * Функция для создания сервиса.
 * @param model - Модель для взаимодействия с базой данных.
 * @returns Объект с функциями сервиса.
 */
export const service = <T>(model: TModel<T>): TService<T> => ({
  create: serviceSet<T>(model),
  read: serviceGet<T>(model),
  update: servicePut<T>(model),
  delete: serviceCut<T>(model),
});
