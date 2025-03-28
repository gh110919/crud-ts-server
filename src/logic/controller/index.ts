import { Req, Res } from "../../types";
import { TService } from "../service";
import { controllerSet } from "./create";
import { controllerCut } from "./delete";
import { controllerGet } from "./read";
import { controllerPut } from "./update";

export type TController = {
  create: (req: Req, res: Res) => Promise<void>;
  read: (req: Req, res: Res) => Promise<void>;
  update: (req: Req, res: Res) => Promise<void>;
  destroy: (req: Req, res: Res) => Promise<void>;
};

export const controller = async <T>(
  service: TService<T>
): Promise<TController> => ({
  create: await controllerSet<T>(service),
  read: await controllerGet<T>(service),
  update: await controllerPut<T>(service),
  destroy: await controllerCut<T>(service),
});
