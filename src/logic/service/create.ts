import { TCreate } from "../../types";
import { TModel } from "../model";

/**
 * Функция сервиса для создания записей.
 * @param model - Модель для взаимодействия с базой данных.
 * @returns Функция для создания новых записей.
 */
export const serviceSet = <T>(model: TModel<T>) => {
  return async ({ payload }: TCreate<T[]>) => {
    return model.create({ payload });
  };
};
