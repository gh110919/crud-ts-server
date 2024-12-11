import { Request, Response } from "express";
import { writeFileSync } from "fs";
import { orm } from "../middleware/orm";

export const drop = async (req: Request, res: Response) => {
  try {
    req.body.delete.forEach(async (e: { table: string }) => {
      await orm.schema.dropTableIfExists(e.table);
      console.log(`Таблица "${e.table}" успешно удалена!`);
    });

    writeFileSync(
      "src/assets/endpoints.json",
      JSON.stringify([]),
      "utf-8",
    );

    writeFileSync(
      "src/assets/migrate.json",
      JSON.stringify([]),
      "utf-8",
    );

    writeFileSync(
      "src/assets/migrate.d.ts",
      JSON.stringify(null),
      "utf-8",
    );

    res.status(200).json({
      success: true,
      message: `Все таблицы успешно удалены!`,
    });
  } catch (error) {
    console.log("error", error);

    res.status(500).json({
      success: false,
      message: `Исключение при удалении таблиц: ${error}`,
    });
  }
};
