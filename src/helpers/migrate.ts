import { Request, Response } from "express";
import { Knex } from "knex";
import { orm } from "../middleware/orm";
import { typing } from "./typing";
import { writeFile } from "fs/promises";

export type TMigrate = {
  table: string;
  fields: {
    [x: string]:
      | "string"
      | "text"
      | "integer"
      | "boolean"
      | "foreign"
      | "timestamp";
  };
};

const modifyTable = async (
  table: Knex.AlterTableBuilder,
  fields: TMigrate["fields"],
  columns: Record<string | number | symbol, Knex.ColumnInfo>
) => {
  const foreignKeys: { [key: string]: any } = {};

  Object.entries(fields).forEach(([field, type]) => {
    if (!columns[field]) {
      if (type === "string") {
        table.string(field);
      } else if (type === "text") {
        table.text(field);
      } else if (type === "integer") {
        table.integer(field);
      } else if (type === "boolean") {
        table.boolean(field);
      } else if (type === "timestamp") {
        table.timestamp(field).defaultTo(orm.fn.now());
      } else if (type === "foreign") {
        const [key, id, table_] = field.split(".");
        foreignKeys[key] = { id, table_ };
      }
    }
  });

  for (const [key, { id, table_ }] of Object.entries(foreignKeys)) {
    if (!Object.keys(columns).includes(key)) {
      table.foreign(key).references(id).inTable(table_);
    }
  }

  Object.keys(columns).forEach((column) => {
    if (!fields[column]) table.dropColumn(column);
  });
};

export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const migrate = async (req: Request, res: Response) => {
  try {
    await writeFile(
      "src/assets/migrate.json",
      JSON.stringify(req.body),
      "utf-8"
    );

    // await writeFile(
    //   "src/assets/migrate.d.ts",
    //   typing(req.body.create),
    //   "utf-8"
    // );/* баг */

    await writeFile(
      "src/assets/drop.json",
      JSON.stringify({
        delete: req.body.create.map((e: any) => ({ table: e.table })),
      }),
      "utf-8"
    );

    await writeFile(
      "src/assets/endpoints.json",
      JSON.stringify(
        req.body.create.map((e: { table: string }) => ({
          url: `${req.protocol}://${req.get("host")}/api/crud/${e.table}`,
          endpoint: `/${e.table}`,
          table: e.table,
          type: `T${e.table.charAt(0).toUpperCase()}${toCamelCase(
            e.table.slice(1)
          )}`,
        }))
      )
    );

    for (const e of req.body.create as TMigrate[]) {
      const exists = await orm.schema.hasTable(e.table);
      console.log(`Таблица ${e.table} существует: ${exists}`);

      if (!exists) {
        await orm.schema.createTable(
          e.table,
          (table: Knex.CreateTableBuilder) => modifyTable(table, e.fields, {})
        );
        console.log(`Таблица "${e.table}" успешно создана!`);
      } else {
        const columns = await orm.read(e.table).columnInfo();
        console.log(`Существующие столбцы в таблице ${e.table}:`, columns);

        await orm.schema.alterTable(e.table, (table: Knex.AlterTableBuilder) =>
          modifyTable(table, e.fields, columns)
        );

        console.log(`Таблица "${e.table}" была обновлена.`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Все таблицы успешно созданы или обновлены!`,
    });
  } catch (error) {
    console.error("Произошла ошибка при миграции:", error);

    res.status(500).json({
      success: false,
      message: "Произошла ошибка при миграции.",
    });
  }
};
