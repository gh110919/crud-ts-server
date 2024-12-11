import { TDelete } from "../../types";
import { TModel } from "../model";

/**
 * Функция сервиса для удаления записи.
 * @param model - Модель для взаимодействия с базой данных.
 * @returns Функция для удаления записи.
 */
export const serviceCut = <T>(model: TModel<T>) => {
  return async ({ id }: TDelete) => {
    if (!id) {
      throw new Error("не указан id");
    }
    return model.delete({ id });
  };
};
