import { Request, Response } from "express";
import { readFileSync } from "fs";

export const types = (_: Request, res: Response) => {
  try {
    res.setHeader("Content-disposition", "attachment; filename=migrate.d.ts");
    res.setHeader("Content-Type", "text/typescript");

    res
      .status(200)
      .send(readFileSync("src/assets/migrate.d.ts", "utf8"));
  } catch (error) {
    console.error("Ошибка при чтении файла типов:", error);
    res.status(500).json({
      success: false,
      message: `Ошибка при чтении файла типов: ${error}`,
    });
  }
};
