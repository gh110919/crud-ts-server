import { readFile } from "fs/promises";
import { Req, Res } from "../types";
import { TEndpoint } from "./crud";

export const endpoints = async (req: Req, res: Res) => {
  try {
    res.status(200).json({
      success: true,
      message: JSON.parse(
        await readFile("src/assets/endpoints.json", "utf8")
      ).map((e: TEndpoint) => {
        const { url, ...other } = e;
        if (e && e.url.length !== 0) {
          const url = new URL(e.url);

          const { hostname, port } = new URL(
            `${req.protocol}://${req.get("host")}`
          );

          url.hostname = hostname;
          url.port = port;

          return { url: url.toString(), ...other };
        }
      }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ошибка при чтении файла с конечными точками",
    });

    throw new Error(String(error));
  }
};
