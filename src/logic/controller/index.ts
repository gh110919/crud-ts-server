import { TService } from "../service";
import { controllerSet, TControllerSet } from "./controller-set";
import { controllerCut, TControllerCut } from "./controller-cut";
import { controllerGet, TControllerGet } from "./controller-get";
import { controllerPut, TControllerPut } from "./controller-put";

export type TController<T> = {
  create: Awaited<TControllerSet<T>>;
  read: Awaited<TControllerGet<T>>;
  update: Awaited<TControllerPut<T>>;
  destroy: Awaited<TControllerCut<T>>;
};

export const controller = async <T>(
  service: TService<T>
): Promise<TController<T>> => ({
  create: await controllerSet<T>(service),
  read: await controllerGet<T>(service),
  update: await controllerPut<T>(service),
  destroy: await controllerCut<T>(service),
});
