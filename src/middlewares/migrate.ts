import { Knex } from "knex";
import { orm } from "./orm";
import { appendDrops } from "../helpers/append-drops";
import { appendEndpoints } from "../helpers/append-endpoints";
import { appendGqlTypes } from "../helpers/append-gql-types";
import { appendMigrates } from "../helpers/append-migrates";
import { appendTsTypes } from "../helpers/append-ts-types";
import { Req, Res } from "../types";

type TFieldTypes = "string" | "number" | "boolean" | "foreign" | "timestamp";

export type TMigrate = {
  table: string;
  fields: Record<string, TFieldTypes>;
};

type TColumns = Record<string | number | symbol, Knex.ColumnInfo>;

export const toKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
};

export const toCamelCase = (str: string) => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
};

export const toPascalCase = (str: string) => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const foreign = (
  field: string,
  columns: TColumns,
  table: Knex.AlterTableBuilder
) => {
  const [_key, _id, _table] = field.split(".");

  _key && _id && _table
    ? Object.entries({
        [_key]: { _id, _table },
      }).forEach(([key_, { _id: id_, _table: table_ }]) => {
        !Object.keys(columns).includes(key_)
          ? table.foreign(key_).references(id_).inTable(table_)
          : null;
      })
    : null;
};

const modifyTable = async (
  table: Knex.AlterTableBuilder,
  fields: TMigrate["fields"],
  columns: TColumns
) => {
  Object.entries(fields).forEach(([field, type]) => {
    !columns[field]
      ? type === "string"
        ? field === "_id"
          ? table.string(field).unique()
          : table.text(field)
        : type === "number"
          ? table.integer(field)
          : type === "boolean"
            ? table.boolean(field)
            : type === "timestamp"
              ? table.timestamp(field)
              : type === "foreign"
                ? foreign(field, columns, table)
                : null
      : null;
  });

  Object.keys(columns).forEach((column) => {
    !fields[column] ? table.dropColumn(column) : null;
  });
};

export const migrate = async (req: Req, res: Res) => {
  try {
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

    await appendMigrates(req);
    await appendDrops(req);
    await appendEndpoints(req);
    await appendTsTypes(req);
    await appendGqlTypes(req);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Произошла ошибка при миграции.",
    });

    throw new Error(String(error));
  }
};
