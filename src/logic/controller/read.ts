import { Req, Res } from "../../types";
import { TService } from "../service";
import { responder } from "./responder";

export const controllerGet = async <T>({ read }: TService<T>) => {
  return async ({ query }: Req, res: Res) => {
    await responder(res, read({ query }));
  };
};
