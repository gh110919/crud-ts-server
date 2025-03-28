import { Router } from "express";
import { TController } from "./controller";

export const router = async (endpoint: string, controller: TController) => {
  return ((
    router: Router,
    endpoint: string,
    { create, read, update, destroy }
  ) => {
    return router
      .post(endpoint, create)
      .get(endpoint, read)
      .put(endpoint, update)
      .patch(endpoint, update)
      .delete(endpoint, destroy);
  })(Router(), endpoint, controller);
};
