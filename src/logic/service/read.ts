import { TRead, TReadReturn } from "../../types";
import { TModel } from "../model";

/**
 * Функция сервиса для чтения записи.
 * @param model - Модель для взаимодействия с базой данных.
 * @returns Функция для чтения записи с поддержкой фильтрации, пагинации и сортировки.
 */
export const serviceGet = <T>(model: TModel<T>) => {
  return async ({
    filters,
    pagination,
    sorting,
  }: TRead): Promise<TReadReturn<T>> => {
    return await model.read({
      filters,
      pagination,
      sorting,
    });
  };
};
