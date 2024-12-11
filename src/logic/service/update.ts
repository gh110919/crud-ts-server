import { TUpdate } from "../../types";
import { TModel } from "../model";

/**
 * Функция сервиса для обновления записи.
 * @param model - Модель для взаимодействия с базой данных.
 * @returns Функция для обновления записи.
 */
export const servicePut = <T>(model: TModel<T>) => {
  return async ({ id, payload }: TUpdate<T>) => {
    return model.update({ id, payload });
  };
};
