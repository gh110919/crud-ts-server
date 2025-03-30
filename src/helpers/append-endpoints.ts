import { readFile, writeFile } from "fs/promises";
import { Req } from "../types";
import { toCamelCase } from "../middlewares/migrate";
import { TEndpoint } from "../middlewares/crud";

export const appendEndpoints = async (req: Req) => {
  try {
    const jsonData: TEndpoint[] = JSON.parse(
      await readFile("src/assets/endpoints.json", "utf8")
    );

    req.body.create.forEach((e: { table: string }) => {
      const endpoint = {
        url: `${req.protocol}://${req.get("host")}/api/crud/${e.table}`,
        endpoint: `/${e.table}`,
        table: e.table,
        type: `${e.table.charAt(0).toUpperCase()}${toCamelCase(e.table.slice(1))}`,
      };

      if (!jsonData.some((item) => item.table === e.table)) {
        jsonData.push(endpoint);
      }
    });

    await writeFile(
      "src/assets/endpoints.json",
      JSON.stringify(
        jsonData.filter((e) => e.endpoint !== ""),
        null,
        2
      ),
      "utf8"
    );
  } catch (error) {
    throw new Error(String(error));
  }
};
