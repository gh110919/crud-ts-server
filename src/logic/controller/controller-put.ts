import { Req, Res } from "../../types";
import { TService } from "../service";
import { responder } from "./responder";

export const controllerPut = async <T>({ update }: TService<T>) => {
  return async ({ query, body }: Req, res: Res) => {
    await responder(res, update({ query, body }));
  };
};

export type TControllerPut<T> = ReturnType<typeof controllerPut<T>>;
