import { TCreate, TRead, TReadReturn, TUpdate, TDelete } from "../../types";
import { modelSet } from "./create";
import { modelCut } from "./delete";
import { modelGet } from "./read";
import { modelPut } from "./update";

/**
 * Типы модели.
 */
export type TModel<T> = {
  create: ({ payload }: TCreate<T[]>) => Promise<T[]>;
  read: (request?: TRead) => Promise<TReadReturn<T>>;
  update: ({ id, payload }: TUpdate<T>) => Promise<T | null>;
  delete: ({ id }: TDelete) => Promise<T | null>;
};

/**
 * Функция для создания модели.
 * @param table - Название таблицы в базе данных.
 * @returns Объект с функциями модели.
 */
export const model = <T>(table: string): TModel<T> => ({
  create: modelSet<T>(table),
  read: modelGet<T>(table),
  update: modelPut<T>(table),
  delete: modelCut<T>(table),
});
