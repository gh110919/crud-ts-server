import { TCreate, TDestroy, TRead, TReadReturn, TUpdate } from "../../types";
import { modelSet, TModelSet } from "./model-set";
import { modelCut, TModelCut } from "./model-cut";
import { modelGet, TModelGet } from "./model-get";
import { modelPut, TModelPut } from "./model-put";

export type TModel<T> = {
  create: Awaited<TModelSet<T>>;
  read: Awaited<TModelGet<T>>;
  update: Awaited<TModelPut<T>>;
  destroy: Awaited<TModelCut<T>>;
};

export const model = async <T>(table: string): Promise<TModel<T>> => ({
  create: await modelSet<T>(table),
  read: await modelGet<T>(table),
  update: await modelPut<T>(table),
  destroy: await modelCut<T>(table),
});
