import { Request } from "express";
import { TFPS, TRequest } from "../../types";
/**
 * Функция проверяет, пуст ли объект.
 * @param obj - Объект для проверки.
 * @returns true, если объект не пустой, иначе false.
 */
export const notEmpty = (obj: any) => Object.keys(obj).length == 0;

export const parseProperties = (req: Request, properties: string[]) => {
  return new Promise((resolve, reject) => {
    const { body, params, query }: TRequest = req;

    let combined: any = {};

    try {
      properties?.forEach((prop) => {
        if (query[prop]) {
          combined[prop] = query[prop];
        }
        if (params[prop]) {
          combined[prop] = params[prop];
        }
        if (body[prop]) {
          combined[prop] = body[prop];
        }
      });

      resolve(combined);
    } catch (error) {
      reject(error);
    }
  });
};
