import { Router } from "express";
import { TController } from "./controller";

export const router = (endpoint: string, controller: TController): Router => {
  return ((
    router: Router,
    endpoint: string,
    controller: TController,
  ): Router => {
    return router
      .post(`${endpoint}`, controller.create)
      .get(`${endpoint}`, controller.read)
      .put(`${endpoint}`, controller.update)
      .patch(`${endpoint}`, controller.update)
      .delete(`${endpoint}`, controller.delete);
  })(Router(), endpoint, controller);
};
