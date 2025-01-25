import { Router } from "express";
import { TController } from "./controller";

export const router = (endpoint: string, controller: TController): Router => {
  return ((
    router: Router,
    endpoint: string,
    { create, read, update, delete: destroy }: TController
  ): Router => {
    return router
      .post(endpoint, create)
      .get(endpoint, read)
      .put(endpoint, update)
      .patch(endpoint, update)
      .delete(endpoint, destroy);
  })(Router(), endpoint, controller);
};
