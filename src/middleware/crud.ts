import { Router } from "express";
import { router } from "../logic/router";
import { controller } from "../logic/controller";
import { model } from "../logic/model";
import { service } from "../logic/service";
import { TypeMap } from "../assets/migrate";

type TEndpoint = {
  endpoint: string;
  table: string;
  type: string;
};

export const crud = (endpoints: TEndpoint[]): Router[] => {
  return endpoints.map(({ endpoint, table, type }): Router => {
    const typename = type as keyof TypeMap;
    type TType = TypeMap[typeof typename];

    const c = controller<TType>;
    const s = service<TType>;
    const m = model<TType>;

    return router(endpoint, c(s(m(table))));
  });
};
