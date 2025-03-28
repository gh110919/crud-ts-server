import { writeFile } from "fs/promises";
import { Req } from "../types";
import { toKebabCase } from "../middlewares/migrate";

export const appendMigrates = async (req: Req) => {
  req.body.create.forEach(async (e: { table: string }) => {
    await writeFile(
      `src/assets/migrates/${toKebabCase(e.table)}.json`,
      JSON.stringify({ create: [e] }),
      "utf-8"
    );
  });
  
  await writeFile("src/assets/migrate.json", JSON.stringify(req.body), "utf-8");
};
