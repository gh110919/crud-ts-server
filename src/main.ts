import { config } from "dotenv";
import { json, urlencoded } from "express";
import { createServer } from "http";
import { networkInterfaces } from "os";
import { killProcessOnPort } from "./helpers/kill-process";
import { basicAuth } from "./middlewares/basicAuth";
import { crud, initCrud, TEndpoint } from "./middlewares/crud";
import { drop } from "./middlewares/drop";
import { endpoints } from "./middlewares/endpoints";
import { gql_mw } from "./middlewares/gql";
import { migrate } from "./middlewares/migrate";
import { types } from "./middlewares/types";
import { Req, Res } from "./types";
import { readFile } from "fs/promises";
import axios from "axios";

(async function () {
  const { PORT } = config({ path: ".local/.env" }).parsed!;
  const express = (await import("express")).default();
  const cors = (await import("cors")).default;

  await killProcessOnPort(+PORT);
  await initCrud();

  const listener = async () => {
    try {
      express
        .use(cors())
        .use(json())
        .use(urlencoded({ extended: true }))
        .set("trust proxy", "linklocal")
        .delete("/api/drop", /* basicAuth, */ drop)
        .patch("/api/migrate", /* basicAuth, */ migrate)
        .get("/api/endpoints", /* basicAuth, */ endpoints)
        .get("/api/types", /* basicAuth, */ types)
        .use("/api/crud", /* basicAuth, */ crud)
        .use("/api/gql", /* basicAuth, */ gql_mw)
        .get("/", (_: Req, res: Res) => {
          res.status(200).send(true);
        });
    } catch (error) {
      console.error(`Ошибка экспресс сервера: ${error}`);

      throw new Error(String(error));
    }
  };

  createServer(express).listen(PORT, listener);

  const { address } = Object.values(networkInterfaces())
    .flat()
    .find(({ family, internal }: any) => family === "IPv4" && !internal)!;

  axios.get(`http://${address}:${PORT}/api/endpoints`).then((r) => {
    if (r.data.success) {
      console.table(r.data.message);
    }
  });
})();
