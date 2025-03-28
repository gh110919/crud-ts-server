import { readFile } from "fs/promises";
import { Req, Res } from "../types";

export const endpoints = async (_: Req, res: Res) => {
  try {
    res.status(200).json({
      success: true,
      message: JSON.parse(await readFile("src/assets/endpoints.json", "utf8")),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ошибка при чтении файла с конечными точками",
    });

    throw new Error(String(error));
  }
};
