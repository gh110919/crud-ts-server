import { Request, Response } from "express";
import { TService } from "../service";
import { control } from "./control";
import { parseProperties } from "./utils";

export const controllerGet = <T>(service: TService<T>) => {
  return async (request: Request, response: Response) => {
    control(
      response,
      service.read(
        await parseProperties(request, ["filters", "pagination", "sorting"]),
      ),
    );
  };
};
