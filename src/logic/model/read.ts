import { orm } from "../../middleware/orm";
import { TRead, TReadReturn } from "../../types";

/**
 * Функция модели для чтения записи.
 * @param table - Название таблицы в базе данных.
 * @returns Функция для чтения записи с поддержкой фильтрации, пагинации и сортировки.
 */
export const modelGet = <T>(table: string) => {
  return async (request?: TRead): Promise<TReadReturn<T>> => {
    const { filters, pagination, sorting } = request!;
    let query = orm.read(table);

    if (filters) {
      query = orm.filtering(table, { ...filters });
    }

    if (pagination) {
      const { offset = 1, limit = 10 } = pagination;

      query = orm.pagination(table, offset, limit);
    }

    if (sorting) {
      const { sortBy, order = "asc" } = sorting;
      query = orm.sorting(table, sortBy!, order);
    }

    return {
      payload: await query,
      total: await orm.count(table),
    };
  };
};
