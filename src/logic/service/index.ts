import { TModel } from "../model";
import { serviceSet, TServiceSet } from "./service-set";
import { serviceCut, TServiceCut } from "./service-cut";
import { serviceGet, TServiceGet } from "./service-get";
import { servicePut, TServicePut } from "./service-put";

export type TService<T> = {
  create: Awaited<TServiceSet<T>>;
  read: Awaited<TServiceGet<T>>;
  update: Awaited<TServicePut<T>>;
  destroy: Awaited<TServiceCut<T>>;
};

export const service = async <T>(model: TModel<T>): Promise<TService<T>> => ({
  create: await serviceSet<T>(model),
  read: await serviceGet<T>(model),
  update: await servicePut<T>(model),
  destroy: await serviceCut<T>(model),
});
