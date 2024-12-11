import { Request, Response } from "express";
import { readFileSync } from "fs";

export const endpoints = (_: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: JSON.parse(
        readFileSync("src/assets/endpoints.json", "utf8"),
      ),
    });
  } catch (error) {
    console.error("Ошибка при чтении файла с конечными точками:", error);
    res.status(500).json({
      success: false,
      message: `Ошибка при чтении файла с конечными точками: ${error}`,
    });
  }
};
