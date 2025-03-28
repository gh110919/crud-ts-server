import { readFile, writeFile } from "fs/promises";
import { Req } from "../types";

export type TDrop = { delete: { table: string }[] };

export const appendDrops = async (req: Req) => {
  let jsonData: TDrop = JSON.parse(
    await readFile("src/assets/drop.json", "utf-8")
  );

  req.body.create.forEach((e: { table: string }) => {
    if (!jsonData.delete.some((item) => item.table === e.table)) {
      jsonData.delete.push({ table: e.table });
    }
  });

  await writeFile(
    "src/assets/drop.json",
    JSON.stringify(jsonData, null, 2),
    "utf8"
  );
};
