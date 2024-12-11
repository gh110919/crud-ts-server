import { orm } from "../../middleware/orm";
import { TDelete } from "../../types";

/**
 * Функция модели для удаления записи.
 * @param table - Название таблицы в базе данных.
 * @returns Функция для удаления записи.
 */
export const modelCut = <T>(table: string) => {
  return async ({ id }: TDelete): Promise<T | null> => {
    const item = await orm(table).where({ id }).first();
    await orm(table).where({ id }).delete();
    return item;
  };
};
