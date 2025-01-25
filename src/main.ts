import { json, Request, Response, urlencoded } from "express";
import { readFileSync } from "fs";
import { networkInterfaces } from "os";
import { SecureContextOptions } from "tls";
import { drop } from "./helpers/drop";
import { endpoints } from "./helpers/endpoints";
import { migrate } from "./helpers/migrate";
import { types } from "./helpers/types";
import { crud } from "./middleware/crud";
import { imports } from "./middleware/imports";
import { store } from "./middleware/s3/store";
import { purge } from "./middleware/s3/purge";

(async function () {
  const express = (await import("express")).default();
  const http = (await import("http")).default;
  const https = (await import("https")).default;
  const cors = (await import("cors")).default;

  const listener = async () => {
    try {
      express
        .options("*", cors({ origin: "*" }))
        .set("trust proxy", "linklocal")
        .use(cors())
        .use(json())
        .use(urlencoded({ extended: true }))
        .delete("/api/drop", drop)
        .patch("/api/migrate", migrate)
        .get("/api/endpoints", endpoints)
        .get("/api/types", types)
        .post("/api/store", store)
        .delete("/api/purge", purge)
        .use("/api/crud", crud(imports.endpoints))
        .get("/", (_: Request, res: Response) => {
          res.status(200).send(true);
        });
    } catch (error) {
      console.error(`Ошибка экспресс сервера: ${error}`);
    }
  };

  const ssl: SecureContextOptions = {
    /* самоподписные сертификаты сгенерированы на локальный хост и выданы на 1000 лет */
    key: readFileSync(".local/private_key.pem"),
    cert: readFileSync(".local/fullchain.pem"),
  };

  const ports = {
    http: 3080,
    https: 3443,
  };

  http.createServer(express).listen(ports.http, listener);
  https.createServer(ssl, express).listen(ports.https, listener);

  const host = () => {
    const interfaces = Object.values(networkInterfaces()).flat();
    const ip = interfaces.find((e) => e?.family === "IPv4" && !e?.internal);
    return {
      http: `http://${ip?.address}:${ports.http}`,
      https: `https://${ip?.address}:${ports.https}`,
    };
  };

  console.log(host());
})();
