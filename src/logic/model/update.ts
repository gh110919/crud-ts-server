import { orm } from "../../middleware/orm";
import { TUpdate } from "../../types";

/**
 * Функция модели для обновления записи.
 * @param table - Название таблицы в базе данных.
 * @returns Функция для обновления записи.
 */
export const modelPut = <T>(table: string) => {
  return async ({ id, payload }: TUpdate<T>): Promise<T | null> => {
    const updated_at = orm.fn.now();
    await orm(table)
      .where({ id })
      .update({ ...payload, updated_at });
    return orm(table).where({ id }).first();
  };
};
