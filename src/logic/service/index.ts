import { TCreate, TDestroy, TRead, TReadReturn, TUpdate } from "../../types";
import { TModel } from "../model";
import { serviceSet } from "./create";
import { serviceCut } from "./delete";
import { serviceGet } from "./read";
import { servicePut } from "./update";

export type TService<T> = {
  create: ({ body }: TCreate<T[]>) => Promise<T[]>;
  read: ({ query }: TRead) => Promise<TReadReturn<T>>;
  update: ({ query, body }: TUpdate<T>) => Promise<T[]>;
  destroy: ({ query }: TDestroy) => Promise<T[]>;
};

export const service = async <T>(model: TModel<T>): Promise<TService<T>> => ({
  create: await serviceSet<T>(model),
  read: await serviceGet<T>(model),
  update: await servicePut<T>(model),
  destroy: await serviceCut<T>(model),
});
