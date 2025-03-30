import { writeFile } from "fs/promises";
import { deleteMigrates } from "../helpers/deleteMigrates";
import { Req, Res } from "../types";

export const drop = async (req: Req, res: Res) => {
  try {
    for (const e of req.body.delete as { table: string }[]) {
      // if (await orm.schema.hasTable(e.table)) {
      //   await orm.schema.dropTable(e.table);
      // }

      console.log(`Таблица "${e.table}" успешно удалена!`);
    }

    await deleteMigrates();
    await writeFile("src/assets/migrate.gql", "", "utf-8");
    await writeFile(
      "src/assets/migrate.d.ts",
      "export type TypeMap = {};",
      "utf-8"
    );
    await writeFile(
      "src/assets/endpoints.json",
      JSON.stringify([
        {
          url: "",
          endpoint: "",
          table: "",
          type: "",
        },
      ]),
      "utf-8"
    );
    await writeFile(
      "/src/assets/migrate.json",
      JSON.stringify({
        create: [
          {
            fields: {
              _created_at: "timestamp",
              _id: "string",
              _updated_at: "timestamp",
            },
            table: "",
          },
        ],
      }),
      "utf-8"
    );

    res.status(200).json({
      success: true,
      message: `Все таблицы успешно удалены!`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Исключение при удалении таблиц",
    });

    throw new Error(String(error));
  }
};
