import { NextFunction, Router } from "express";
import { TypeMap } from "../assets/migrate";
import { controller } from "../logic/controller";
import { model } from "../logic/model";
import { router } from "../logic/router";
import { service } from "../logic/service";
import { Req, Res } from "../types";
import { imports } from "./imports";
import { singleton } from "./singleton";

export type TEndpoint = {
  url: string;
  endpoint: string;
  table: string;
  type: string;
};

const { controllers, models, routers, services } = {
  models: new Map<string, any>(),
  services: new Map<string, any>(),
  controllers: new Map<string, any>(),
  routers: new Map<string, any>(),
};

const createEndpoint = async ({ endpoint, table, type }: TEndpoint) => {
  const typename = type as keyof TypeMap;
  type TType = TypeMap[typeof typename];

  const promiseModel = await model<TType>(table);
  const m = singleton(models, promiseModel, table);

  const promiseService = await service<TType>(m);
  const s = singleton(services, promiseService, table);

  const promiseController = await controller<TType>(s);
  const c = singleton(controllers, promiseController, table);

  const promiseRouter = await router(endpoint, c);
  const r = singleton(routers, promiseRouter, table);

  return r;
};

let appRouter: Router;

export const initCrud = async () => {
  const reducer = (router: Router, route: Router) => router.use(route);

  const routers = imports.endpoints.map(createEndpoint);

  appRouter = (await Promise.all(routers)).reduce(reducer, Router());
};

export const crud = (req: Req, res: Res, next: NextFunction) => {
  appRouter(req, res, next);
};
