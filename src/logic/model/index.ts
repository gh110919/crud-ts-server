import { TCreate, TDestroy, TRead, TReadReturn, TUpdate } from "../../types";
import { modelSet } from "./create";
import { modelCut } from "./delete";
import { modelGet } from "./read";
import { modelPut } from "./update";

export type TModel<T> = {
  create: ({ body }: TCreate<T[]>) => Promise<T[]>;
  read: ({ query }: TRead) => Promise<TReadReturn<T>>;
  update: ({ query, body }: TUpdate<T>) => Promise<T[]>;
  destroy: ({ query }: TDestroy) => Promise<T[]>;
};

export const model = async <T>(table: string): Promise<TModel<T>> => ({
  create: await modelSet<T>(table),
  read: await modelGet<T>(table),
  update: await modelPut<T>(table),
  destroy: await modelCut<T>(table),
});
