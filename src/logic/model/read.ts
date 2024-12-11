import { orm } from "../../middleware/orm";
import { TRead, TReadReturn } from "../../types";

/**
 * Функция модели для чтения записи.
 * @param table - Название таблицы в базе данных.
 * @returns Функция для чтения записи с поддержкой фильтрации, пагинации и сортировки.
 */
export const modelGet = <T>(table: string) => {
  return async (request?: TRead): Promise<TReadReturn<T>> => {
    const { filters, pagination, sorting } = request || {};

    const qb = orm(table);

    if (filters) {
      qb.where(filters);
    }

    if (pagination?.limit !== undefined) {
      qb.limit(pagination.limit);
    }
    if (pagination?.offset !== undefined) {
      qb.offset(pagination.offset);
    }

    if (sorting?.sortBy) {
      qb.orderBy(sorting.sortBy, sorting.order || "asc");
    }

    const payload = await qb;

    const total = (await qb.count("* as count")).find((e) => e.count);

    return pagination ? { payload, total: +total?.count! } : { ...payload };
  };
};
