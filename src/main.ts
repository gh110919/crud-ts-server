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

  const urls = async () => {
    const interfaces = Object.values(networkInterfaces()).flat();
    const ip = interfaces.find((e) => e?.family === "IPv4" && !e?.internal);

    const endpoints = JSON.parse(
      await readFile("src/assets/endpoints.json", "utf8")
    );

    const modifiedEndpoints = endpoints.map((e: TEndpoint) => {
      if (e && e.url.length !== 0) {
        const url = new URL(e.url);
        url.hostname = ip?.address!;
        url.port = PORT;
        return { url: url.toString() };
      }
    });

    console.table(
      modifiedEndpoints.map((e: { url: string }) => {
        return e && e.url.length !== 0 ? e.url : "";
      })
    );
  };

  await urls();
})();
