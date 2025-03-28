import { readFile, unlink } from "fs";
import path from "path";
import { promisify } from "util";
import { toKebabCase } from "../middlewares/migrate";

const readFileAsync = promisify(readFile);
const unlinkAsync = promisify(unlink);

export const deleteMigrates = async () => {
  try {
    const data = await readFileAsync("src/assets/drop.json", "utf8");
    const jsonData: { delete: { table: string }[] } = JSON.parse(data);

    for (const { table } of jsonData.delete) {
      const filePath = path.join(
        "src/assets/migrates",
        `${toKebabCase(table)}.json`,
      );

      try {
        await unlinkAsync(filePath);
        console.log(`Successfully deleted ${filePath}`);
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    }
  } catch (err) {
    console.error("Error reading drop.json:", err);
  }
};
