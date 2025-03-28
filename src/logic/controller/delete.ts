import { Req, Res } from "../../types";
import { TService } from "../service";
import { responder } from "./responder";

export const controllerCut = async <T>({ destroy }: TService<T>) => {
  return async ({ query }: Req, res: Res) => {
    await responder(res, destroy({ query }));
  };
};
