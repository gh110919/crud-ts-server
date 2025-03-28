import { readFileSync } from "fs";
import { Req, Res } from "../types";

export const types = (_: Req, res: Res) => {
  try {
    res.setHeader("Content-disposition", "attachment; filename=migrate.d.ts");
    res.setHeader("Content-Type", "text/typescript");

    res.status(200).send(readFileSync("src/assets/migrate.d.ts", "utf8"));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ошибка при чтении файла типов",
    });

    throw new Error(String(error));
  }
};
