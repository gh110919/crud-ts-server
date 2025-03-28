import { Req, Res } from "../../types";
import { TService } from "../service";
import { responder } from "./responder";

export const controllerSet = async <T>({ create }: TService<T>) => {
  return async ({ body }: Req, res: Res) => {
    await responder(res, create({ body: Array.isArray(body) ? body : [body] }));
  };
};
